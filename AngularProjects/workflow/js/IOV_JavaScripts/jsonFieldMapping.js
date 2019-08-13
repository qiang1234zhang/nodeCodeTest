define([], function () {
    /**
     * mapping字段映射,key为服务端的字段名称，value为js流程客户端的字段名称
     * @type {{}}
     */
    var mappingField = {
        columnList: "$fieldColumns",//字段映射集合
        pluginName: "pluginName",//插件名称,步骤名称
        pluginCode: "pluginCode",//插件code
        activitiNodeId: "nodeId",//流程节点id
        dbType: "dsTypeId",//数据源类型
        dataSourceId: "dsId",//数据源id
        sql: "sql",//sql语句
        pageSize: "pageSize",
        packageSize: "packageSize",
        inValue: "inValue",
        outValue: "outValue",
        actionType: "actionType",
        tableName: "tableName",
        queryBuilderList: "sqlConditionList",
        fieldMapList: "fieldMapList",

        fileType: "fileTypeId",  //数据源类型
        fileSourceId: "fileId",  ///文件类型数据源id
        filePath: "filePath",  //目标文件路径(包含文件名)
        sheetName: "sheetName", //sheet页的名称
        docType: "docType",//数据文档名称
        fileFormat:"fileFormat",//文件类型
        sheetIndex:"sheetIndex",//第几个sheet页
        rowIndex:"rowIndex",  //从第几行开始读取
        fileName:"fileName",
        isDir:"isDir",
        conditionExpression: "conditionExpression",
        rulesScriptId:"rulesScriptId",
        filterType: "filterType",
        filterContent: "filterContent",
        pkInfo:"pkInfo",      //主键信息
        TransformationList:"transformationList",
        dataEncryptInfoList:"dataEncryptInfoList",
        dataDecryptInfoList:"dataDecryptInfoList",
        aggregationConditionList:"aggregationConditionList",  //聚合条件  from聚合插件
        aggregationsList:"aggregationsList" ,   //聚合字段  from聚合插件
        inValuePK:"inValuePK",   //主表(变量)   from聚合插件
        duplicateConditionList:"duplicateConditionList",    //过滤条件 from过滤插件.去重插件
        filterInfoList:"filterInfoList" ,        //过滤字段  from过滤插件

        destDbType:"destDbType" ,    //目标数据源类型   from Arcgis表同步插件
        destDataSourceId:"destDataSourceId",     //目标数据库名称  from Arcgis表同步插件
        destTables:"destTables",    //目标表    from Arcgis表同步插件

        rmDuplicateInfoList:"rmDuplicateInfoList",  //字段信息 from去重插件
        uiDupRetainConditionList:"uiDupRetainConditionList" ,    //保留数据方式 from去重插件

        incrementField:"incrementField",     //增量字段  from 增量查询插件
        incrementFieldType:"incrementFieldType"  ,   //增量字段类型 from 增量查询插件
        incrementFlag:"incrementFlag"           //是否增量查询 0全量 1增量  from 文件读取插件

    };

    var currentNodeSaveFields = null;

    return {
        mappingField: mappingField,
        /**
         * 存储的是服务端javabean 字段名称，不需要手动指定pluginName,pluginCode
         * @param 
         */
        setNodeSaveField: function (f) {
            f.push("pluginName");
            f.push("pluginCode");
            currentNodeSaveFields = f;
        },
        getNodeSaveField: function () {
            return currentNodeSaveFields;
        },
        /**
         *创建DataColumn
         * @param isPk 是否主键
         * @param fieldlableName 字段名称别名
         * @param fieldType 字段类型
         * @param fieldTypeName 字段类型名称
         * @param fieldLength 字段长度
         * @param isNull 是否为空
         */
        createDataColumn: function (isPk, fieldlableName, fieldType, fieldTypeName, fieldLength, isNull,fieldFormat) {
            return {
                isPk: isPk,
                fieldName: fieldlableName,
                fieldlableName: fieldlableName,
                fieldType: fieldType,
                fieldTypeName: fieldTypeName,
                fieldLength: fieldLength,
                isNull: isNull,
                size: "0",
                fieldFormat:fieldFormat
            }
        }
    }
});