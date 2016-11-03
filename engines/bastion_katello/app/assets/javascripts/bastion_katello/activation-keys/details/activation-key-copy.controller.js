(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name  Bastion.activation-keys.controller:ActivationKeyCopyController
     *
     * @description
     *   For copying a host collection.
     */
    function ActivationKeyCopyController($scope, ActivationKey) {
        $scope.successMessages = [];
        $scope.errorMessages = [];

        $scope.copy = function (newName) {
            ActivationKey.copy({id: $scope.activationKey.id, 'new_name': newName}, function (response) {
                $scope.transitionTo('activation-key.info', {activationKeyId: response.id});
            }, function (response) {
                $scope.copyErrorMessages.push(response.data.displayMessage);
            });
        };
    }

    angular
        .module('Bastion.activation-keys')
        .controller('ActivationKeyCopyController', ActivationKeyCopyController);

    ActivationKeyCopyController.$inject = ['$scope', 'ActivationKey'];

})();
