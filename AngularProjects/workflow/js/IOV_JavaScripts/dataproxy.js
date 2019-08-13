define(["base"], function (base) {
    /**
     * 全局value
     * @type {{}}
     */
    var swapValue = {
        currentNodeId: null,
        avaWf: null,
        EE: null,
        selectTableTree: null
    };

    //var path = window.parent.restPath+window.parent.contextPath;
    var path = window.parent.restPath+"db";
    var dataProxy;
    dataProxy = {
        /**
         * 获取所有数据源类型
         * @returns {*}
         */
        getDataSourceType: function () {
            return base.doGetData(path + "/database/getDataSourceType");
        },

        /**
         * 获取所有文件系统类型
         * @returns {*}
         */
        getFileSourceType: function () {
            return base.doGetData(path + "/fileSystem/getFileSourceTypes");
        },
        /**
         * 自定义规则数据源
         * @returns {*}
         */
        getCustomRuleList: function () {
            return base.doGetData(path + "/ruleManagerRestServer/getCustomRuleList");
        },
        /**
         * 自定义规则根据ID 取属性
         * @returns {*}
         */
        getCustomRuleAttr: function (id) {
            return base.doGetData(path + "/ruleManagerRestServer/getCustomRuleAttr?id="+id);
        },
        /**
         * 根据数据源类型获取所有数据源
         * @param typeId 数据源类型id
         * @returns {*}
         */
        getDataSource: function (typeId) {
            return base.doGetData(path + "/database/getDataSource?sourceType=" + typeId);
        },
        /**
         * 根据文件系统类型获取文件系统数据源
         * @param typeId
         * @returns {*}
         */
        getFileSource: function (typeId) {
            return base.doGetData(path + "/fileSystem/getFileSource?sourceType=" + typeId);
        },
        /**
         * 根据文件系统数据源获取目录和文件
         * @param typeId
         * @returns {*}
         */
        listFileAndDir: function (typeId) {
            return base.doGetData(path + "/fileSystem/listFileAndDir?id=" + typeId);
        },

        /**
         * 根据数据源获取
         * @param sourceId 数据源id
         * 返回格式为[
         * {id: "", name: ""}
         * ]
         */
        getDataSourceTables: function (sourceId) {
            return base.doGetData(path + "/database/getDataSourceTables?sourceId=" + sourceId);
        },
        /**
         * 根据数据源获取_ES
         * @param sourceId 数据源id
         * 返回格式为[
         * {id: "", name: ""}
         * ]
         */
        getDataSourceTables_ES: function (sourceId) {
            return base.doGetData(path + "/database/getDataSourceTables?type=00000004&sourceId=" + sourceId);
        },
        /**
         * 根据选择的表获取sql语句
         * @param ids
         * @returns {*}
         */
        getTableSql: function (ids) {
            return base.doGetData(path + "/database/getTableSql?ids=" + ids);
        },
        getColumns: function (sourceId, sql) {
            return base.doGetData(path + "/database/getColumns?sourceId=" + sourceId + "&sql=" + sql);
        },
        /**
         * 根据表id获取表字段接口
         * @param tableId 表id
         * @returns {*}
         */
        getColumnsByTableId: function (tableId) {
            return base.doGetData(path + "/database/getColumnsByTableId?tableId=" + tableId);
        },
        /**
         * 获取文件系统类型
         * @param
         * @returns {*}
         */
        getFileSystemType: function () {
            return base.doGetData(path + "/fileSystem/getFileSourceTypes");
        },
        /**
         * 根据文件系统类型获取文件系统名称
         * @param
         * @returns {*}
         */
        getFileSystemNameByType: function (sourceType) {
            return base.doGetData(path + "/fileSystem/getFileSource?sourceType=" + sourceType);
        },
        /**
         * 根据文件系统名称ID获取目标文件
         * @param
         * @returns {*}
         */
        getFileByFileSystemId: function (id) {
            return base.doGetData(path + "/fileSystem/listFileAndDir?id=" + id);
        },
        /**
         * 根据文件系统名称ID和文件路径获取表头信息(异步)
         * @param sourceId
         * @param filePath
         * @param sheetIndex
         * @param rowIndex
         * @returns {*}
         */
        getColumnsByFile: function (sourceId,filePath,sheetIndex,rowIndex,isDir) {
            return base.doGetData(path + "/fileSystem/getColumnsByFile?sourceId=" + sourceId+"&filePath="+filePath+"&fileFormat="+fileFormat+"&sheetIndex="+sheetIndex+"&rowIndex="+rowIndex+"&isDir="+isDir);
        },
        /**
         *  获取数据源增加的目录和文件
         * @param sourceId
         * @param filePath
         * @param sheetIndex
         * @param rowIndex
         * @param isDir
         * @returns {*}
         */
        getFileCatalog: function (fileSourceId) {
            return base.doGetData(path + "/fileCatalogRestServer/getFileCatalog?fileSourceId="+fileSourceId);
        },
        /**
         *  获取数据源增加的目录
         * @param sourceId
         * @param filePath
         * @param sheetIndex
         * @param rowIndex
         * @param isDir
         * @returns {*}
         */
        getFileCatalogDir: function (fileSourceId) {
            return base.doGetData(path + "/fileCatalogRestServer/getFileCatalogDir?fileSourceId="+fileSourceId+"&isDir=true");
        },
        /**
         * 读取数据类型
         * @returns {*}
         */
        getDataType: function () {
        
            return base.doGetDataAsync(path + "/fileSystem/getDataType","",false);
        },
        /**
         * 获取数据格式类型
         * @param
         * @returns {*}
         */
        getFormatItems: function () {
            return base.doGetDataAsync(path + "/fileSystem/getDataFormat","",false);
        },
        //
        getFormatItemsAsync: function () {
            return base.doGetData(path + "/fileSystem/getDataFormat");
        },


        /**
         * 获取表头
         * @param
         * @param
         * @param
         * @param
         * @returns {*}
         */
        getInput_TableTitle: function (sourceId,filePath,fileFormat,sheetIndex,rowIndex,isDir) {
            return base.doGetDataAsync(path + "/fileSystem/getColumnsByFile?sourceId=" + sourceId+"&filePath="+filePath+"&fileFormat="+fileFormat+"&sheetIndex="+sheetIndex+"&rowIndex="+rowIndex+"&isDir="+isDir,"",false);
        },
        /**
         * 获取索引数据库类型
         * @param
         * @param
         * @param
         * @param
         * @returns {*}
         */
        getESSourceType: function () {
            return base.doGetData(path + "/ES/getDataSourceType");
        },
        /**
         * 获取转换方式
         * @param
         * @param
         * @param
         * @param
         * @returns {*}
         */
        getTransType: function () {
            return base.doGetData(path + "/fileSystem/getTransMode");
        },
        /**
         * 获取指标项数据源信息
         * @param  itemManageId  --指标项id
         * @param   type         --0：源数据源，1：目标数据源
         * @returns {"content": {
                                dsTypeId:"", //数据源类型
                                dsId:"",      //数据源ID
                                //tableName:"", //表名
                                tableId:""     //表ID
                                }
                        "message":"",
                        "status":"success"}
         */

        getDataSourceByItemManageId: function (type) {

            var itemManageId= window.parent.itemManageId;
            return base.doGetData(window.parent.restPath+"dg" + "/itemRestServer/getDataSourceByItemManageId?itemManageId="+itemManageId+"&type="+type);
        },
        getDataSourceByItemManageId_: function (type) {

            var itemManageId= window.itemManageId;
            return base.doGetData(window.restPath+"dg" + "/itemRestServer/getDataSourceByItemManageId?itemManageId="+itemManageId+"&type="+type);
        }


    };

    return {
        dataProxy: dataProxy,
        swapValue: swapValue
    };

});