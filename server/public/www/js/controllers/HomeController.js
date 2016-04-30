app.controller('HomeController',function($scope,$http,$interval){

loadSensorInfo();

loadHistoricTemperatures();

$interval(function(){
loadSensorInfo();
loadHistoricTemperatures();
},3000);

	function loadSensorInfo(){
	$http.get('/api/load').success(function(data){
	$scope.sensorInfo=data;
	});
	};
	
	var historicTempInfo;
	var historicTemps= [];
	var historicDates=[];
	var historicTimes=[];
	var oldData;
	var receivedData;
	
	function loadHistoricTemperatures(){
	$http.get('/api/load/temps').success(function(data){
     historicTemps= [];
	 if( JSON.stringify(oldData) != JSON.stringify(data) ){
        oldData=data;
		data.forEach(parseData)
		console.log(JSON.stringify(historicTemps));
		updateCharts();
	 }
	});
	};
	
	
	
	function parseData(element, index, array){
	historicTemps.push([Date.parse(element.date),element.value]);
	 // historicTemps.push([Date.UTC(element.date),element.time,element.temperature]);
	};
	

	function updateCharts() {
		var chart = {
      type: 'spline'      
   }; 
   var title = {
      text: 'Historic Temperature Values'   
   };
   var subtitle = {
      text: 'Grapes Measurement Systems'
   };
   var xAxis = {
      type: 'datetime',
	 labels: {
			formatter: function() {
				var labelStr = Highcharts.dateFormat('%Y/%m/%d', this.value);
				return labelStr;
			}
		},
      title: {
         text: 'Date'
      }
   };
   var yAxis = {
      title: {
         text: 'Snow depth (m)'
      },
      min: 0
   };
   var tooltip = {
      headerFormat: '{point.x:%Y/%m/%d - %H:%M}<br>',
      pointFormat: '<b>{point.y:.2f} ºC </b>'
   };
   var plotOptions = {
      spline: {
         marker: {
            enabled: true
         }
      }
   };
   var series= [{
         name: 'Historic Temperatures',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
         data: historicTemps
      }
   ];     
      
   var json = {};
   json.chart = chart;
   json.title = title;
   json.subtitle = subtitle;
   json.tooltip = tooltip;
   json.xAxis = xAxis;
   json.yAxis = yAxis;  
   json.series = series;
   json.plotOptions = plotOptions;
   $('#graph_container').highcharts(json);
   };

});