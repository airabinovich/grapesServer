app.controller('HomeController',function($scope,$http,$interval,$rootScope,$filter){

initializeCharts();
loadHistoricTemperatures();

$interval(function(){
loadHistoricTemperatures();
},10000);

	$scope.Graphs=[];
	var oldGraph=[];
	$scope.username= $rootScope.globals.currentUser.username;
	
	function loadHistoricTemperatures(){
		$http.post('/api/load/temps',$rootScope.globals.currentUser).success(function(data){
			graphData=[];
			data.forEach(function(item,index){
			        var dateTime = item.fecha.split("T");
					var date= dateTime[0];
					var time = dateTime[1].split(".")[0]
					dateTime= new Date([date,time]);
					var value= [Date.parse(dateTime),item.valor];
					var campoById = $filter('filter')(graphData, {id: item.idCampo })[0];
					if(campoById == null){
						graphData.push( {id:item.idCampo , sensores: [] } )
						campoById = $filter('filter')(graphData, {id: item.idCampo })[0];
					}
					
					var sensorById= $filter('filter')(campoById.sensores, {id: item.idSensor })[0];
					if(sensorById == null){
						campoById.sensores.push({id: item.idSensor , measures:[] , magnitude: item.nombre, unity: item.unidad})
						sensorById= $filter('filter')(campoById.sensores, {id: item.idSensor })[0];
					}
					sensorById.measures.push(value);
				});
				var chartsArray=[];
				$scope.graphicsData = graphData;
				graphData.forEach(function(item,index){
					newCharts=[];
					item.sensores.forEach(function(sensor,ind){
						
						var newChartByMagnitude= $filter('filter')(newCharts, {magnitude: sensor.magnitude })[0]
						if(newChartByMagnitude == null){
							newChart= null;
							newChart= {title:"Field "+index, chart: JSON.parse(JSON.stringify($scope.chartConfig))};
							newChart.chart.title={text: "Field "+index };
							newCharts.push({magnitude: sensor.magnitude, chart:newChart});
							newChartByMagnitude= $filter('filter')(newCharts, {magnitude: sensor.magnitude })[0];
							
						}
						newChartByMagnitude.chart.chart.series.push({ name:"sensor:"+sensor.id, data: sensor.measures});
						newChartByMagnitude.chart.chart.yAxis={ title: {text: sensor.magnitude }};
						newChartByMagnitude.chart.chart.options.tooltip.pointFormat='<b>{point.y:.2f} '+ sensor.unity +' </b>';
					});
					
					newCharts.forEach(function(newGraph){
						chartsArray.push(JSON.parse(JSON.stringify(newGraph.chart)));
					});
				});
				if (JSON.stringify(oldGraph) !== JSON.stringify(chartsArray)){
					$scope.Graphs=JSON.parse(JSON.stringify(chartsArray));
					oldGraph=JSON.parse(JSON.stringify(chartsArray));
				}
		});
		
	};
	
	
	function initializeCharts(){
	
		var xAxisObj = {
			type: 'datetime',
			labels: {
				formatter: function() {
					var labelStr = Highcharts.dateFormat('%Y/%m/%d', this.value);
					return labelStr;
				}
			},
			title: {text: 'Date'}
		};
					
		var yAxisObj = {
			title: {text: ''},
			min: 0
		};
	
	 $scope.chartConfig = {

	  options: {
		  //This is the Main Highcharts chart config. Any Highchart options are valid here.
		  //will be overriden by values specified below.
		  chart: {
			  type: 'spline'
		  },
		  tooltip: {
			  headerFormat: '{point.x:%Y/%m/%d - %H:%M}<br>',
		      pointFormat: '<b>{point.y:.2f} C </b>'
		  }
	  },
	  //The below properties are watched separately for changes.

	  //Series object (optional) - a list of series using normal Highcharts series options.
	  series: [],
	  //Title configuration (optional)
	  title: {
		 text: ''
	  },
	  //Boolean to control showing loading status on chart (optional)
	  //Could be a string if you want to show specific loading text.
	  loading: false,
	  //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
	  //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
	  xAxis: xAxisObj,
	  yAxis: yAxisObj,
	  //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
	  useHighStocks: false,
	  //size (optional) if left out the chart will default to size of the div or something sensible.
	  size: {
	   height: 300
	  },
	  //function (optional)
	  func: function (chart) {
	   //setup some logic for the chart
	  }
	};
	};
});

