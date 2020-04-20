
from odoo import api, fields, models, _
from odoo.exceptions import UserError


class PosCreateInvoice(models.TransientModel):

    _name = 'pos.create.invoice'

    start_date = fields.Datetime(required=True)
    end_date = fields.Datetime(required=True)
    partner_id = fields.Many2one('res.partner', 'Customer', required=True)
    is_load = fields.Boolean('Load')
    pos_order_ids = fields.Many2many('pos.order', 'pos_order_invoice')

    def get_pos_order(self):

        rec = self.env['pos.order'].search([('date_order', '>=', self.start_date), (
            'date_order', '<=', self.end_date), ('partner_id', '=', self.partner_id.id), ('state', '=', 'credit_note')])
        self.pos_order_ids = [(6, 0, rec.ids)]
        self.is_load = True
        return {
            'name': _("Create Invoice"),
            'view_mode': 'form',
            'view_id': False,
            'res_model': 'pos.create.invoice',
            'res_id': self.id,
            'type': 'ir.actions.act_window',
            'nodestroy': True,
            'target': 'new',
            'domain': '[]',
            'context': self.env.context
        }

    def pos_create_invoice(self):
        line_ids = []
        inv_val = {}
        inv_val.update(
            {'partner_id': self.partner_id.id, 'type': 'out_invoice'})
        for order in self.pos_order_ids:
            name = order.name + ' Date :- ' + str(order.date_order.date())
            line_val_rec = {
                'name': name,
                'display_type': 'line_section'
            }
            line_ids.append((0, 0, line_val_rec))
            for line in order.lines:
                line_val = {
                    'product_id': line.product_id.id,
                    'name': line.product_id.name,
                    'quantity': line.qty,
                    'price_unit': line.price_unit,
                    'discount': line.discount,
                    'tax_ids': [(6, 0, line.tax_ids.ids)],
                }
                line_ids.append((0, 0, line_val))
        inv_val.update({'invoice_line_ids': line_ids})
        rec = self.env['account.move'].create(inv_val)
        self.pos_order_ids.write({'state': 'done_credit_note'})
        return {
            'name': _("Invoices"),
            'view_mode': 'form',
            'view_id': False,
            'res_model': 'account.move',
            'res_id': rec.id,
            'type': 'ir.actions.act_window',
            'nodestroy': True,
            'target': 'new',
            'domain': '[]',
            'context': self.env.context
        }
