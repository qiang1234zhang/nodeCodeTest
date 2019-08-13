define(['app','jquery','ztreeEdit'],function(app,$){
        //表单 input-下拉树选择组件
        app.register.directive("fileComborTree", function($global_var,$q,$http,$document) {
            return {
                restrict: 'E',
                transclude:true,
                templateUrl:'templates/app/pluginTemplates/file-combor-tree.html',
                link: function(scope, element, attr) {
                    //--------------------scope初始化部分-----------------------------------------------
                    scope.dirRows=[];
                    scope.openDirTreeClick=false;
                    scope.dirztreeObj="";
                    scope.rMenu = $("#rMenu");
                    scope.isOpenrMenu=false;
                    scope.initDirTree=function(){

                        var rootNode = {"id":"0", "name":"目录", "open":true, "isParent":true};
                        $.fn.zTree.init($('#filecombortreeId'), dirTreeSetting, rootNode);
                        scope.dirztreeObj = $.fn.zTree.getZTreeObj("filecombortreeId");
                        // var node = zTreeObj.getNodeByParam("id", 0, null);
                        // zTreeObj.reAsyncChildNodes(node, "refresh");
                    };

                    //---------------------tree操作部分--------------------------------------------------
                    var dirTreeSetting = {
                        view:{
                            showIcon:false
                        },
                        async:{
                            enable: true,
                            url:$global_var.base_url+attr.url,
                            type: "get",
                            dataType:"json",
                            autoParam:["id=pId"]
                        },
                        check:{
                            enable:true,
                            chkboxType: { "Y": "", "N": "" }
                        },
                        callback:{
                            onCheck:onCheckDirTree,
                            onRightClick: OnRightClick,
                            onRename:onRename,
                            onExpand:zTreeOnExpand
                        }
                    };
                    function idFilter(treeId, parentNode, childNodes) {
                        angular.forEach(childNodes, function(dataNode,index,array){
                            dataNode.id = dataNode.id.slice(1);
                        });
                    }
                    function onCheckDirTree(e, treeId, treeNode) {
                        var showTableName = "";
                        var showTableType = "";
                        var selectNodes = scope.dirztreeObj.getCheckedNodes(true);
                        if(selectNodes && selectNodes.length>0){
                            scope.currentCheckType = "1";
                            angular.forEach(selectNodes, function(dataNode,index,array){
                                if("0"===dataNode.id){
                                }else{
                                    if(scope.currentDataSourceType==="23"){
                                        showTableName += (dataNode.id + '/,');
                                    }else{
                                        showTableName += (dataNode.id + ',');
                                    }
                                    showTableType += (dataNode.isParent + ',');
                                }

                            });
                            showTableName = showTableName.slice(0, showTableName.length - 1);
                            showTableType = showTableType.slice(0, showTableType.length - 1);
                        }else{
                            scope.currentCheckType = "2";
                        }
                        scope.selectDirName = showTableName;
                        scope.selectDirType = showTableType;
                        scope.$apply();  //外部dom改变scope，手动调用$apply来刷新加载scope
                    }

                    //----------------------dom操作部分----------------------------------------------------
                    scope.showDirSearch=function(obj){
                        if(!scope.openDirTreeClick){
                            scope.openDirTreeClick=true;
                            dirTreeSetting.async.otherParam = { "id":scope.currentDirDataSourceId};
                            //？？？延迟加载初始化树
                            setTimeout(function(){
                                scope.initDirTree();

                                //当弹出框内点击时，阻止$document click事件
                                $(".showDirInfo").click(function(event){
                                    event.stopPropagation();
                                });
                            },300);
                        }

                    }
                    scope.hideDirSearch=function(){
                        scope.dirztreeObj=null;
                        scope.openDirTreeClick=false;
                        addCount=0;
                    }
                    scope.isOpenrMenu=false;
                    scope.rMenuClick=function () {

                        scope.isOpenrMenu=true;
                    };
                    $document.click(function(){

                        $("#rMenu").click(function(event){
                            event.stopPropagation();
                        });
                        if(scope.openDirTreeClick&&scope.dirztreeObj&&!scope.isOpenrMenu){

                            scope.hideDirSearch();
                            scope.$apply();  //外部dom改变scope，手动调用$apply来刷新加载scope
                        }
                        scope.isOpenrMenu=false;
                    });

                    <!-- ztree树添加节点部分 start -->
                    function OnRightClick(event, treeId, treeNode) {
                        if(treeNode){
                            scope.dirztreeObj.selectNode(treeNode);
                            showRMenu(event.clientX, event.clientY);
                        }
                    }
                    function onRename(event, treeId, treeNode, isCancel){

                        if(treeNode.parentId==0){
                            treeNode.parentId=scope.basePath;
                        }
                        treeNode.id=treeNode.parentId+"/"+treeNode.name;
                        var url=$global_var.base_url+attr.addnodeurl;
                        var parmObj={fileSourceId :scope.currentDirDataSourceId,path :treeNode.id,isDir :"1"}

                        $http({
                            method: 'POST',
                            url:url,
                            data:parmObj
                        }).success(function(result) {
                            var content=angular.fromJson(result.content);
                            if(content==true){
                                console.log("服务增加目录成功.");
                                scope.content="服务增加目录成功";
                                scope.animate = true;

                            }else{

                                scope.dirztreeObj.removeNode(treeNode);
                                console.log("服务增加目录失败："+result.content);
                                scope.content="服务增加目录失败";
                                scope.animate = true;
                            }
                        }).error(function(err){
                            scope.dirztreeObj.removeNode(treeNode);
                            console.log("服务增加目录失败："+err);
                            scope.content="服务增加目录失败";
                            scope.animate = true;
                        });
                    }
                    var addCount = 1;
                    function zTreeOnExpand(event, treeId, treeNode){

                        if(scope.isAddNode){
                            editNode(treeNode);

                        }
                    }

                    function showRMenu(x, y) {
                        $("#rMenu ul").show();
                        scope.rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});
                        $("body").bind("mousedown", onBodyMouseDown);
                        scope.isOpenrMenu=true;
                    }
                    function hideRMenu() {
                        if (scope.rMenu){
                            scope.rMenu.css({"visibility": "hidden"});
                        }

                        $("body").unbind("mousedown", onBodyMouseDown);
                        scope.isOpenrMenu=false;
                    }
                    function editNode(treeNode) {
                        var newNode ={checked:false,chkDisabled:false,isParent:true,parentId:treeNode.id, name:"子目录" + (addCount++)};
                        treeNode=scope.dirztreeObj.addNodes(treeNode, newNode);
                        scope.dirztreeObj.editName(treeNode[0]);
                        scope.isAddNode=false;
                    }
                    function onBodyMouseDown(event){
                        if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
                            scope.rMenu.css({"visibility" : "hidden"});
                        }
                    }

                    scope.isAddNode=false;
                    scope.addTreeNode=function () {
                        hideRMenu();
                        scope.isAddNode=true
                        var treeNode = scope.dirztreeObj.getSelectedNodes()[0];

                        if (treeNode) {
                            if(treeNode.open){
                                editNode(treeNode);
                            }else{
                                scope.dirztreeObj.expandNode(treeNode,true,false,false,true);
                            }

                        }
                    }

                    $('#chooseDir').on('hide.bs.modal', function (e) {

                        scope.selectDirName="";
                    });

                    <!-- ztree树添加节点部分 end -->
                }
            }
        });


    })