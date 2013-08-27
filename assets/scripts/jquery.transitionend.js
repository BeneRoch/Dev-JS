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
 * @todo Multiple action commands. Yet: "add" and "remove". If not specified, it ADDS the listener. (default)
 *
 *
 */

(function($){
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
	// The order is quite important.
	var browsers = {
		"mobile" : "webkitTransitionEnd",
		"webkit" : "webkitTransitionEnd",
		"Firefox" : "transitionend",
		"Chrome" : "webkitTransitionEnd",
		"Opera" : "oTransitionEnd",
		"Safari" : "webkitTransitionEnd",
		"msie 10" : "transitionend",
		"msie 9" : "transitionend"
	}
	
	var current_browser = '';
	
	for (var ind in browsers) {
		if (navigator.userAgent.match(new RegExp(ind,"i"))) {
			current_browser = ind;
			break;
		}
	}
	if (settings.property) {
		$this.each(function(i,e) {
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

					// WORKS WITH MODERNIZER
				if ($('html').hasClass('no-csstransitions')) {
					_this.data('locomotive_transition',$data);
					$data.trigger({ propertyName : settings.property, target : e, currentTarget : e });
				} else {
					_this[0].addEventListener( 
						browsers[current_browser], 
						$data.trigger, 
						false 
					);
				}
			}
			// REMOVE Listeners
			else {
				// Remove the Callback
				$data.clear(settings.property);
				if (typeof window.removeEventListener != "undefined") {
					// Remove the DOM listener
					_this[0].removeEventListener( 
						browsers[current_browser], 
						$data.trigger, 
						false 
					);
				}
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

/**
*	Locomotive_Transition Class
*	Class containing the required data for the javascript callback to a css3 transition.
*	Each instanciation of that class is binded to the concerned object.
*
*	@methods
*		- trigger(e) -> Callback to the CSS3 transition.  We dispatch the original event.
*						Depending on the event.propertyName, we do or not a binded action.
*
*		- attach(key,f) -> 	String key refers to the event propertyName.
*							Function f is the actual callback function. When called,
*							we pass the event as parameter.
*
*		- clear(key)	->	String key refers to the event propertyName.
*							Unbinds all events targeting that propertyName on that object
*
*	@precisions	->	All these functions are called directly by the plugin. You shouldn't have
*					to change anything in here, callbacks are specified for that reason.
*
*	@todo Stronger api (plugin)
*/
var Locomotive_Transition = function() {
	this.callbacks = {};
	this.browser = '';
	this.trigger = function(e) {

		// key = CSS property name.
		var key = e.propertyName;

		// Coming from the EVENT Listener, "this" refers to the target.
		// Therefore we creat the "_this" var to resolve the problem.
		var _this = $(e.target).data('locomotive_transition');

		if (!_this) {
			return false;
		}
		// Prevent Bubbling
		if (e.target != e.currentTarget) {
			return false;
		}
		
		// If no callbacks are provided for that event
		if (typeof _this.callbacks[key] != 'object') {
			return false;
		} else {
			// Call the callback functions
			// Foreach doesn't work on IE....
			for (var i = 0; i < _this.callbacks[key].length; i++) {		
				_this.callbacks[key][i](e);
			}
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
		if (typeof this.callbacks[key] != 'array') {
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

/**
*	Property converting
*	This function can easily be extended.
*	By adding new rules, you can make sure that the defined properties
*	are available as transition.
*	@done -> transform -> has different name depending on the browser.
*	@notes
*		The order of the browser keys (mobile, webkit, etc) is important.
*		Mobile phone using, for exemple, safari, respond true on the regEx
*		check for these values: "mobile, Chrome, webkit, Safari". So if it
*		is mobile, we wanna stop there.
*
*	@todo
*		- make {aProperties} and object in the Locomotive_Transition
*		- create a setter for {aProperties} that would extend the existing values.
*		
**/
Locomotive_Transition.prototype.propertyConvert = function(p) {
	var aProperties = {
		transform : {
			"mobile" : "-webkit-transform",
			"webkit" : "-webkit-transform",
			"Chrome" : "-webkit-transform",
			"Firefox": "transform", // This is not -moz-transform anymore.
			"Opera"  : "-o-transform",
			"Safari": "-webkit-transform",
			"msie 10" : "transitionend",
			"msie 9" : "transitionend"
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

