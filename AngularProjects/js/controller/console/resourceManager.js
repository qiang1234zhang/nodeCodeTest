/**
 * Created by huangfx on 2016/12/8.
 */

define(['app', "js/service/console/resourceManagerService"], function(app) {
    app.register.controller('appIndex.resourceManager', ['$scope', '$state', '$global_var','$resourceManagerService','FileUploader',function($scope, $state, $global_var,$resourceManagerService,FileUploader) {
        $scope.messageUser = "请选择租户";
        $scope.pageItemNum = Math.floor(($(".contentMain").height()-280) / 45) > 0 ? Math.floor(($(".contentMain").height()-180) / 45) :1;//计算基于显示器能容纳的数据条数
        $scope.pageNum = 1;
        $scope.resPath = "";
        $scope.resSize = "";
        $scope.resId = "";

        //--------------------分页查询--------------------//
        $scope.pageChanged = function(){

            queryByPage();
        };

        //查询函数
        var queryByPage = function(){
            $scope.selectAll = false;
            var page = null;
            if($scope.key === "" || !$scope.key) {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum
                };
            }else {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "name":$scope.key
                    }
                };
            }
            $resourceManagerService.queryByPage(page).then(function(result){
                console.group("【资源包部署分页查询】'base/resourcePackRestServer/byPage'");
                console.group("提交数据");
                console.dir(page);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $scope.pageTotal = result.total;
                $scope.dataItems = result.rows;
                $scope.isShowContentBottom = result.total == 0 ?false:true;
            });
        } ;

        //文件上传需要的函数
        $scope.uploader = new FileUploader({
            url: $global_var.base_url+'base/servlet/tempDirUploadHandleServlet',
            method: "POST"
        });
        //清空文件队列
        $scope.clearItems = function(){
            $scope.uploader.clearQueue();
            $scope.typeErr=false;
            $scope.uploadSuccess= false;
            $scope.uploadError = false;
            $("#upload").val("");
        };

        $scope.uploader.onAfterAddingFile = function(fileItem) {
            $scope.fileName = $scope.uploader.queue[0].file.name;
            var fileTypeArr = $scope.uploader.queue[0].file.name.split(".");
            var fileType = fileTypeArr[fileTypeArr.length-1];
            if(fileType==="gz"){
                $scope.typeErr = false;
            }
            else{
                $scope.typeErr = true;
                $scope.uploader.clearQueue();
            }
            $scope.uploadError = false;
            $scope.$apply()
        };

        $scope.uploader.onBeforeUploadItem = function(item) {
             if (item._file.size == 0) {
                 $scope.uploadError = true;
                 $scope.uploader.cancelAll();
                 return ;
             } else {
                 $scope.uploadError = false;
             }
             // $scope.uploader.clearQueue();
             // $scope.typeErr=false
         };


        //文件上传成功返回的信息
        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers,progress) {
            console.group("【上传文件】''");
            console.group("提交数据");
            console.dir($scope.uploader.queue[0]);
            console.groupEnd();
            console.group("接收数据");
            console.dir(response);
            console.groupEnd();
            console.groupEnd();
            var contents= new Array(); //定义一数组
            contents=response.content.split("$_@@_$"); //字符分割
            console.group("contents="+contents);
            if(response.status==="success"){
                //$scope.content="资源包上传成功";
                $scope.resPath = contents[1];
                $scope.resSize = contents[2];
                $scope.requireUpload =false;
                $scope.uploadSuccess = true;
                console.group("resPath="+$scope.resPath);
                console.group("resSize="+$scope.resSize);
            }else{
                //$scope.content="资源包上传失败";
                $scope.uploadSuccess = false;
            }
            $scope.content=response.message;
        };

        //文件上传失败返回的信息
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        $scope.fileUploadByRes = function(){
            if (typeof ($scope.uploader.queue[0]) == 'undefined') {
                Alert("请先选择要上传的文件！");
            }
            $scope.uploader.uploadAll();
        };


        //得到新建页面
        $scope.getAddPage = function(){
            $("#upload").val("");
            $scope.info = "";
            $scope.fileName = "";
            $scope.clearItems();
            $scope.create.resName = "";
            $scope.create.contextPath= "";
            $scope.create.resVersion= "";
            $scope.resPath = "";
            $scope.resSize = "";
           /* $scope.resNameRepeat = false;
            $scope.isResEditPage = false;*/
            $scope.requireUpload = false;
            $scope.uploadSuccess = false;
            $scope.isEditPage = false;
            $scope.uploadError = false;
        };

        //---------------新建页面向后台提交信息--------------
        $scope.create = function(valid){
            if($scope.resPath===""){
                $scope.requireUpload = true;
                return;
            }
            if(valid) {
                var resItem = {
                    "name":$scope.create.resName,
                    "resVersion":$scope.create.resVersion,
                    "contextPath":$scope.create.contextPath,
                    "path":$scope.resPath,
                    "size":$scope.resSize
                };

                $resourceManagerService.create(resItem).then(function(result) {
                    console.group("【资源包新建】'base/resourcePackRestServer/creating'");
                    console.group("提交数据");
                    console.dir(resItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();
                    if(result.status === "success") {
                        $scope.content = "资源包创建成功"
                    } else {
                        $scope.content = "资源包创建失败"
                    }
                    queryByPage();
                    $("#create").modal("hide");
                    $scope.animate = true;
                });
            }

        };


        //得到编辑页面
        $scope.getUpdatePage = function(data) {
            $scope.resEditData = data;

            $scope.edit.resName = data.name;
            $scope.edit.contextPath= data.contextPath;
            $scope.edit.resVersion= data.resVersion;

            $scope.requireUpload = false;
            $scope.uploadSuccess = false;
            $scope.isEditPage = true;
        };

        //--------------------编辑向后台提交数据--------------------//
        $scope.edit = function(valid) {
            if(valid) {
                var resItem = {
                    "id": $scope.resEditData.id,
                    "name":$scope.edit.resName,
                    "resVersion":$scope.edit.resVersion,
                    "contextPath":$scope.edit.contextPath

                };
                $resourceManagerService.edit(resItem).then(function(result) {
                    console.group("【资源包修改】'base/resourcePackRestServer/updating'");
                    console.group("提交数据");
                    console.dir(resItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();
                    if(result.status === "success") {
                        $scope.content = "资源包编辑成功"
                    } else {
                        $scope.content = "资源包编辑失败"
                    }
                    queryByPage();
                    $('#edit').modal('hide');
                    $scope.animate = true;
                });
            }

        };

        //--------------------批量删除--------------------//
        //批量删除确定按钮
        $scope.massDeletion = function(){
            $scope.massDeletionArr=[];
            $(".massDeletion").each(function() {
                if($(this).prop("checked")) {
                    $scope.massDeletionArr.push($(this).attr("id"))
                }
            });
            if($scope.massDeletionArr.length!==0){
                $('#massDeletion').modal('show');
            }else{
                Alert("请选择需要删除的数据！");
            }
        };

        $scope.delete = function(){
            var data = $scope.global_function.massdelete($scope.massDeletionArr);
            $resourceManagerService.delete(data).then(function(result){
                console.group("【删除数据】'base/resourcePackRestServer/deleting?ids='");
                console.group("提交数据");
                console.dir(data);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $scope.content= result.message;
                queryByPage();
                $('#massDeletion').modal('hide');
                $scope.animate=true
            });
        };

        //资源包名称去重
        $scope.checkResRepeat = function(resName) {
            if(typeof($scope.isEditPage == false?$scope.create.resName:$scope.edit.resName) != "undefined") {
                var resNameItem = {
                    "id":$scope.isEditPage == false?null:$scope.resEditData.id,
                    "name": resName
                };
                $resourceManagerService.nameRepeat(resNameItem).then(function(result) {
                    console.group("【资源名去重校验】'base/resourcePackRestServer/checkName'");
                    console.group("提交数据");
                    console.dir(resNameItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    if($scope.isEditPage == false){
                        if(result.content == "true"){
                            $scope.addForm.resName.$setValidity('unique', false);
                        }else{
                            $scope.addForm.resName.$setValidity('unique', true);
                            $scope.create.isChecked = false
                        }
                    }else{

                        if(result.content == "true"){
                            $scope.editForm.resName.$setValidity('unique', false);
                        }else{
                            $scope.editForm.resName.$setValidity('unique', true);
                            $scope.edit.isChecked = false
                        }
                    }

                });
            }
        };

        //回车事件
        $scope.mykey=function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                queryByPage();
            }
        };

        queryByPage();
    }]);
});

