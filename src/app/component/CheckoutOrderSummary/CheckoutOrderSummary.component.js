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

import './CheckoutOrderSummary.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CartItem from 'Component/CartItem';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import { TotalsType } from 'Type/MiniCart';
import { formatCurrency, roundPrice } from 'Util/Price';
import numberWithCommas from "../../util/NumberWithCommas";

/**
 * Checkout Order Summary component
 */
export class CheckoutOrderSummary extends PureComponent {
    static propTypes = {
        totals: TotalsType,
        paymentTotals: TotalsType,
        checkoutStep: PropTypes.string.isRequired
    };

    static defaultProps = {
        totals: {},
        paymentTotals: {}
    };
    getTotals() {

    }
    renderPriceLine(price, name, mods) {
        if (!price) {
            return null;
        }
        const { totals: { quote_currency_code } } = this.props;
        const priceString = formatCurrency(quote_currency_code);

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={mods}>
                <span block="CheckoutOrderSummary" elem="Text">
                    {name}
                </span>
                <span block="CheckoutOrderSummary" elem="Text">
                    {`${priceString} ${price}`}
                </span>
            </li>
        );
    }

    renderItem = (item) => {
        const {
            totals: {
                quote_currency_code
            }
        } = this.props;

        const { item_id } = item;

        return (
            <CartItem
                key={item_id}
                item={item}
                currency_code={quote_currency_code}
            />
        );
    };

    renderCouponCode() {
        const {
            totals: {
                discount_amount,
                coupon_code
            }
        } = this.props;

        if (!coupon_code) {
            return null;
        }

        return this.renderPriceLine(
            -Math.abs(discount_amount),
            __('Coupon %s:', coupon_code.toUpperCase())
        );
    }

    renderItems() {
        const { totals: { items = [] } } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderItems">
                <ul block="CheckoutOrderSummary" elem="CartItemList">
                    {items.map(this.renderItem)}
                </ul>
            </div>
        );
    }

    renderHeading() {
        const { totals: { items_qty } } = this.props;

        return (
            <h3
                block="CheckoutOrderSummary"
                elem="Header"
                mix={{ block: 'CheckoutPage', elem: 'Heading', mods: { hasDivider: true } }}
            >
                <span>{__('Order Summary')}</span>
                <p block="CheckoutOrderSummary" elem="ItemsInCart">{__('%s Item(s) In Cart', items_qty)}</p>
            </h3>
        );
    }

    renderTotals() {
        const {
            totals: {
                subtotal,
                tax_amount,
                grand_total,
                // shipping_amount
            },
            paymentTotals: {
                grand_total: payment_grand_total,
                shipping_amount
            }, 
            checkoutStep,
            loyalty : {
                pointsAvailable, cashbackpercent
            },
            toggle
        } = this.props;
        let loyaltyPointsSub = pointsAvailable
        let grand_total_sub = subtotal + tax_amount
        const cashback = (grand_total_sub / 100) * cashbackpercent
        if (toggle) {
            if (pointsAvailable > grand_total_sub) {
                loyaltyPointsSub = grand_total_sub
                grand_total_sub = checkoutStep !== SHIPPING_STEP ? shipping_amount : 0
            }else if (pointsAvailable < grand_total_sub) {
                grand_total_sub = grand_total_sub - pointsAvailable
            }
        }else{
            grand_total_sub = payment_grand_total
        }
        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <ul>
                    {this.renderPriceLine(numberWithCommas(subtotal), __('Subtotal'))}
                    {checkoutStep !== SHIPPING_STEP
                        ? this.renderPriceLine(shipping_amount, __('Shipping'), { divider: true })
                        : null}
                    {this.renderCouponCode()}
                    {toggle && <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Loyalty Redeemed
                        </span>
                        <span style={{ color: "#DC6D6D" }} block="CheckoutOrderSummary" elem="Text">
                            - RS {numberWithCommas(loyaltyPointsSub)}
                        </span>
                    </li>}
                    <li style={{ paddingBottom: "20px", borderBottom: "1px solid #f0f0f0" }} block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Tax
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            Rs 0
                        </span>
                    </li>
                    {checkoutStep !== SHIPPING_STEP
                        ?
                        (
                            <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem" >
                                <span block="CheckoutOrderSummary" elem="Text">
                                    Grand total
                        </span>
                                <span block="CheckoutOrderSummary" elem="Text">
                                    Rs {numberWithCommas(grand_total_sub)}
                                </span>
                            </li>
                        )
                        :
                        (
                            <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem" >
                                <span block="CheckoutOrderSummary" elem="Text">
                                    Grand total
                        </span>
                                <span block="CheckoutOrderSummary" elem="Text">
                                    Rs {numberWithCommas(grand_total_sub)}
                                </span>
                            </li>
                        )
                    }
                    <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Loyalty Credit {cashbackpercent}%
                        <br />
                            <span>*Loyalty points earned accumalate once the order is delivered</span>
                        </span>
                        <span style={{ color: "#03a685" }} block="CheckoutOrderSummary" elem="Text">
                            Rs {numberWithCommas(cashback.toFixed(1))}
                        </span>
                    </li>
                </ul>
            </div>
        );
    }

    render() {
        return (
            <article block="CheckoutOrderSummary" aria-label="Order Summary">
                { this.renderHeading()}
                { this.renderItems()}
                { this.renderTotals()}
            </article>
        );
    }
}

export default CheckoutOrderSummary;
