define(["avalon"], function (avalon) {
    avalon.filters.numcovertword = function (str) {
        return {
            '1': 'KAFKA',
            '2': 'IndexDB',
            '4': 'CloudDB',
            '5': 'MongoDB',
            '6': 'Oracle',
            '7': 'SQLServer',
            '8': 'DB2',
            '9': 'MySQL',
            '10': 'WinRemoteFile',
            '12': 'LocalFile',
            '16': 'SmallFile',
            '17': 'BigFile',
            '18': 'MQ',
            '19': 'Greenplum'
        }[str];
    };

    //为频率类型加一个过滤器
    avalon.filters.numcoverttime = function (str) {
        return {
            '0': '秒',
            '1': '分',
            '2': '时',
            '3': '天',
            '4': '周',
            '5': '月'
        }[str];
    };
    //文件格式转换器
    avalon.filters.numcoverttxt = function (str) {
        return {
            '0': 'sql',
            '1': 'txt',
            '2': 'dmp',
            '3': 'hfile'
        }[str];
    };

    //portal平台中，仪表盘我的申请显示
    avalon.filters.numcovertApply = function (str) {
        return {
            'directoryType_app': '应用资源',
            'directoryType_data': '数据资源',
            'directoryType_server': '服务资源',
            'directoryType_layer': '图层资源',
            'directoryType_file': '文件资源'
        }[str];
    };

    //system中，发布状态
    avalon.filters.numcovertStatus = function (str) {
        var arr, result = "";
        if (str) {
            arr = str.split(",");
            result = "";
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == "in") {
                    result += "内网" + ",";
                } else if (arr[i] == "out") {
                    result += "外网" + ",";
                } else if (arr[i] == "inMobile") {
                    result += "内网手机端" + ",";
                } else if (arr[i] == "outMobile") {
                    result += "外网手机端" + ",";
                }
            }
            if (result.length > 0) {
                var flag = result.substring(result.length - 2, result.length - 1);
                if (flag == ",") {
                    result = result.substring(0, result.length - 2);
                } else {
                    result = result.substring(0, result.length - 1);
                }
            }
        }
        return result;
    };
})