/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import './MyAccountOrderPopup.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Image from 'Component/Image';
import Loader from 'Component/Loader';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import Popup from 'Component/Popup';
import { orderType } from 'Type/Account';
import { formatCurrency } from 'Util/Price';
import numberWithComas from "../../util/NumberWithCommas"
import { ORDER_POPUP_ID } from './MyAccountOrderPopup.config';
import { getMessageFromStatus, getExpectedDate, DateFormatter } from 'Util/Order';
export class MyAccountOrderPopup extends PureComponent {
    static propTypes = {
        order: orderType.isRequired,
        isLoading: PropTypes.bool.isRequired,
        currency_code: PropTypes.string.isRequired
    };

    renderBaseInfo() {
        const { order: { base_order_info } } = this.props;
        const { status_label, created_at } = base_order_info || {};
        // created_at
        return (
            <div>
                <h4>{__('Order details')}</h4>
                <dl>
                    <dt>{__('Created at: ')}</dt>
                    <dd>{DateFormatter.formatDate((new Date(created_at.replace(/\s/, 'T'))), "DD.MM.YYYY hh:mm A")}</dd>
                    <dt>{__('Status: ')}</dt>
                    <dd>{status_label}</dd>
                </dl>
            </div>
        );
    }

    renderPayment() {
        const { order: { payment_info } } = this.props;
        const { additional_information: { method_title } = {} } = payment_info || {};

        return (
            <div>
                <h4>{__('Payment Information')}</h4>
                <dl>
                    <dt>{__('Method: ')}</dt>
                    <dd>{method_title}</dd>
                </dl>
            </div>
        );
    }

    renderShippingAddressTable() {
        const { order: { shipping_info: { shipping_address } } } = this.props;

        return (
            <MyAccountAddressTable
                title={__('Shipping address')}
                address={shipping_address}
                mix={{ block: 'MyAccountOrderPopup', elem: 'Address' }}
            />
        );
    }

    renderShipping() {
        const { order: { shipping_info }, currency_code } = this.props;

        const {
            shipping_description,
            shipping_amount,
            shipping_address
        } = shipping_info || {};

        if (!shipping_address) {
            return null;
        }

        return (
            <div block="MyAccountOrderPopup" elem="ShippingWrapper">
                <h4>{__('Shipping & Handling Information')}</h4>
                <dl>
                    <dt>{__('Description: ')}</dt>
                    <dd>
                        {shipping_description}
                    </dd>
                    <dt>{__('Price: ')}</dt>
                    <dd>
                        {formatCurrency(currency_code)}
                        {shipping_amount}
                    </dd>
                </dl>
                { this.renderShippingAddressTable()}
            </div>
        );
    }

    renderItems() {
        const { order: { order_products = [] }, currency_code } = this.props;

        return order_products.map((product, i) => {
            const {
                name,
                thumbnail,
                id,
                qty,
                row_total
            } = product;

            const { url } = thumbnail || {};

            return (
                <tr
                    key={id || i.toString()}
                    block="MyAccountOrderPopup"
                    elem="Row"
                >
                    <td>
                        {url && (
                            <Image
                                src={url}
                                alt={name}
                                mix={{ block: 'MyAccountOrderPopup', elem: 'Thumbnail' }}
                            />
                        )}
                    </td>
                    <td>{name}</td>
                    <td>{qty}</td>
                    <td>
                        {formatCurrency(currency_code)}
                        {row_total}
                    </td>
                </tr>
            );
        });
    }

    renderItemsHeading() {
        return (
            <tr>
                <th>{__('Image')}</th>
                <th>{__('Name')}</th>
                <th>{__('Quantity')}</th>
                <th>{__('Total')}</th>
            </tr>
        );
    }

    renderProducts() {
        return (
            <div block="MyAccountOrderPopup" elem="ProductsWrapper">
                <h4>{__('Items Ordered')}</h4>
                <table
                    block="MyAccountOrderPopup"
                    elem="Products"
                >
                    <thead>
                        {this.renderItemsHeading()}
                    </thead>
                    <tbody>
                        {this.renderItems()}
                    </tbody>
                </table>
            </div>
        );
    }

    renderTotals() {
        const { order: { base_order_info }, currency_code , cashbackpercent} = this.props;
        const { grand_total, sub_total, cashback, redeempoints , apistatus } = base_order_info || {};
        return (
            <div block="MyAccountOrderPopup" elem="OrderWrapper">
                <h4 style={{ paddingBottom: "10px", borderBottom: "1px solid #f0f0f0" }}>{__('Order Total')}</h4>
                <dl>
                    <div>
                        <dt>{__('Subtotal')}</dt>
                        <dd>
                            {`${formatCurrency(currency_code)} ${numberWithComas(sub_total)}`}
                        </dd>
                    </div>
                    {apistatus && <div>
                        <dt>{__('Loyalty Redeemed')}</dt>
                        <dd style={{ color: "#DC6D6D" , fontWeight:"bold" }}>- {formatCurrency(currency_code)} {numberWithComas(redeempoints.split('.')[0])}</dd>
                    </div>}
                    <div style={{ paddingBottom: "10px", borderBottom: "1px solid #f0f0f0" }}>
                        <dt>{__('Tax')}</dt>
                        <dd>{formatCurrency(currency_code)} 0</dd>
                    </div>
                    <div>
                        <dt>{__('Grand total')}</dt>
                        <dd>
                            {`${formatCurrency(currency_code)} ${numberWithComas(grand_total.split('.')[0])}`}
                        </dd>
                    </div>
                    <div>
                        <dt>
                            {__(`Loyalty Credit ${cashbackpercent}%`)}
                            <br />
                            <span>*Loyalty points earned accumalate once the order is delivered</span>
                        </dt>
                        <dd style={{ color: "#03a685" , fontWeight:"bold" }}>Rs {cashback}</dd>
                    </div>
                </dl>
            </div>
        );
    }

    renderContent() {
        const { order: { order_products } } = this.props;

        if (!order_products) {
            return null;
        }

        return (
            <>
                { this.renderBaseInfo()}
                { this.renderPayment()}
                { this.renderShipping()}
                { this.renderProducts()}
                { this.renderTotals()}
            </>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <Popup
                id={ORDER_POPUP_ID}
                mix={{ block: 'MyAccountOrderPopup' }}
            >
                <div block="MyAccountOrderPopup" elem="Content">
                    <Loader isLoading={isLoading} />
                    {this.renderContent()}
                </div>
            </Popup>
        );
    }
}

export default MyAccountOrderPopup;
