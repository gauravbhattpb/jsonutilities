/**
 * Created by GA006BH on 12/31/2016.
 */
angular.module('JsonUtil', []).controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.jsonTxt = '';
    $scope.errorTxt = '';
    $scope.elementFlatArray = [];
    $scope.esAddress = 'http://localhost:9201';
    $scope.indexData = {};
    $scope.indexName = 'myindex';
    $scope.indexType = "mytype";
    $scope.searchValues = '';
    $scope.errorModal = false;

    $scope.flatJson = function () {
        $scope.elementFlatArray = [];
        $scope.indexData = {};
        if ($scope.jsonTxt === '') {
            return;
        }
        var jsonObj = JSON.parse($scope.jsonTxt);
        $scope.flatObject(jsonObj, '');
        //$scope.elementFlatArray = $scope.elementFlatArray.splice(0,200);
    };

    $scope.formatJson = function () {
        if ($scope.jsonTxt === '') {
            return;
        }

        try{
            var jsonObj = JSON.parse($scope.jsonTxt);
            $scope.jsonTxt = JSON.stringify(jsonObj,null, 4);
        }catch (err) {
            $scope.errorModal = true;
            var textArea = angular.copy($scope.jsonTxt);
            var index = err.message.search("position");
            var errPosition = err.message.substring((index+8), (index+11)).trim();
            $scope.errorTxt = err.message + " : " + textArea.substring(errPosition, errPosition+10);
        }
    };

    $scope.flatObject = function (element, path) {
        for (var k in element) {
            if (typeof element[k] == "object" && element[k] !== null) {
                var x = path + k + ".";
                $scope.flatObject(element[k], x);
            } else {
                if (!(element[k] == "" || element[k] == null)) {
                    $scope.elementFlatArray.push((path === '' ? {
                        selected: true, key: k,
                        value: element[k]
                    } : {selected: true, key: path + k, value: element[k]}));
                }
            }
        }
    };

    $scope.toggleAll = function (state) {
        $scope.elementFlatArray.forEach(function (elem) {
            elem.selected = state
        });
    }

    $scope.createIndex = function () {
        $scope.elementFlatArray.forEach(function (elem) {
            console.log(elem.key + " : " + elem.value);
            if(elem.value !== null){
                $scope.indexData[elem.key] = elem.value;
            }
        });
        var jsonData = angular.toJson($scope.indexData);
        var httpRequest = {
            method: 'POST',
            url: $scope.esAddress + "/" + $scope.indexName + "/" + $scope.indexType,
            data: jsonData
        };
        $http(httpRequest).then(function successCallback (response) {
            console.log(response);
        }, function errorCallback (error) {
            console.log(error);
        });
    };

    $scope.file_changed = function (element) {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            $scope.jsonTxt = event.target.result;
            $scope.$apply();
        };
        reader.readAsText(file);
    };
}]);
