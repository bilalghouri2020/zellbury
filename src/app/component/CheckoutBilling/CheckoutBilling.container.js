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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { BRAINTREE, KLARNA, STRIPE } from 'Component/CheckoutPayments/CheckoutPayments.config';
import {
    TERMS_AND_CONDITIONS_POPUP_ID
} from 'Component/CheckoutTermsAndConditionsPopup/CheckoutTermsAndConditionsPopup.config';
import { showNotification } from 'Store/Notification/Notification.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { addressType, customerType } from 'Type/Account';
import { paymentMethodsType } from 'Type/Checkout';
import { TotalsType } from 'Type/MiniCart';
import { trimAddressFields, trimCustomerAddress } from 'Util/Address';

import CheckoutBilling from './CheckoutBilling.component';
import TagManager from 'react-gtm-module';

export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    totals: state.CartReducer.cartTotals,
    termsAreEnabled: state.ConfigReducer.terms_are_enabled,
    termsAndConditions: state.ConfigReducer.checkoutAgreements
});

export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (message) => dispatch(showNotification('error', message)),
    showPopup: (payload) => dispatch(showPopup(TERMS_AND_CONDITIONS_POPUP_ID, payload))
});

export class CheckoutBillingContainer extends PureComponent {
    static propTypes = {
        showErrorNotification: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        savePaymentInformation: PropTypes.func.isRequired,
        showPopup: PropTypes.func.isRequired,
        shippingAddress: addressType.isRequired,
        customer: customerType.isRequired,
        totals: TotalsType.isRequired,
        termsAndConditions: PropTypes.arrayOf(PropTypes.shape({
            checkbox_text: PropTypes.string,
            content: PropTypes.string,
            name: PropTypes.string
        })).isRequired
    };

    static getDerivedStateFromProps(props, state) {
        const { paymentMethod, prevPaymentMethods } = state;
        const { paymentMethods } = props;

        if (!prevPaymentMethods.length && !paymentMethod) {
            const [method] = paymentMethods;
            const { code: paymentMethod } = method || {};

            return {
                prevPaymentMethods: paymentMethods,
                paymentMethod
            };
        }

        return null;
    }

    containerFunctions = {
        onBillingSuccess: this.onBillingSuccess.bind(this),
        onBillingError: this.onBillingError.bind(this),
        onAddressSelect: this.onAddressSelect.bind(this),
        onSameAsShippingChange: this.onSameAsShippingChange.bind(this),
        onPaymentMethodSelect: this.onPaymentMethodSelect.bind(this),
        showPopup: this.showPopup.bind(this)
    };

    constructor(props) {
        super(props);

        const { paymentMethods, customer } = props;
        const [method] = paymentMethods;
        const { code: paymentMethod } = method || {};

        this.state = {
            isSameAsShipping: this.isSameShippingAddress(customer),
            selectedCustomerAddressId: 0,
            prevPaymentMethods: paymentMethods,
            paymentMethod
        };
    }

    isSameShippingAddress({ default_billing, default_shipping }) {
        const { totals: { is_virtual } } = this.props;

        if (is_virtual) {
            return false;
        }

        return default_billing === default_shipping;
    }

    onAddressSelect(id) {
        this.setState({ selectedCustomerAddressId: id });
    }

    onSameAsShippingChange() {
        this.setState(({ isSameAsShipping }) => ({ isSameAsShipping: !isSameAsShipping }));
    }

    onPaymentMethodSelect(code) {
        this.setState({ paymentMethod: code });
    }

    onBillingSuccess(fields, asyncData) {
        const { savePaymentInformation } = this.props;
        const address = this._getAddress(fields);
        const paymentMethod = this._getPaymentData(asyncData);
        console.log('completition of order this.props..........', this.props);

        savePaymentInformation({
            billing_address: address,
            paymentMethod
        });


        



        // let itemsArr = this.props?.totals?.items?.map(item => {
        //     const { sku, product: { name, price_range: { minimum_price: { discount: { amount_off }, final_price: { value } } } } } = item
        //     const category1 = item.product.categories[0].name || ''
        //     const category2 = item.product.categories[1].name || ''
        //     const category3 = item.product.categories[2].name || ''
        //     const color = item.product?.attributes?.color?.attribute_options[item.product?.attributes?.color?.attribute_value]?.label || 'color not mention'
        //     return {
        //         item_id: sku,//"SKU_12345", //sku
        //         item_name: name, //"Stan and Friends Tee", //product name
        //         // affiliation: "Google Merchandise Store",
        //         // coupon: "SUMMER_FUN",
        //         currency: "PKR",
        //         discount: amount_off,//2.22, // PRICE - SPECIAL PRICE
        //         index: 0, // PRODUCT POSITION
        //         item_brand: "Zellbury",
        //         item_category: category1, // category level 1
        //         item_category2: category2, // category level 2
        //         item_category3: category3, //category level 3
        //         //item_category4: "null", 
        //         //item_category5: "null",
        //         //item_list_id: "related_products",
        //         //item_list_name: "Related Products",
        //         item_variant: color, // color
        //         //location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
        //         price: value, // price - (not special price)
        //         quantity: item.qty // QTY THAT IS in CART FOR THIS ITEM SPECIFICALLY
        //     }
        // })

        // const GtmDataLayerProductArgs = {
        //     dataLayer: {
        //         event: "purchase",
        //         ecommerce: {
        //             transaction_id: "T_12345",
        //             affiliation: "Zellbury",
        //             value: this.props?.totals?.subtotal_with_discount, //25.42,
        //             tax: this.props.totals.tax_amount,//4.90,
        //             value: this.props.totals.grand_total - this.props?.totals?.subtotal_with_discount, //25.42,
        //             currency: this.props.totals.quote_currency_code,//"USD",
        //             coupon: "Test-1234",
        //             items: [...itemsArr]
        //         }
        //     },
        // };

        // console.log('GtmDataLayerProductArgs........', GtmDataLayerProductArgs);

        // TagManager.dataLayer(GtmDataLayerProductArgs);

    }

    onBillingError(fields, invalidFields, error) {
        const { showErrorNotification } = this.props;

        if (error) {
            const { message = __('Something went wrong!') } = error;
            showErrorNotification(message);
        }
    }

    showPopup() {
        const { showPopup, termsAndConditions } = this.props;
        const {
            name: title = __('Terms and Conditions'),
            content: text = __('There are no Terms and Conditions configured.')
        } = termsAndConditions[0] || {};

        return showPopup({
            title, text
        });
    }

    _getPaymentData(asyncData) {
        const { paymentMethod: code } = this.state;

        switch (code) {
            case BRAINTREE:
                const [{ nonce }] = asyncData;

                return {
                    code,
                    additional_data: {
                        payment_method_nonce: nonce,
                        is_active_payment_token_enabler: false
                    }
                };
            case STRIPE:
                const [{ token, handleAuthorization }] = asyncData;
                if (token === null) {
                    return false;
                }

                return {
                    code,
                    additional_data: {
                        cc_stripejs_token: token,
                        cc_save: false
                    },
                    handleAuthorization
                };
            case KLARNA:
                const [{ authorization_token }] = asyncData;
                return {
                    code,
                    additional_data: {
                        authorization_token
                    }
                };
            default:
                return { code };
        }
    }

    _getAddress(fields) {
        const { shippingAddress } = this.props;

        const {
            isSameAsShipping,
            selectedCustomerAddressId
        } = this.state;

        if (isSameAsShipping) {
            return shippingAddress;
        }

        if (!selectedCustomerAddressId) {
            return trimAddressFields(fields);
        }

        const { customer: { addresses } } = this.props;
        const address = addresses.find(({ id }) => id === selectedCustomerAddressId);

        return trimCustomerAddress(address);
    }

    componentDidMount() {
        console.log('checkout Billing page in component did mount.....this.props.', this.props);


        let itemsArr1 = this.props?.totals?.items?.map(item => {
            const { sku, product: { name, price_range: { minimum_price: { discount: { amount_off }, final_price: { value } } } } } = item
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
                quantity: item.qty // QTY THAT IS in CART FOR THIS ITEM SPECIFICALLY
            }
        })

        const GtmDataLayerProductArgs1 = {
            dataLayer: {
                event: "add_shipping_info",
                ecommerce: {
                    currency: "PKR",
                    value: this.props?.totals?.subtotal_with_discount, //7.77, //TOTAL VALUE IN CART
                    coupon: this.props?.totals?.coupon_code,
                    shipping_tier: "Ground",
                    items: [...itemsArr1]
                }
            },
        };

        console.log('GtmDataLayerProductArgs...1........', GtmDataLayerProductArgs1);
        TagManager.dataLayer(GtmDataLayerProductArgs1);

    }

    render() {
        return (
            <CheckoutBilling
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutBillingContainer);
