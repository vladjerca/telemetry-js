app.controller("telemetry-controller", function($scope, $http, $mdSidenav) {
    $scope.colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1"];
    $scope.darkColors = ["#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f39c12", "#d35400", "#c0392b", "#bdc3c7"];
    $scope.applications = ["Test"];
    $scope.widgets = [];

    var apiUrl = "http://127.0.0.1:1337/api/";

    for (var i = 0; i < $scope.applications; i++) {
        var app = $scope.applications[i];
        $http.get(apiUrl + "apps/" + app + "/event-count/").success(function(data) {
            $scope.widgets.push({
                name: "Event count",
                order: 1,
                response: {
                    dataArray: data.dataArray,
                    labelArray: data.labelArray,
                    chartType: "Pie"
                },
                type: "Chart"
            });
        });
    };
});