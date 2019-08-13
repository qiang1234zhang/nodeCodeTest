define(['dataapp','jquery', 'echarts','jqueryUI'], function(app,$,echarts) {
	app.register.controller('dataIndex.home', ['$scope', '$state', '$global_var','$interval', function($scope, $state, $global_var,$interval) {
		var myChart = echarts.init(document.getElementById('main'));
        var x =[5, 20, 36, 10, 10, 20]
        // 指定图表的配置项和数据
        var option = {
            animation:false,
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'line',
                data: x
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        
        $interval(function(){
        	x.push(Math.random()*$scope.test)
        	x.shift()
        	myChart.setOption(option);
        },1000)
	}]);
});