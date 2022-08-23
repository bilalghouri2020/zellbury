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
import { isSignedIn } from 'Util/Auth';
import './CartPage.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import CartCoupon from 'Component/CartCoupon';
import CartItem from 'Component/CartItem';
import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';
import Link from 'Component/Link';
import ProductLinks from 'Component/ProductLinks';
import LoyaltyCashBackToggle from "Component/CashBackToggle"
import { CROSS_SELL } from 'Store/LinkedProducts/LinkedProducts.reducer';
import { TotalsType } from 'Type/MiniCart';
import { formatCurrency, roundPrice } from 'Util/Price';
import TagManager from 'react-gtm-module';
let counterCheck = 0;
export class CartPage extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        onCheckoutButtonClick: PropTypes.func.isRequired,
    };


    renderCartItems() {
        console.log("error number renderCartItems", ++counterCheck);
        const { totals: { items, quote_currency_code } } = this.props;

        if (!items || items.length < 1) {
            return (
                <p block="CartPage" elem="Empty">{__('There are no products in cart.')}</p>
            );
        }

        return (
            <>
                <p block="CartPage" elem="TableHead" aria-hidden>
                    <span>{__('item')}</span>
                    <span>{__('qty')}</span>
                    <span>{__('subtotal')}</span>
                </p>
                <ul block="CartPage" elem="Items" aria-label="List of items in cart">
                    {items.map((item) => (
                        <CartItem
                            key={item.item_id}
                            item={item}
                            currency_code={quote_currency_code}
                            isEditing
                            isLikeTable
                        />
                    ))}
                </ul>
            </>
        );
    }

    renderDiscountCode() {
        console.log("error number renderDiscountCode", ++counterCheck);
        const {
            totals: { coupon_code }
        } = this.props;

        return (
            <ExpandableContent
                heading={__('Have a discount code?')}
                mix={{ block: 'CartPage', elem: 'Discount' }}
            >
                <CartCoupon couponCode={coupon_code} />
            </ExpandableContent>
        );
    }

    renderPriceLine(price) {
        console.log("error number renderPriceLine", ++counterCheck);
        const { totals: { quote_currency_code } } = this.props;
        return `${formatCurrency(quote_currency_code)} ${roundPrice(price)}`;
    }

    renderTotalDetails(isMobile = false) {
        console.log("error number renderTotalDetails", ++counterCheck);
        let {
            totals: {
                subtotal = 0,
                tax_amount = 0
            }, pointsAvailable, handleLoyaltyToggle, cashbackpercent, isLoading, toggle, apistatus
        } = this.props;
        const toggleState = JSON.parse(localStorage.getItem("toggle")) ? JSON.parse(localStorage.getItem("toggle")).toggle : true
        let loyaltyPointsSub = pointsAvailable
        const cashback = (subtotal / 100) * cashbackpercent
        let total = subtotal
        if (toggleState && apistatus) {
            if (pointsAvailable > subtotal) {
                loyaltyPointsSub = subtotal
            } else if (pointsAvailable < subtotal) {
                total = subtotal - pointsAvailable
            }
        }
        return (
            <dl
                block="CartPage"
                elem="TotalDetails"
                aria-label={__('Order total details')}
                mods={{ isMobile }}
            >
                {apistatus && <dt><LoyaltyCashBackToggle state={toggleState} toggle={toggle} loyaltyPoints={pointsAvailable} handleLoyaltyToggle={handleLoyaltyToggle} isLoading={isLoading} /></dt>}
                <div>
                    <dt>{__('Subtotal')}</dt>
                    <dd>{this.renderPriceLine(subtotal)}</dd>
                </div>
                {toggleState && apistatus && <div>
                    <dt>{__('Loyalty Redeemed')}</dt>
                    <dd>- {this.renderPriceLine(loyaltyPointsSub)}</dd>
                </div>}
                {this.renderDiscount()}
                <div style={{ paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>
                    <dt>{__('Tax')}</dt>
                    <dd>{this.renderPriceLine(tax_amount)}</dd>
                </div>
                <div>
                    <dt>
                        {__(`Loyalty Credit ${cashbackpercent}%`)}
                        <br />
                        <span>*Loyalty points earned accumalate once the order is delivered</span>
                    </dt>
                    <dd style={{ color: "#03a685", fontWeight: "bold" }}>Rs {cashback.toFixed(1)}</dd>
                </div>
            </dl>
        );
    }

    renderTotal() {
        console.log("error number renderTotal", ++counterCheck);
        let {
            totals: {
                subtotal = 0,
            }, pointsAvailable, apistatus
        } = this.props;
        const toggleState = JSON.parse(localStorage.getItem("toggle")) ? JSON.parse(localStorage.getItem("toggle")).toggle : true
        if (toggleState && apistatus) {
            if (pointsAvailable > subtotal) {
                subtotal = 0
            } else if (pointsAvailable < subtotal) {
                subtotal = subtotal - pointsAvailable
            }
        }
        return (
            <dl block="CartPage" elem="Total" aria-label="Complete order total">
                <dt>{__('Order total')}</dt>
                <dd>{this.renderPriceLine(subtotal)}</dd>
            </dl>
        );
    }

    renderButtons() {
        console.log("error number renderButtons", ++counterCheck);
        console.log("check render buttons", ++counterCheck);
        const { onCheckoutButtonClick } = this.props;
        console.log("check render buttons", onCheckoutButtonClick);
        let customer = JSON.parse(localStorage.getItem('customer'));
        console.log("check render buttons", customer);
        if (customer) {
            console.log("check render buttons if", customer);
            let firstName = '';
            if (customer.data.firstname.split(' ').length > 1) {
                console.log("check render buttons nested if", customer.data.firstname);
                firstName = customer.data.firstname.split(' ')[0]
                console.log("check render buttons nested if after", customer.data.firstname);
            }
            else {
                console.log("check render buttons nested else", ++counterCheck);
                firstName = customer.data.firstname;
            }
            console.log("before return", firstName);
            try {
                return (
                    <div block="CartPage" elem="CheckoutButtons">
                        <button
                            block="CartPage"
                            elem="CheckoutButton"
                            mix={{ block: 'Button' }}
                            onClick={onCheckoutButtonClick}
                        >

                            {__(firstName ? 'CONTINUE AS ' + firstName : 'Secure checkout')}
                        </button>
                        <button
                            block="CartPage"
                            elem="ContinueShopping"
                            mix={{ block: 'Button' }}

                        >

                            {__(firstName ? 'Not ' + firstName + ', Change here?' : 'Continue shopping')}
                        </button>
                    </div>
                );

            } catch (error) {
                console.log("cartItem error from catch...", error);
                return <div block="CartPage" elem="CheckoutButtons">

                </div>
            }
        }
        else {
            console.log("check render buttons else", ++counterCheck);
            return (
                <div block="CartPage" elem="CheckoutButtons">
                    <button
                        block="CartPage"
                        elem="CheckoutButton"
                        mix={{ block: 'Button' }}
                        onClick={onCheckoutButtonClick}
                    >

                        {__('Continue')}
                    </button>
                    <Link
                        block="CartPage"
                        elem="ContinueShopping"
                        to="/"
                    >
                        {__('Continue shopping')}
                    </Link>
                </div>
            );
        }

    }

    renderTotals() {
        console.log("error number renderTotals", ++counterCheck);
        return (
            <article block="CartPage" elem="Summary">
                <h4 block="CartPage" elem="SummaryHeading">{__('Summary')}</h4>
                {this.renderTotalDetails()}
                {this.renderTotal()}
                {this.renderButtons()}
            </article>
        );
    }

    renderDiscount() {
        console.log("error number renderDiscount", ++counterCheck);
        const {
            totals: {
                coupon_code,
                discount_amount = 0
            }
        } = this.props;

        if (!coupon_code) {
            return null;
        }

        return (
            <>
                <dt>
                    {__('Coupon ')}
                    <strong block="CartPage" elem="DiscountCoupon">{coupon_code.toUpperCase()}</strong>
                </dt>
                <dd>{`-${this.renderPriceLine(Math.abs(discount_amount))}`}</dd>
            </>
        );
    }

    renderCrossSellProducts() {
        console.log("error number renderCrossSellProducts", ++counterCheck);
        return (
            <ProductLinks
                linkType={CROSS_SELL}
                title={__('Frequently bought together')}
            />
        );
    }

    renderPromoContent() {
        console.log("error number renderPromoContent", ++counterCheck);
        const { cart_content: { cart_cms } = {} } = window.contentConfiguration;

        if (cart_cms) {
            return <CmsBlock identifier={cart_cms} />;
        }

        return (
            <figure
                block="CartPage"
                elem="PromoBlock"
            >
                <figcaption block="CartPage" elem="PromoText">
                    {__('Free shipping on order 49$ and more.')}
                </figcaption>
            </figure>
        );
    }

    renderPromo() {
        console.log("error number renderPromo", ++counterCheck);
        return (
            <div
                block="CartPage"
                elem="Promo"
            >
                {this.renderPromoContent()}
            </div>
        );
    }

    renderHeading() {
        console.log("error number renderHeading", ++counterCheck);
        return (
            <h1 block="CartPage" elem="Heading">
                {__('Shopping cart')}
            </h1>
        );
    }

    componentDidCatch(err, info) {
        console.log("error number componentDidCatch", ++counterCheck);
        console.log("error from cartItem.......", err, info);
    }


    componentDidMount() {
        console.log('car page props...........', this.props);

        let itemsArr = this.props?.totals?.items?.map(item => {
            const {
                sku, product: {
                    name,
                    price_range: {
                        minimum_price: {
                            discount: {
                                amount_off
                            },
                            regular_price: {
                                value
                            }
                        }
                    }
                },
                qty
            } = item

            const category1 = item.product.categories[0].name || ''
            const category2 = item.product.categories[1].name || ''
            const category3 = item.product.categories[2].name || ''
            const color = item.product?.attributes?.color?.attribute_options[item.product?.attributes?.color?.attribute_value]?.label || 'color not mention'

            return {
                item_id: sku,//"SKU_12345", //sku
                item_name: name, //"Stan and Friends Tee", //product name
                // affiliation: "Google Merchandise Store",
                // coupon: "SUMMER_FUN",
                currency: "PKR",
                discount: amount_off,//2.22, // PRICE - SPECIAL PRICE
                // index: 0, // PRODUCT POSITION
                item_brand: "Zellbury",
                item_category: category1, // category level 1
                item_category2: category2, // category level 2
                item_category3: category3, //category level 3
                //item_category4: "null", 
                //item_category5: "null",
                //item_list_id: "related_products",
                //item_list_name: "Related Products",
                item_variant: color, // color
                //location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
                price: value, // price - (not special price)
                quantity: qty // QTY THAT IS in CART FOR THIS ITEM SPECIFICALLY
            }
        })
        console.log("item array ...........", itemsArr);

        // let itemsArr = 
        const GtmDataLayerProductArgs = {
            dataLayer: {
                event: "view_cart",
                ecommerce: {
                    currency: "PKR",
                    value: this?.props?.totals?.subtotal_with_discount, //7.77, // TOTAL VALUE IN CART
                    items: [...itemsArr]
                }
            }
        }
        TagManager.dataLayer(GtmDataLayerProductArgs);
    }

    render() {
        console.log("error number render", ++counterCheck);
        return (
            <main block="CartPage" aria-label="Cart Page">
                <ContentWrapper
                    wrapperMix={{ block: 'CartPage', elem: 'Wrapper' }}
                    label="Cart page details"
                >
                    <div block="CartPage" elem="Static">
                        {this.renderHeading()}
                        {this.renderCartItems()}
                        {this.renderTotalDetails(true)}
                        {this.renderDiscountCode()}
                        {this.renderCrossSellProducts()}
                    </div>
                    <div block="CartPage" elem="Floating">
                        {this.renderPromo()}
                        {this.renderTotals()}
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

export default CartPage;
