# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'POS Fan Coffee',
    'version': '13.0.1.0.0',
    'license': 'LGPL-3',
    'category': 'Point Of Sale',
    'sequence': 6,
    'summary': """""",
    'description': """""",
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'https://www.serpentcs.com',
    'data': [
            'view/templates.xml',
            'view/pos_credit_note.xml',
            'wizard/pos_create_invoice.xml'
    ],
    'depends': ['point_of_sale'],
    'qweb': ['static/src/xml/*.xml'],
    'installable': True,
    'auto_install': False,
    'application': False,
    'price': 9,
    'currency': 'EUR',
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
