/**
 * @ngdoc object
 * @name  Bastion.content-hosts.controller:ContentHostAddSubscriptionsController
 *
 * @requires $scope
 * @requires $location
 * @requires translate
 * @requires CurrentOrganization
 * @requires Subscription
 * @requires ContentHost
 * @requires SubscriptionsHelper
 *
 * @description
 *   Provides the functionality for the content host details action pane.
 */
angular.module('Bastion.content-hosts').controller('ContentHostAddSubscriptionsController',
    ['$scope', '$location', 'translate', 'CurrentOrganization', 'Subscription', 'ContentHost', 'SubscriptionsHelper',
    function ($scope, $location, translate, CurrentOrganization, Subscription, ContentHost, SubscriptionsHelper) {

        $scope.addSubscriptionsTable = $scope.addSubscriptionsPane.table;
        $scope.addSubscriptionsPane.refresh();
        $scope.isAdding = false;
        $scope.addSubscriptionsTable.closeItem = function () {};

        $scope.groupedSubscriptions = {};
        $scope.$watch('addSubscriptionsTable.rows', function (rows) {
            $scope.groupedSubscriptions = SubscriptionsHelper.groupByProductName(rows);
        });

        $scope.disableAddButton = function () {
            return $scope.addSubscriptionsTable.numSelected === 0 || $scope.isAdding;
        };

        $scope.addSelected = function () {
            var selected;
            selected = SubscriptionsHelper.getSelectedSubscriptionAmounts($scope.addSubscriptionsTable);

            $scope.isAdding = true;
            ContentHost.addSubscriptions({uuid: $scope.contentHost.uuid, 'subscriptions': selected}, function () {
                ContentHost.get({id: $scope.$stateParams.contentHostId}, function (host) {
                    $scope.$parent.contentHost = host;
                    $scope.successMessages.push(translate("Successfully added %s subscriptions.").replace('%s', selected.length));
                    $scope.isAdding = false;
                    $scope.addSubscriptionsPane.refresh();
                    $scope.subscriptionsPane.refresh();
                    $scope.nutupane.refresh();
                });
            }, function (response) {
                $scope.$parent.errorMessages = response.data.displayMessage;
                $scope.isAdding = false;
            });
        };

        $scope.amountSelectorValues = function (subscription) {
            var step, value, values;

            step = subscription['instance_multiplier'];
            if (!step || step < 1) {
                step = 1;
            }
            values = [];
            for (value = step; value < subscription.quantity && values.length < 5; value += step) {
                values.push(value);
            }
            values.push(subscription.quantity);
            return values;
        };

    }]
);
