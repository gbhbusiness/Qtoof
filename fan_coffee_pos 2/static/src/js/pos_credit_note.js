odoo.define('fan_coffee_pos.pos_credit_note',function(require){
	"use strict"

	var screens = require('point_of_sale.screens');
	var models = require('point_of_sale.models');
	var core = require('web.core');

	var QWeb = core.qweb;
	var _t = core._t;

	models.load_fields("pos.config",['pos_credit_note']);

	var _super_order = models.Order.prototype;
	models.Order = models.Order.extend({
        initialize: function(attributes,options){
        	_super_order.initialize.apply(this, arguments);
	        // models.Order.prototype.initialize.apply(this, arguments);
	        var self = this;
	        this.credit_note = false;
	    },
        set_credit_note: function(credit_note) {
	        this.assert_editable();
	        this.credit_note = credit_note;
	    },
	    is_credit_note: function(){
	        return this.credit_note;
	    },
	    export_as_JSON: function() { 
        	var rec = _super_order.export_as_JSON.apply(this);
        	rec['credit_note']  = this.credit_note;
        	return rec
	    },
	    export_for_printing: function() { 
        	var rec = _super_order.export_for_printing.apply(this);
        	rec['credit_note']  = this.credit_note;
        	return rec
	    },
	});

	screens.PaymentScreenWidget.include({
	    renderElement: function() {
	        var self = this;
	        this._super();
			this.$('.js_credit_note').click(function(){
				var order = self.pos.get_order();
	        	if (order.is_to_invoice()){
					return self.gui.show_popup('alert',{
                        'title': "Warning",
                        'body':  'Already selected invoice.',
                    });
				}
				if (order.get_paymentlines() && order.get_paymentlines().length > 0){
					return self.gui.show_popup('alert',{
                        'title': "Warning",
                        'body':  'Already selected another payment method.',
                    });
				}
	           	self.click_credit_note();
	        });
	        this.$('.js_invoice').unbind('click').bind('click', (function(){
	        	var order = self.pos.get_order();
	        	if (!order.is_credit_note()){
	            	self.click_invoice();
	        	}else {
	        		self.gui.show_popup('alert',{
                        'title': "Warning",
                        'body':  'Already selected Delivery Note.',
                    });
	        	}
	        }));
		},
		click_credit_note: function(){
	        var order = this.pos.get_order();
	        order.set_credit_note(!order.is_credit_note());
	        if (order.is_credit_note()) {
	            this.$('.js_credit_note').addClass('highlight');
	            this.$('.next').addClass('highlight');
	        } else {
	            this.$('.js_credit_note').removeClass('highlight');
	            this.$('.next').removeClass('highlight');
	        }
	    },
	    click_paymentmethods: function(id) {
	    	var self = this;
			var order = self.pos.get_order();
	        if (order.is_credit_note()){	
				return self.gui.show_popup('alert',{
                    'title': "Warning",
                    'body':  'Already selected Delivery Note.',
                });
			}
			this._super(id);
		},

		validate_order: function(force_validation) {
			var self = this	
			var order = self.pos.get_order();
	       	var client = order.get_client();
	        if (order.is_credit_note()){
	        	if (!client){
	        		return this.gui.show_popup('confirm', {
		                'title': _t('Please select the customer'),
		                'body': _t('You need to select the customer before you can order.'),
		                confirm: function () {
		                    this.gui.show_screen('clientlist');
		                },
		            });
	        	}
	        	this.finalize_validation()
	        }else{
	        	this._super(force_validation)
	        }
	    },
	});
})