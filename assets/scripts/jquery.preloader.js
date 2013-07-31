/*
*	jQuery Preloader
*	Author: Bene
*/

// Utils
var b_preloader_instances = {};
var b_preloader_inc = 0;

(function($){
 
 $.fn.preload = function(callback,args) {
	if (typeof args == 'object') {
		// Custom img array
		var imgs = args;
	} else {
		// All the imgs contained in the $(this) object
		var imgs = [];
		$(this).find('img').each(function(i,e) {
			imgs.push($(this).attr('src'));
		});
	}
	b_preloader_instances[b_preloader_inc] = new b_preloader(imgs,callback,b_preloader_inc);
	b_preloader_instances[b_preloader_inc].init();
	// console.log(b_preloader_instances[b_preloader_inc]);
	b_preloader_inc++;
	return this;
}
})(jQuery);	


var b_preloader = function(imgs,callback,inc) {
	// Images SRC
	this.imgs = imgs;
	// Image Objects
	this.arrayImg = [];
	// Global timer
	this.ieCheckImgTimer = 0;
	// Callback
	this.callback = callback;
	// Instance id
	this.id = inc;
	// Check if all is alreayd loaded
	this.iKnowItsDone = false;
	
	// Preload function (init)
	this.init = function() {
		var max = this.imgs.length;
		for (var i = 0; i<max; i++){
			if (typeof this.imgs[i] == 'string') {
				var img = new Image();
				img.src = this.imgs[i];
				this.arrayImg.push(img);
			}
			
			img.onload = function() {
				// check_img();
			}
			img.onerror = function(e) {
				// console.log(e);
			}
		}
		this.ieCheckImgTimer = setTimeout('b_check_img("'+ this.id+'")',250);
	}
	
	// Img check
	this.check = function() {
		if (this.ieCheckImgTimer) {
			clearTimeout(this.ieCheckImgTimer);
		}
		if (images_complete(this.arrayImg) && !this.iKnowItsDone) {
			this.iKnowItsDone = true;
			/* CALLBACK */
			this.callback();
			
		}
		else {
			this.ieCheckImgTimer = setTimeout('b_check_img("'+ this.id+'")',250);
		}
	}
	
}
function b_check_img(id) {
	b_preloader_instances[id].check();
}
	
	/* UTILS */
	function images_complete(obj) {
		var max = obj.length;
		var canGo = true;
		for (var i = 0; i<max; i++){
			if (!obj[i].complete) {
				canGo = false;
			}
		}
		return canGo;
	}
		