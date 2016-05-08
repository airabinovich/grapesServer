app.controller('HomeController',function($scope,$http,$interval,$rootScope,$filter){

//loadSensorInfo();
initializeChart();
loadHistoricTemperatures();

$interval(function(){
//loadSensorInfo();
loadHistoricTemperatures();
},10000);

	/*function loadSensorInfo(){
		$http.get('/api/load').success(function(data){
		$scope.sensorInfo=data;
		});
	};*/
	
	var historicTempInfo;
	var historicTemps= [];
	var historicDates=[];
	var historicTimes=[];
	$scope.Graphs=[];
	//var chartConfig;
	var oldGraph=[];
	var oldIdCampos;
	var receivedData;
	
	function loadHistoricTemperatures(){
		$http.post('/api/load/temps',$rootScope.globals.currentUser).success(function(data){
			historicTemps= [];
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
					//console.log(JSON.stringify(graphData));
				});
				var chartsArray=[];
				$scope.graphicsData = graphData;
				graphData.forEach(function(item,index){
					newCharts=[];
					//console.log(JSON.stringify(item));
					//console.log(JSON.stringify(newChart));
					item.sensores.forEach(function(sensor,ind){
						
						var newChartByMagnitude= $filter('filter')(newCharts, {magnitude: sensor.magnitude })[0]
						if(newChartByMagnitude == null){
							console.log(JSON.stringify(sensor.magnitude));
							newChart= null;
							newChart= {title:"Field "+index, chart: JSON.parse(JSON.stringify($scope.chartConfig))};
							newChart.chart.title={text: "Field "+index };
							newCharts.push({magnitude: sensor.magnitude, chart:newChart})
							console.log(JSON.stringify(newCharts));
							newChartByMagnitude= $filter('filter')(newCharts, {magnitude: sensor.magnitude })[0]
							
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
				//console.log(JSON.stringify($scope.Graphs));
		});
		
	};
	
	function parseData(element, index, array){
	historicTemps.push([Date.parse(element.date),element.value]);
	 // historicTemps.push([Date.UTC(element.date),element.time,element.temperature]);
	};
	
	function initializeChart(){
	
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
	  series: [{
		 data: []
	  }],
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
	
	/*
	   chartConfig = {
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
			  series: [{
				 data: []
			  }],
			  //Title configuration (optional)
			  title: {
				 text: 'Hello'
			  },
			  //Boolean to control showing loading status on chart (optional)
			  //Could be a string if you want to show specific loading text.
			  loading: false,
			  //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
			  //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
			  xAxis: {
				  type: 'datetime',
				 // currentMin: 0,
				 // currentMax: 20,
				  title: {text: 'Date'}
			  },
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
		/*
											
	/*
		var chart = {type: 'spline'}; 
		var title = {text: 'Historic Temperature Values'   };
		var subtitle = {text: 'Grapes Measurement Systems'};
		var xAxis = {	type: 'datetime',
						labels: {
							formatter: function() {
								var labelStr = Highcharts.dateFormat('%Y/%m/%d', this.value);
								return labelStr;
							}
						},
						title: {text: 'Date'}
					};
		var yAxis = {	title: {text: 'Temperature (C)'},
						min: 0
					};
		var tooltip = {
			headerFormat: '{point.x:%Y/%m/%d - %H:%M}<br>',
			pointFormat: '<b>{point.y:.2f} C </b>'
		};
		var plotOptions = {
			spline: {
			marker: { enabled: true }
			}
		};
		var series= [{
			name: 'sensor1',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
			data: historicTemps
		}];           
	   var json = {};
	   json.chart = chart;
	   json.title = title;
	   json.subtitle = subtitle;
	   json.tooltip = tooltip;
	   json.xAxis = xAxis;
	   json.yAxis = yAxis;  
	   json.series = series;
	   json.plotOptions = plotOptions;
	   graph = $('#graph_container').highcharts(json);
	   */
	};
	
	function updateCharts() {
		//var container2 = $scope.createElement('div');
		 //   document.body.appendChild(container2);
		
		//var index=$("#graph_container").data('highchartsChart');
		//Highcharts.charts[index].series=;
		console.log(historicTemps);
		console.log(chart);
	};

});

