describe('shell controllers', function() {
    beforeEach(module('shell'));

    describe('shellController', function(){

        it('should have "message"', inject(function($controller){
            var scope = {},
                controller = $controller('shellController', {$scope : scope});

            expect(scope.message).toBe('Everyone come see how good I look!');
        });

//        it('should create "phones" model with 3 phones', function() {
//            var scope = {},
//                ctrl = new PhoneListCtrl(scope);
//
//            expect(scope.phones.length).toBe(3);
//        });
    });
});