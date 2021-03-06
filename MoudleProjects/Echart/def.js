/**
 * Created by ZHANGQIANG on 2018/11/22.
 */
var legNameO="PV",legNameT="",LegNameS="";
var NameOdata=[120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210];
var NameTdata=[], NameSdata=[];
var xAxisData= ['4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11','4.12','4.14','4.15','4.16','4.17'];
dx(legNameO,legNameT,LegNameS,NameOdata,NameTdata,NameSdata,xAxisData);
$(".compare").click(function(){
    var val = []
    $(".compare").each(function() {
        if($(this).is(":checked")){
            val.push($(this).val());
        };
    });
    if(val.length==0){
        legNameO="PV";
        legNameT="";
        LegNameS="";
        NameOdata=[120, 132, 21, 134, 10, 30, 110];
        NameTdata=[];
        NameSdata=[];
        xAxisData= ['4.4','4.5','4.6','4.7','4.8','4.9','4.10'];
        dx(legNameO,legNameT,LegNameS,NameOdata,NameTdata,NameSdata,xAxisData);
    };
    if(val.length==1){
        if(val[0]=="tongbi"){
            legNameO="PV";
            legNameT="IP数";
            LegNameS="";
            NameOdata=[120, 132, 21, 134, 10, 30, 110];
            NameTdata=[150, 232, 201, 154, 190, 330, 410];
            NameSdata=[];
            xAxisData= ['4.4','4.5','4.6','4.7','4.8','4.9','4.10'];
            dx(legNameO,legNameT,LegNameS,NameOdata,NameTdata,NameSdata,xAxisData);
        };
        if(val[0]=="huanbi"){
            legNameO="平均";
            legNameT="UV";
            LegNameS="";
            NameOdata=[120, 132, 101, 134, 90, 230, 210];
            NameTdata=[220, 182, 191, 234, 290, 330, 310];
            NameSdata=[];
            xAxisData= ['4.4','4.5','4.6','4.7','4.8','4.9','4.10'];
            dx(legNameO,legNameT,LegNameS,NameOdata,NameTdata,NameSdata,xAxisData);
        };
    };
    if(val.length==2){
        legNameO="PV";
        legNameT="UV";
        LegNameS="IP数";
        NameOdata=[120, 132, 21, 134, 10, 30, 110];
        NameTdata=[220, 182, 191, 234, 290, 330, 310];
        NameSdata=[150, 232, 201, 154, 190, 330, 410];
        xAxisData= ['4.4','4.5','4.6','4.7','4.8','4.9','4.10'];
        dx(legNameO,legNameT,LegNameS,NameOdata,NameTdata,NameSdata,xAxisData);
    };
});
function dx(legNameO,legNametT,LegNameS,NameOdata,NameTdata,NameSdata,xAxisData){
    var myChart = echarts.init(document.getElementById('dataGraph'));
    option = {
        title: {
            text: '同环比test'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:function(p){
                if(p[1].seriesName=="" && p[2].seriesName!=""){
                    var text = p[0].name+'<br>'+p[0].seriesName+'：'+p[0].value+'<br>'+p[2].seriesName+'：'+p[2].value+'<br>';
                };
                if(p[1].seriesName!="" && p[2].seriesName==""){
                    var text = p[0].name+'<br>'+p[0].seriesName+'：'+p[0].value+'<br>'+p[1].seriesName+'：'+p[1].value+'<br>';
                };
                if(p[1].seriesName=="" && p[2].seriesName==""){
                    var text = p[0].name+'<br>'+p[0].seriesName+'：'+p[0].value+'<br>';
                };
                if(p[0].seriesName!="" && p[1].seriesName!="" && p[2].seriesName!=""){
                    var text = p[0].name+'<br>'+p[0].seriesName+'：'+p[0].value+'<br>'+p[1].seriesName+'：'+p[1].value+'<br>'+p[2].seriesName+'：'+p[2].value+'<br>';
                };
                return text;
            },
        },
        legend: {
            data:[legNameO,legNameT,LegNameS],
            right:"3%"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        //  在坐标轴上显示数据
        label:{
            normal:{
                show: true,
                position: 'inside'
            }
        },
        xAxis: {
            name:'时间',
            nameGap:"5",
            type: 'category',
            boundaryGap: false,
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:legNameO,
                type:'line',
                stack: '总量',
                data:NameOdata
            },
            {
                name:legNameT,
                type:'line',
                stack: '总量',
                data:NameTdata
            },
            {
                name:LegNameS,
                type:'line',
                stack: '总量',
                data:NameSdata
            },

        ]
    };
    myChart.setOption(option);
};

