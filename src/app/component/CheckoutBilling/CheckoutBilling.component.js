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

import './CheckoutBilling.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutPayments from 'Component/CheckoutPayments';
import CheckoutTermsAndConditionsPopup from 'Component/CheckoutTermsAndConditionsPopup';
import Field from 'Component/Field';
import Form from 'Component/Form';
import { BILLING_STEP } from 'Route/Checkout/Checkout.config';
import { addressType } from 'Type/Account';
import { paymentMethodsType } from 'Type/Checkout';
import { TotalsType } from 'Type/MiniCart';
import numberWithCommas from "../../util/NumberWithCommas"
import LoyaltyCashBackToggle from "Component/CashBackToggle";

export class CheckoutBilling extends PureComponent {
    state = {
        isOrderButtonVisible: true,
        isOrderButtonEnabled: true,
        isTermsAndConditionsAccepted: false
    };

    static propTypes = {
        setLoading: PropTypes.func.isRequired,
        setDetailsStep: PropTypes.func.isRequired,
        isSameAsShipping: PropTypes.bool.isRequired,
        termsAreEnabled: PropTypes.bool,
        onSameAsShippingChange: PropTypes.func.isRequired,
        onPaymentMethodSelect: PropTypes.func.isRequired,
        onBillingSuccess: PropTypes.func.isRequired,
        onBillingError: PropTypes.func.isRequired,
        onAddressSelect: PropTypes.func.isRequired,
        showPopup: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        totals: TotalsType.isRequired,
        shippingAddress: addressType.isRequired,
        termsAndConditions: PropTypes.arrayOf(PropTypes.shape({
            checkbox_text: PropTypes.string
        })).isRequired
    };

    static defaultProps = {
        termsAreEnabled: false
    };

    componentDidMount() {
        const { termsAreEnabled } = this.props;
        if (!termsAreEnabled) {
            this.setState({ isOrderButtonEnabled: true });
        }
    }

    setOrderButtonVisibility = (isOrderButtonVisible) => {
        this.setState({ isOrderButtonVisible });
    };

    setOrderButtonEnableStatus = (isOrderButtonEnabled) => {
        this.setState({ isOrderButtonEnabled });
    };

    setTACAccepted = () => {
        this.setState(({ isTermsAndConditionsAccepted: oldIsTACAccepted }) => ({
            isTermsAndConditionsAccepted: !oldIsTACAccepted
        }));
    };

    handleShowPopup = (e) => {
        const { showPopup } = this.props;
        e.preventDefault();
        showPopup();
    };

    renderTermsAndConditions() {
        const {
            termsAreEnabled,
            termsAndConditions
        } = this.props;

        const {
            checkbox_text = __('I agree to terms and conditions')
        } = termsAndConditions[0] || {};

        const { isTermsAndConditionsAccepted } = this.state;

        if (!termsAreEnabled) {
            return null;
        }

        return (
            <div
                block="CheckoutBilling"
                elem="TermsAndConditions"
            >
                <label
                    block="CheckoutBilling"
                    elem="TACLabel"
                    htmlFor="termsAndConditions"
                >
                    {checkbox_text}
                    <button
                        block="CheckoutBilling"
                        elem="TACLink"
                        onClick={this.handleShowPopup}
                    >
                        {__('read more')}
                    </button>
                </label>
                <Field
                    id="termsAndConditions"
                    name="termsAndConditions"
                    type="checkbox"
                    value="termsAndConditions"
                    mix={{ block: 'CheckoutBilling', elem: 'TermsAndConditions-Checkbox' }}
                    checked={isTermsAndConditionsAccepted}
                    onChange={this.setTACAccepted}
                />
            </div>
        );
    }

    renderActions() {
        const {
            isOrderButtonVisible,
            isOrderButtonEnabled,
            isTermsAndConditionsAccepted
        } = this.state;

        const { termsAreEnabled } = this.props;

        if (!isOrderButtonVisible) {
            return null;
        }

        // if terms and conditions are enabled, validate for acceptance
        const isDisabled = termsAreEnabled
            ? !isOrderButtonEnabled || !isTermsAndConditionsAccepted
            : !isOrderButtonEnabled;

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                <button
                    type="submit"
                    block="Button"
                    disabled={isDisabled}
                    mix={{ block: 'CheckoutBilling', elem: 'Button' }}
                >
                    {__('Complete order')}
                </button>
            </div>
        );
    }

    renderAddressBook() {
        const {
            onAddressSelect,
            isSameAsShipping,
            totals: { is_virtual }
        } = this.props;

        if (isSameAsShipping && !is_virtual) {
            return null;
        }

        return (
            <CheckoutAddressBook
                onAddressSelect={onAddressSelect}
                isBilling
            />
        );
    }

    renderSameAsShippingCheckbox() {
        const {
            isSameAsShipping,
            onSameAsShippingChange,
            totals: { is_virtual }
        } = this.props;

        if (is_virtual) {
            return null;
        }

        return (
            <Field
                id="sameAsShippingAddress"
                name="sameAsShippingAddress"
                type="checkbox"
                label={__('My billing and shipping are the same')}
                value="sameAsShippingAddress"
                mix={{ block: 'CheckoutBilling', elem: 'Checkbox' }}
                checked={isSameAsShipping}
                onChange={onSameAsShippingChange}
            />
        );
    }

    renderAddresses() {
        return (
            <>
                {this.renderSameAsShippingCheckbox()}
                {this.renderAddressBook()}
            </>
        );
    }

    renderPayments() {
        const {
            paymentMethods,
            onPaymentMethodSelect,
            setLoading,
            setDetailsStep,
            shippingAddress
        } = this.props;

        if (!paymentMethods.length) {
            return null;
        }

        return (
            <CheckoutPayments
                setLoading={setLoading}
                setDetailsStep={setDetailsStep}
                paymentMethods={paymentMethods}
                onPaymentMethodSelect={onPaymentMethodSelect}
                setOrderButtonVisibility={this.setOrderButtonVisibility}
                billingAddress={shippingAddress}
                setOrderButtonEnableStatus={this.setOrderButtonEnableStatus}
            />
        );
    }

    renderPopup() {
        return <CheckoutTermsAndConditionsPopup />;
    }
    renderToggle() {
        const { loyalty: { pointsAvailable, apistatus }, handleLoyaltyToggle, isLoading } = this.props;
        const toggleState = JSON.parse(localStorage.getItem("toggle")) ? JSON.parse(localStorage.getItem("toggle")).toggle : true
        return (
            apistatus ? <LoyaltyCashBackToggle state={toggleState} loyaltyPoints={pointsAvailable} handleLoyaltyToggle={handleLoyaltyToggle} isLoading={isLoading} /> : null
        )
    }
    renderOrderSummary() {
        const {
            paymentTotals,
            loyalty: {
                pointsAvailable, cashbackpercent, apistatus
            },
            toggle
        } = this.props;
        const {
            shipping_amount,
            subtotal,
            grand_total } = paymentTotals
        let loyaltyPointsSub = pointsAvailable
        let grand_total_sub = subtotal
        const cashback = (grand_total_sub / 100) * cashbackpercent
        if (toggle && apistatus) {
            if (pointsAvailable > grand_total_sub) {
                loyaltyPointsSub = grand_total_sub
                grand_total_sub = shipping_amount
            } else if (pointsAvailable < grand_total_sub) {
                grand_total_sub = grand_total_sub - pointsAvailable
            }
        }else{
            grand_total_sub = grand_total
        }
        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <h3
                    block="CheckoutOrderSummary"
                    elem="Header"
                    mix={{ block: 'CheckoutPage', elem: 'Heading', mods: { hasDivider: true } }}
                >
                    <span>{__('Order Summary')}</span>
                </h3>
                <hr />
                <ul>
                    <li block="CheckoutOrderSummary" elem="SummaryItem" style={{ marginTop: "9px" }}>
                        <span block="CheckoutOrderSummary" elem="Text">
                            Subtotal
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            {`Rs ${numberWithCommas(subtotal)}`}
                        </span>
                    </li>
                    <li block="CheckoutOrderSummary" elem="SummaryItem" style={{ marginTop: "9px" }}>
                        <span block="CheckoutOrderSummary" elem="Text">
                            Shipping
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            {`Rs ${numberWithCommas(shipping_amount)}`}
                        </span>
                    </li>
                    {toggle && apistatus && <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Loyalty Redeemed
                        </span>
                        <span style={{ color: "#DC6D6D", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            - Rs {numberWithCommas(loyaltyPointsSub)}
                        </span>
                    </li>}
                    <li style={{ paddingBottom: "15px", borderBottom: "1px solid #f0f0f0" }} block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Tax
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            Rs 0
                        </span>
                    </li>

                    <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Grand total
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            Rs {numberWithCommas(grand_total_sub)}
                        </span>
                    </li>

                    <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Loyalty Credit {cashbackpercent}%
                            <br />
                            <span>*Loyalty points earned accumalate once the order is delivered</span>
                        </span>
                        <span style={{ color: "#03a685", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            Rs {numberWithCommas(cashback.toFixed(1))}
                        </span>
                    </li>
                </ul>
            </div>
        )
    }

    render() {
        const { onBillingSuccess, onBillingError } = this.props;
        return (
            <Form
                mix={{ block: 'CheckoutBilling' }}
                id={BILLING_STEP}
                onSubmitError={onBillingError}
                onSubmitSuccess={onBillingSuccess}
            >
                {this.renderAddresses()}
                {this.renderPayments()}
                {this.renderToggle()}
                {this.renderOrderSummary()}
                {this.renderTermsAndConditions()}
                {this.renderActions()}
                {this.renderPopup()}
            </Form>
        );
    }
}

export default CheckoutBilling;
