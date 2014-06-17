/**
*	Cart object class
*
* 	@author Bene Roch <roch.bene@gmail.com>
* 	@version 2014-06-17
* 	@since Version 2013-09-03
*
*/

/**
*	Cart Interface
*
*	@vars
*		- total (Float)	// Total price
*		- total_with_taxes (Float)	// Total price with taxes
*		- taxes {Object}	// Amount of the taxes
*		- taxe_rules {Object}	// The taxes rules
*		- qty (Int)	// Number of item in the cart
*		- items [{Object}]	// Items in the cart
*
*	@methods -
*		- add_item
*			@param {Object} Cart Item
*				{
*					price : (float),
*					id : (mixed),
*					qty: (int),
*					options: {Object}
*				}
*
*		- delete_item
*			@param (mixed) Product key (id)
*
*		- change_item_qty
*			@param (mixed) Product key (id)
*			@param (qty) Quantity
*
*
*		- update_values - // Private
*		- apply_taxes - // Private
*
*	@Setters
*		- set_taxe_rules
*			@param {Object} Taxe rules
*				{
*					percent : (float),
*					applyOn : [Array] // Or nothing.
*				}
*				
*	@Getters
*		- num_items @return Number of items in list (adding up the quantities)
*		- get_total @return (float) Total price
*		- get_taxes @return {Object} Taxe amount for each rules
*
*	@Static
*		- format_price @param (String) lang
*
*/
var Cart = function(opts) {
	this.opts = opts;
	// Item amount
	this.qty = 0;

	// Price total ( / with taxes )
	this.total = 0;
	this.total_with_taxes = 0;
	this.taxes = {};
	this.taxe_rules = {};

	// Collection of items
	this.items = Array();

	// Add item to cart list
	this.add_item = function(item, qty) {
		// Default quantity on add item
		if (!qty) {
			qty = 1;
		}

		// If a collection of items
		if (item instanceof Array) {
			for (var i = 0; i < item.length; i++) {
				qty = typeof item[i].qty == 'undefined' ? qty : item[i].qty;
				this.add_item(item[i], qty);
			}
			return this;
		}

		// Add the qty to the object
		// This is important for calculations
		item['qty'] = qty;
		this.items.push(item);
		this.update_values();
		return this;
	}

	// Deletes a "key" item.
	this.delete_item = function(key) {
		// Delete from the array (shift)
		for (var i = 0; i < this.items.length; i++) {
			if (key == this.items[i].id) {
				this.items.splice(i,1); // Removing the item
			}
		}
		return this.update_values();
	}

	// Changes the item qty in the list
	this.change_item_qty = function(key, qty) {
		for (var i = 0; i < this.items.length; i++) {
			if (key == this.items[i].id) {
				this.items[i].qty = qty; // Removing the item
			}
		}
		return this.update_values();
	}

	// Return total number of items
	this.num_items = function() {
		return this.qty; // 0 if none
	}

	// Gets the total price value
	// @return (Int) number of items
	this.get_total = function() {
		return this.total_with_taxes; // 0 if none

	}

	// Returns the amount of the taxes
	// @todo return { tps: 0, tvq : 0 } ?
	this.get_taxes = function() {
		return this.taxes;
	}

	// Private
	// Updating values
	this.update_values = function() {

		// Item amount
		this.qty = 0;

		// Price total ( / with taxes )
		this.total = 0;
		this.total_with_taxes = 0;

		for (var i = 0; i < this.items.length; i++) {
			this.qty += parseInt(this.items[i].qty);
			this.total += this.items[i].qty * parseFloat(this.items[i].price); // @todo...
		}

		// Apply taxes on the total
		// @todo Check if special taxes on certain articles
		this.total_with_taxes = this.apply_taxes(); // @todo rules

		if (typeof this.opts.callback == 'function') {
			this.opts.callback(this);
		}

		return this;
	}

	// Sets taxes rules
	// @param {Object} rules -> The key is the "tax name", the value is the percentage (ex: 5/100)
	this.set_taxe_rules = function(rules) {
		// Set rules following the current pattern
		if (rules) {
			// fixedBeforeTaxes
			// fixedAfterTaxes
			// shipping
			// percent
			var pattern = {
				type : "percent",
				val : 0,
				applyOn	: []
			}
			for (var r in rules) {
				if (typeof rules[r].applyOn != "object") {
					rules[r].applyOn = [];
				}
			}
			this.taxe_rules = rules;
		}
	}

	// Apply "rule" taxes to the total amount
	// Rules might apply by products
	// @todo type: fixed (adds instead of multiplying)
	this.apply_taxes = function() {

		// We reset the taxes
		this.total_with_taxes = this.total; 

		// @todo check taxe rules by product?
		for (var t in this.taxe_rules) {
			// If taxes adds up to another tax
			if (this.taxe_rules[t].applyOn.length) {
				// Whats the other tax.
				var applyOn = this.taxe_rules[t].applyOn;
				// Temporary amount to calculate the tax
				var tempAmount = 0;
				for (var i = 0; i < applyOn.length; i++) {
					if (this.taxe_rules[applyOn[i]].val) {
						tempAmount = this.total * this.taxe_rules[applyOn[i]].val;
					}
				}
				this.taxes[t] = (this.total + tempAmount) * this.taxe_rules[t].val;

			} else {
				this.taxes[t] = this.total * this.taxe_rules[t].val;
			}
			this.total_with_taxes += this.taxes[t];
		}
		return this.total_with_taxes; // + taxes (rule)
	}

	// Returns a formatted string for price
	this.format_price = function(price, lang) {

		price = parseFloat(price);
		var decimals = price - Math.floor(price);

		decimals = Math.round(Math.round(parseFloat(decimals)*10000)/100);
		if (decimals == 0 || decimals == '0') {
			decimals = '00';
		}
		price = Math.floor(price);

		if (isNaN(price)) {
			price = 0;
		}

		if (isNaN(decimals)) {
			decimals == '00';
		}

		if (lang == 'en') {
			return "$"+price+'.'+decimals;
		} else {
			return price+','+decimals+'$';
		}
	}
	}

}