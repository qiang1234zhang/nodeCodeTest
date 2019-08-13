define(['app','jquery','underscore'],function(app,$,_){
        //表单 input-下拉树选择组件
        app.register.directive("comborTree", function($global_var,$q,$http,$document) {
            return {
                restrict: 'E',
                transclude:true,
                templateUrl:'templates/app/pluginTemplates/combor-tree.html',
                link: function(scope, element, attr) {
                    //--------------------scope初始化部分-----------------------------------------------

                    if(attr.messages){
                        scope.messageList = JSON.parse(attr.messages)
                    }
                    scope.rows=[];
                    scope.openTreeClick=false;
                    scope.initTree=function(){
                        $.fn.zTree.init($('#combortreeId'), comborsetting, []);

                        if(scope.selectTableName){
                            var checknodes=scope.selectTableName.split(",");
                            _.each(scope.rows,function (obj) {
                                var a=_.indexOf(checknodes,obj.name);
                                if(a!=-1){
                                    obj.checked=true;
                                }
                            });
                        }
                        scope.zztreeObj = $.fn.zTree.getZTreeObj("combortreeId");
                        scope.zztreeObj.addNodes(null,scope.rows);
                        scope.zztreeObj.expandAll(true);
                    };

                    //新建
                    scope.getTreeData = function(){

                        var deferred=$q.defer();
                        $http({
                            method: 'GET',
                            url:$global_var.base_url +attr.url+"?id="+scope.currentTableDataSourceId,
                        }).success(function(result) {
                            deferred.resolve(result);
                        }).error(function(err){
                            deferred.reject(false);
                            console.log(err);
                        });
                        return deferred.promise;
                    };

                    //---------------------tree操作部分--------------------------------------------------
                    var comborsetting = {
                        view:{
                            showIcon:false
                        },
                        check:{
                            enable:true,
                            chkboxType: { "Y": "", "N": "" }
                        },
                        callback:{
                            onCheck:onCheckTree
                        }
                    };
                    function onCheckTree(e, treeId, treeNode) {
                        var showTableName = "";
                        var selectNodes = scope.zztreeObj.getCheckedNodes(true);
                        if(selectNodes && selectNodes.length>0){
                            angular.forEach(selectNodes, function(dataNode,index,array){
                                showTableName += (dataNode.id + ',')
                            });
                            showTableName = showTableName.slice(0, showTableName.length - 1)
                        }
                        scope.selectTableName=showTableName;
                        scope.$apply();  //外部dom改变scope，手动调用$apply来刷新加载scope
                    }

                    //----------------------dom操作部分----------------------------------------------------
                    scope.showSearch=function(obj){
                        if(!scope.openTreeClick){
                            scope.openTreeClick=true;
                            scope.getTreeData().then(function (result) {

                                if(result.content==""){
                                    scope.rows = [];
                                }else {
                                    scope.rows = angular.fromJson(result.content);
                                }
                                scope.initTree();

                                //当弹出框内点击时，阻止$document click事件
                                $(".showInfo").click(function(event){
                                    event.stopPropagation();
                                });
                            });
                        }
                    }
                    scope.hideSearch=function(){
                        scope.zztreeObj=null;
                        scope.openTreeClick=false;
                    }
                    $('#chooseTable').on('hide.bs.modal', function (e) {
                        scope.selectTableName="";
                    });
                    $document.click(function(){
                        if(scope.openTreeClick&&scope.zztreeObj){
                            scope.hideSearch();
                            scope.$apply();  //外部dom改变scope，手动调用$apply来刷新加载scope
                        }
                    });
                }
            }
        });


    })