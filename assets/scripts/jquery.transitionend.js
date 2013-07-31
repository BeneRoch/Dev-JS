/**
 * @name transitionEnd
 * @version version 1.0
 * @author Bene Roch
 * @fileoverview
 * The plugin allows the user to bind function onto the "transitionEnd"
 * event of his choice. As an example, you could bind the event to the
 * "opacity" transition end, or transform, etc.
 *
 * @param {Object} opts Supports these options:
 *		'property': (string) The transition you wanna bind the event onto. (opacity, transform, line-height, etc)
 *		'action' : (string) Add | Remove Either you add or remove the listeners.
 *		'callback': (function(e)) The actual function you want to trigger on the event.
 *				@param (Event) e -> The actual event with all his property.
 *
 * @example
 * $('.actions-bar').transitionEnd({
 *		property : 'opacity', 
 *		callback : function(e) { console.log(e.propertyName); }
 * })
 *
 *
 *
 *
 */

(function($){
	// Function GMAP + default options
 $.fn.transitionEnd = function(opts) {

	
	var $this = $(this);
	var defaults = { 
		callback : function(e) {
		},
		property : '',
		action	 : "add"
	};	
	var settings = $.extend(defaults, opts);

	
	
	var userAgent = navigator.userAgent;
	var browsers = {
		"Firefox" : "transitionend",
		"Chrome" : "webkitTransitionEnd",
		"Opera" : "oTransitionEnd",
		"Safari" : "webkitTransitionEnd"
	}
	
	var current_browser = '';
	
	for (var ind in browsers) {
		if (navigator.userAgent.match(new RegExp(ind))) {
			current_browser = ind;
			break;
		}
	}
		
	
	if (settings.property) {
		$this.each(function(i,e) {
			// console.log(e);
			var _this = $(e);
			var $data = _this.data('locomotive_transition');
			
			if (!$data) {
				$data = new Locomotive_Transition();
			}
			$data.browser = current_browser;
				
			// ADD Listeners
			if (settings.action == "add") {
				// Add the callback
				$data.attach(settings.property, settings.callback);
				
				// Add the DOM listener
				_this[0].addEventListener( 
					browsers[current_browser], 
					$data.trigger, 
					false 
				);
				
			} 
			
			// REMOVE Listeners
			else {
				// Remove the Callback
				$data.clear(settings.property);
				
				// Remove the DOM listener
				_this[0].removeEventListener( 
					browsers[current_browser], 
					$data.trigger, 
					false 
				);
				
			}
			
			// Bind the current DATA to the DOM Element
			// This is usefull for further use.
			_this.data('locomotive_transition',$data);
		
		});
	}
	
	
	// Chain.
	return this;
}

})(jQuery);

var Locomotive_Transition = function() {
	this.callbacks = {};
	this.browser = '';
	this.trigger = function(e) {
		var key = e.propertyName;
		// Coming from the EVENT Listener, "this" refers to the target.
		// Therefore we creat the "_this" var to resolve the problem.
		var _this = $(this).data('locomotive_transition');
		
		// Prevent Bubbling
		if (e.target != e.currentTarget) {
			return false;
		}
		
		// If no callbacks are provided for that event
		if (typeof _this.callbacks[key] != 'object') {
			return false;
		}
		
		// Call the callback functions
		for (var i in _this.callbacks[key]) {			
			_this.callbacks[key][i](e);
		}
		
		// Prevent Default?
		return false;
	}
	this.attach = function(key,f) {
	
		// "f" must be a function
		if (typeof f != 'function') {
			return false;
		}
		
		// Some property key change from one browser to another
		// These must be documented, yet we have the "transform" -> -webkit-transform / -o-transform
		key = this.propertyConvert(key);
		if (typeof this.callbacks[key] == 'undefined') {
			this.callbacks[key] = Array();
		}
		this.callbacks[key].push(f);
		
	}
	// Remove unnecessary listeners
	this.clear = function(key) {
		if (key) {
			this.callbacks[key] = {};
		}
		else {
			this.callbacks = {};
		}
	}
}
Locomotive_Transition.prototype.propertyConvert = function(p) {
	var aProperties = {
		transform : {
			"Chrome" : "-webkit-transform",
			"Firefox": "transform", // This is not -moz-transform anymore.
			"Opera"  : "-o-transform",
			"Safari": "-webkit-transform"
		}
	}
	if (typeof aProperties[p] == 'undefined') {
		return p;
	}
	if (typeof aProperties[p][this.browser] == 'undefined') {
		return p;
	}
	return aProperties[p][this.browser];
	
}

