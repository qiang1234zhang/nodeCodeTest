!define(["underscore"], function (_) {

    var NodeUtil = {
        plugtypes: [],
        nodes: [],

        allNodeInfo: _.create(null),
        allLineList: _.create(null),//所有线段
        maxIndex: 1,//节点id索引，最开始为1
        subFlowItems:{          // 子流程参数配置项
            isMultiton:false,   //是否多实例循环
            inValue:"",          //输入变量（被迭代集合）
            outValue:"",         //迭代变量(输出变量)
            orderDo:true            //是否顺序执行
        },
        /**
         * 生成流程节点id
         */
        getNodeId: function () {
            this.maxIndex++;
            return "node_" + this.maxIndex;
        },
        /**
         * 根据流程id,所有节点集合，线段集合生成流程运行xml
         * @param wfId 流程id
         * @param nodeArr flash流程里的节点集合
         * @param lineArr flash流程里的线段集合
         * @returns {string} xml格式数据
         */
        getXml: function (wfId, nodeArr, lineArr) {
            var xmlArr = [
                "<process id=\"" + wfId + "\" isClosed=\"false\" isExecutable=\"true\" processType=\"None\">"
            ];
            var excludeSubNodeList = getChildNodeListByParent(nodeArr, "");
            generateChildNodeList(nodeArr, lineArr, excludeSubNodeList, xmlArr);
            generateChildLineList(getLineListByParent(lineArr, ""), xmlArr);
            xmlArr.push("</process>");//结束
            return xmlArr.join("");
        },
        /**
         * 获取流程保存参数
         * @returns {*}
         */
        getAllNodesJson: function () {
            var json = _.create(null);
            json.pluginKeyPluginCode = _.create(null);
            json.pluginSetValue = _.create(null);
            _.each(this.allNodeInfo, function (value, key) {
                json.pluginKeyPluginCode[key] = value.code;
                json.pluginSetValue[key] = value.jsonInfo;
            });
            return json;
        },
        /**
         * 根据输入变量查找对应节点信息
         * @param inVar 输入变量
         * @returns {null}
         */
        getRelationshipSourceNodeByInVar: function (inVar) {
            if (!this.allNodeInfo || !inVar) {
                return null;
            }
            return _.find(this.allNodeInfo, function (value) {
                if (value.jsonInfo && value.jsonInfo.outValue === inVar) {
                    return true;
                }
                return false;
            });
        },

        /**
         * 保存流程校验
         * @param nodeArr 所有节点
         * @param lineArr 所有线段

         */
        verifyRule: function (nodeArr, lineArr) {

            var startId = "";
            var endId = "";
            var counterId = ""; //计数器插件id
            var incrementSelectId = ""  //表增量id
            var startSum = 0;
            var endSum = 0;
            var counterSum = 0; //统计有多少个计数器插件
            _.each(nodeArr, function (obj) {
                if (obj.code == "startEvent") {
                    startId = obj.id;
                    startSum++;
                } else if (obj.code == "endEvent") {
                    endId = obj.id;
                    endSum++;
                } else if (obj.code == "db_increment_counter") {
                    counterId = obj.id;
                    counterSum++;
                } else if (obj.code == "db_increment_select"||obj.code=="db_increment_selectresolve"||obj.code=="elastic_increment_select") {
                    incrementSelectId = obj.id;
                }
            });

            if (startId == "") {
                return "没有开始节点，不能保存。";
            }
            ;
            if (endId == "") {
                return "没有结束节点，不能保存。";
            }
            ;
            if (incrementSelectId == "" && counterId != "") {
                return "计数器插件必须配合增量查询插件使用，如不需要请删除。"
            }
            ;
            if (counterSum > 1) {
                return "计数器插件最多只能有一个。";
            }
            ;
            if (incrementSelectId != "" && counterId == "") {
                return "增量查询插件需要一个计数器插件。"
            }
            if(incrementSelectId!=""&&counterId!=""){
                var startLineObj = _.find(lineArr,function(obj){return obj.startNode.id==startId});
                var endLineObj = _.find(lineArr, function(obj){return obj.endNode.id==endId});

                if(!startLineObj||!endLineObj){
                    return  "存在未闭合线段、节点，请检查。";
                }
                var route=[];
                var  obj=startLineObj;
                while(obj.endNode.id!=endId){
                    var id=obj.endNode.id;
                    route.push(id);
                    obj= _.find(lineArr, function(x){return x.startNode.id==id});
                };

                var a= route.lastIndexOf(incrementSelectId);
                var b= route.lastIndexOf(counterId);
                if(a>b){
                    return "计数器插件必须在增量查询插件后执行。";
                }
            }

            //code subflow  parentId {code:"subflow"}
            var a=_.find(nodeArr,function (obj) {
                return obj.code=="subflow";
            })
            if(a){
                var subNodes=_.filter(nodeArr,function (obj) {
                    return obj.parentId==a.id&&(obj.code=="startEvent"||obj.code=="endEvent");
                });
                if(subNodes.length!=2){
                    return "子流程中必须包含一个开始节点，一个结束节点。";
                }

            }
            return true;
        }
    };


    /**
     * * 根据parentId获取相应的所有子流程节点
     * parentId 为空获取所有子节点(不包括子流程里面的节点，但包括子流程本身)
     * @param nodeArr
     * @param parentId
     */
    function getChildNodeListByParent(nodeArr, parentId) {
        var i = 0;
        var childArr = [];
        for (; i < nodeArr.length; i++) {
            if (nodeArr[i].parentId === parentId) {
                childArr.push(nodeArr[i])
            }
        }
        return childArr;
    }

    /**
     * 根据parentId获取对应的节点信息
     * @param lineArr
     * @param parentId 如果为空,表明是
     * @returns {Array}
     */
    function getLineListByParent(lineArr, parentId) {
        var i = 0;
        var childArr = [];
        for (; i < lineArr.length; i++) {
            if (lineArr[i].startNode.parentId === parentId) {
                childArr.push(lineArr[i])
            }
        }
        return childArr;
    }


    function generateChildNodeList(sourceNodeList, sourceLineList, nodeList, xmlArr) {
        var i = 0,
            nodeId = null,
            nodeName = null,
            className = null,
            extensionAttrList = null;

        for (; i < nodeList.length; i++) {
            if (nodeList[i].code === "startEvent" || nodeList[i].code === "endEvent") {
                xmlArr.push(generateSpecialNodes(nodeList[i].code, nodeList[i].id, nodeList[i].point));
                continue;
            }
            if (nodeList[i].code === "subflow") {
                //子流程
                var subProcessStr="<subProcess id=\"" + nodeList[i].id +  "\" point=\"" + nodeList[i].point + "\" name=\"" + nodeList[i].name + "\" >";
                //子流程多实例循环
                if(this.nodeUtil.subFlowItems.isMultiton){
                    subProcessStr+="<multiInstanceLoopCharacteristics activiti:collection=\""+this.nodeUtil.subFlowItems.inValue+"\" activiti:elementVariable=\""+this.nodeUtil.subFlowItems.outValue+"\" isSequential=\""+this.nodeUtil.subFlowItems.orderDo+"\"  />";
                }
                xmlArr.push(subProcessStr);
                var childList = getChildNodeListByParent(sourceNodeList, nodeList[i].id);
                generateChildNodeList(sourceNodeList, sourceLineList, childList, xmlArr);
                generateChildLineList(getLineListByParent(sourceLineList, nodeList[i].id), xmlArr);
                xmlArr.push("</subProcess>");
            } else {
                nodeId = nodeList[i].id;
                nodeName = nodeList[i].name;
                className = nodeList[i].className;
                if (nodeList[i].defaultGateway) {
                    extensionAttrList = [{"default": nodeList[i].defaultGateway}];
                }
                xmlArr.push(generateSpecialNodes(nodeList[i].code, nodeId, nodeList[i].point, nodeName, className, extensionAttrList));
                extensionAttrList = null;

            }//end else
        }
    }

    /**
     * 根据线段集合和xmlArr生成线段xml
     * @param lineList 线段集合
     * @param xmlArr
     */
    function generateChildLineList(lineList, xmlArr) {
        var i = 0;
        var line = null,
            allLineList = NodeUtil.allLineList,
            lineArr = [];
        for (; i < lineList.length; i++) {
            line = lineList[i];
            lineArr.push("<sequenceFlow id=\"" + line.id + "\" " +
                "linetype=\"" + line.linetype + "\" " +
                "sourceRef=\"" + line.startNode.id + "\" " +
                "targetRef=\"" + line.endNode.id + "\">");
            if (allLineList[line.id]) {
                lineArr.push("<conditionExpression xsi:type=\"tFormalExpression\"><![CDATA[" + allLineList[line.id].conditionExpression + "]]></conditionExpression>")
            }
            lineArr.push("</sequenceFlow>")
            xmlArr.push(lineArr.join(""));
            lineArr.length = 0;
        }
        allLineList = null;
        lineArr = null;
    }

    /**
     * 根据节点类型，节点id, 以及节点坐标生成对应的xml
     * @param nodeType 节点类型,其实就是节点code
     * @param nodeId 节点id
     * @param point 坐标
     * @param nodeName 节点名称
     * @param className java class类名称
     * @param extensionAttrList  扩展属性
     * @returns {string}
     */
    function generateSpecialNodes(nodeType, nodeId, point, nodeName, className, extensionAttrList) {
        var xml = "";
        switch (nodeType) {
            case "startEvent":
                xml = "<startEvent id=\"" + nodeId + "\" name=\"开始\" point=\"" + point + "\"/>";
                break;
            case "endEvent":
                xml = "<endEvent id=\"" + nodeId + "\" name=\"结束\" point=\"" + point + "\"/>";
                break;
            case "exclusiveGateway":
                xml = ["<exclusiveGateway id=\"" + nodeId + "\" name=\"排他网关\" point=\"" + point + "\""];
                if (_.isArray(extensionAttrList)) {
                    _.forEach(extensionAttrList, function (value) {
                        _.forEach(value, function (value1, key1) {
                            xml.push(" " + key1 + "=\"" + value1 + "\"");
                        })
                    });
                }
                xml.push("/>");
                xml = xml.join("");
                break;
            case "inclusiveGateway":
                xml = ["<inclusiveGateway id=\"" + nodeId + "\" name=\"包含网关\" point=\"" + point + "\""];
                if (_.isArray(extensionAttrList)) {
                    _.forEach(extensionAttrList, function (value) {
                        _.forEach(value, function (value1, key1) {
                            xml.push(" " + key1 + "=\"" + value1 + "\"");
                        })
                    });
                }
                xml.push("/>");
                xml = xml.join("");
                break;
            case "parallelGatewayStart"://并行网关
                xml = "<parallelGateway id=\"" + nodeId + "\" name=\"并行开始\" point=\"" + point + "\"/>";
                break;
            case "parallelGatewayEnd"://并行网关
                xml = "<parallelGateway id=\"" + nodeId + "\" name=\"并行结束\" point=\"" + point + "\"/>";
                break;
            default:
                xml = [];
                xml.push("<serviceTask id=\"" + nodeId + "\" ");
                xml.push("activiti:class=\"" + className + "\" ");
                xml.push("point=\"" + point + "\" ");
                xml.push("activiti:exclusive=\"true\" ");
                xml.push("name=\"" + nodeName + "\" ");
                xml.push(">");
                xml.push("</serviceTask>");
                xml = xml.join("");
                break;
        }
        return xml;
    }


    return NodeUtil;
});