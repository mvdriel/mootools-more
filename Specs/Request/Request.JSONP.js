/*
---
name: Request.JSONP Tests
requires: [More/Request.JSONP]
provides: [Request.JSONP.Tests]
...
*/
describe('Request.JSONP', function(){

	function checkStoredRequestMap(expected){
		var storedCallbacks = Object.keys(Request.JSONP.request_map).length;
		expect(storedCallbacks).toBe(expected);
	}

	it('should grab some json from from assets/jsonp.js', function(){

		var onComplete = jasmine.createSpy(),
			complete = false,
			timeout = false,
			onRequest = jasmine.createSpy();

		var request = new Request.JSONP({
			log: true,
			callbackKey: 'jsoncallback',
			url: 'base/Tests/Specs/assets/jsonp.js',
			timeout: 20000,
			onComplete: function(){
				onComplete.apply(this, arguments);
				complete = true;
			},
			onRequest: function(src, script){
				onRequest.call(this, src);
				expect(script.get('tag')).toEqual('script');
			},
			onTimeout: function(){
				timeout = true;
			}
		});

		runs(function(){
			request.send();
		});

		runs(function(){
			expect(onRequest).toHaveBeenCalledWith('base/Tests/Specs/assets/jsonp.js?jsoncallback=Request.JSONP.request_map.request_0');
		});

		waitsFor(1600, function(){
			return complete || timeout;
		});

		runs(function(){
			expect(onComplete).toHaveBeenCalled();
			// See json.js file
			expect(onComplete.mostRecentCall.args[0].test).toEqual(true);
		});

	});

	it('should clear the request callback map', function(){

		var complete = false;
		checkStoredRequestMap(0);
		var request = new Request.JSONP({
			url: 'base/Tests/Specs/assets/jsonp.js',
			onComplete: function(){
				checkStoredRequestMap(0);
				complete = true;
			},
			onRequest: function(src, script){
				checkStoredRequestMap(1);
			},
			clearRequestMap: true
		}).send();

		waitsFor(1600, function(){
			return complete;
		});

		runs(function(){
			expect(complete).toBeTruthy();
		});
	});

});
