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

// import { ParcelStatus } from 'Route/ParcelStatus';
import './Checkout.style';
import { orderType } from 'Type/Account';
import BrowserDatabase from 'Util/BrowserDatabase';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import OrderStatusStepper from "Component/OrderStatusStepper"
import OrderStatusLeopards from "Component/OrderStatusLeopards"
import { formatCurrency } from 'Util/Price';
import CheckoutBilling from 'Component/CheckoutBilling';
import CheckoutGuestForm from 'Component/CheckoutGuestForm';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import CheckoutShipping from 'Component/CheckoutShipping';
import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import { CHECKOUT } from 'Component/Header/Header.config';
import Loader from 'Component/Loader';
import { addressType } from 'Type/Account';
import { paymentMethodsType, shippingMethodsType } from 'Type/Checkout';
import { HistoryType } from 'Type/Common';
import { TotalsType } from 'Type/MiniCart';
import { appendWithStoreCode } from 'Util/Url';
import numberWithCommas from "../../util/NumberWithCommas"
import Link from 'Component/Link';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";
import CheckoutTermsAndConditionsPopup from 'Component/CheckoutTermsAndConditionsPopup';
import Image from 'Component/Image';
import TagManager from 'react-gtm-module';
import { getMessageFromStatus, getExpectedDate, checkRenderDetails, DateFormatter } from 'Util/Order';
import DateFormat from 'Util/Date';
const clientAPI = new ApolloClient({
    uri: window.location.protocol + '//' + window.location.hostname + '/graphql'
});
const mobileRingGif = window.location.protocol + '//' + window.location.hostname + '/media/wysiwyg/homepage/mobile-ring.gif';

import {
    BILLING_STEP,
    CHECKOUT_URL,
    ORDER_URL,
    DETAILS_STEP,
    SHIPPING_STEP,
    ORDER_STATUS
} from './Checkout.config';

import checkoutSuccess from "../../../../media/double-tick.png";
export class Checkout extends PureComponent {
    static propTypes = {

        currency_code: PropTypes.string.isRequired,
        order: orderType.isRequired,
        setLoading: PropTypes.func.isRequired,
        setDetailsStep: PropTypes.func.isRequired,
        shippingMethods: shippingMethodsType.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        saveAddressInformation: PropTypes.func.isRequired,
        savePaymentInformation: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isDeliveryOptionsLoading: PropTypes.bool.isRequired,
        shippingAddress: addressType.isRequired,
        checkoutTotals: TotalsType.isRequired,
        orderID: PropTypes.string.isRequired,
        orderSms: PropTypes.string.isRequired,
        history: HistoryType.isRequired,
        onEmailChange: PropTypes.func.isRequired,
        isGuestEmailSaved: PropTypes.bool.isRequired,
        paymentTotals: TotalsType,
        checkoutStep: PropTypes.oneOf([
            SHIPPING_STEP,
            BILLING_STEP,
            DETAILS_STEP
        ]).isRequired,
        isCreateUser: PropTypes.bool.isRequired,
        onCreateUserChange: PropTypes.func.isRequired,
        onPasswordChange: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired
    };

    static defaultProps = {
        paymentTotals: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            openPopup: false,
            orderSmsCode: '',
            orderId: '',
            timerTime: {},
            timerSeconds: '90',
            isShowResendBtn: true,
            isResendBtnDisabled: true,
            isVerifyBtnDisabled: false,
            isVerifyBtnText: "Verify",
            isShowTimer: true,
            order: {},
            locationPopup: false
        };

        this.timer = 0;

        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);

        this.handleApiResponse = this.handleApiResponse.bind(this);
        this.handleResendApiResponse = this.handleResendApiResponse.bind(this);
    }

    stepMap = {
        [SHIPPING_STEP]: {
            title: __('Shipping step'),
            url: '/shipping',
            render: this.renderShippingStep.bind(this),
            areTotalsVisible: true
        },
        [BILLING_STEP]: {
            title: __('Billing step'),
            url: '/billing',
            render: this.renderBillingStep.bind(this),
            areTotalsVisible: true
        },
        [DETAILS_STEP]: {
            title: __('Thank you for your purchase!'),
            url: '/success',
            render: this.renderPartialDetailsStep.bind(this),
            areTotalsVisible: false
        },
        [ORDER_STATUS]: {
            title: __('Order Tracking'),
            url: `/status/${this.props.match.params.orderid}/`,
            render: this.renderDetailsStep.bind(this),
            areTotalsVisible: false
        }
    };

    // formatDate(d) {
    //     return `${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)} ${new Intl.DateTimeFormat('en', { month: 'short' }).format(d)}`;
    // }
    onOpenModal = () => {
        this.setState({ openPopup: true });
    };

    onCloseModal = () => {
        this.setState({ openPopup: false });
    };

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };

        return obj;
    }

    componentDidMount() {

        // if (navigator.geolocation) {
        //     console.log('Geolocation is supported!');
        // }
        // else {
        //     console.log('Geolocation is not supported for this Browser/OS.');
        // }
        const { checkoutStep, history } = this.props;
        const { url } = this.stepMap[checkoutStep];

        this.updateHeader();
        let user = BrowserDatabase.getItem('customer');
        let externalId = '';
        if (user) {
            externalId = user.customer_id
        }
        let GtmDataLayerCheckoutArgs = {
            dataLayer: {
                pageType: 'shipping',
                externalId
            }
        };
        TagManager.dataLayer(GtmDataLayerCheckoutArgs);

        let timeLeftVar = this.secondsToTime(this.state.timerSeconds);
        this.setState({ timerTime: timeLeftVar });

        history.replace(appendWithStoreCode(`${url.indexOf('status') > -1 ? ORDER_URL : CHECKOUT_URL}${url}`));
    }

    componentDidUpdate(prevProps) {
        const { checkoutTotals: { items, items_qty, quote_currency_code, grand_total }, checkoutStep, orderSms, orderID, estimated_delivery, shipping_description } = this.props;
        const isDetails = checkoutStep === DETAILS_STEP;
        const isShipping = checkoutStep === SHIPPING_STEP;
        const isBilling = checkoutStep === BILLING_STEP;
        const { checkoutStep: prevCheckoutStep } = prevProps;
        let user = BrowserDatabase.getItem('customer');
        let externalId = '';
        if (user) {
            externalId = user.customer_id
        }
        if (checkoutStep !== prevCheckoutStep) {
            this.updateHeader();
            if (isDetails) {
                if (items) {
                    let itemsObject = {};

                    items.map((item, index) => {
                        const { sku, price, product } = item;
                        const { id, categories, name } = product;
                        let itemCatPath = '';
                        if (categories) {
                            let catKeys = Object.keys(categories);
                            let catLast = catKeys[catKeys.length - 1];
                            itemCatPath = categories[catLast].url;
                        }
                        if (itemCatPath.charAt(0) == "/") itemCatPath = itemCatPath.substr(1);
                        if (itemCatPath.charAt(itemCatPath.length - 1) == "/") itemCatPath = itemCatPath.substr(0, itemCatPath.length - 1);

                        let pushItem = { "prodId": id, "prodSku": sku, "prodName": name, "prodPrice": price, "prodCat": itemCatPath };
                        itemsObject[index] = pushItem;
                    });
                    let GtmDataLayerCheckoutArgs = {
                        dataLayer: {
                            event: 'Purchase',
                            externalId,
                            name: user.firstname,
                            courier: shipping_description.split("- ")[1],
                            est_delivery: getExpectedDate(estimated_delivery),
                            pageType: 'success',
                            currencyCode: quote_currency_code,
                            cartOrderID: orderID,
                            cartTotalQty: items_qty,
                            cartGrandTotal: grand_total,
                            cartImpressions: itemsObject
                        }
                    };
                    TagManager.dataLayer(GtmDataLayerCheckoutArgs);

                }

                if (orderSms) {
                    const { status } = JSON.parse(orderSms);

                    if (status) {
                        this.startTimer();
                        this.setState({ openPopup: true });
                        this.setState({ orderId: orderID });
                    }
                }
            } else if (isShipping) {
                let GtmDataLayerCheckoutArgs = {
                    dataLayer: {
                        externalId,
                        pageType: 'shipping'
                    }
                };
                TagManager.dataLayer(GtmDataLayerCheckoutArgs);
            } else if (isBilling) {
                let GtmDataLayerCheckoutArgs = {
                    dataLayer: {
                        externalId,
                        pageType: 'billing'
                    }
                };
                TagManager.dataLayer(GtmDataLayerCheckoutArgs);
            }
            this.updateStep();
        }
    }

    updateHeader() {
        const { setHeaderState, checkoutStep, goBack } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        setHeaderState({
            name: CHECKOUT,
            title,
            onBackClick: () => goBack()
        });
    }

    updateStep() {
        const { checkoutStep, history } = this.props;
        const { url } = this.stepMap[checkoutStep];

        history.push(`${CHECKOUT_URL}${url}`);
    }

    renderTitle() {
        const { checkoutStep } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        return (
            <h1 block="Checkout" elem="Title">
                {title}
            </h1>
        );
    }

    renderGuestForm() {
        const {
            checkoutStep,
            isCreateUser,
            onEmailChange,
            onCreateUserChange,
            onPasswordChange,
            isGuestEmailSaved
        } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        return (
            <CheckoutGuestForm
                isBilling={isBilling}
                isCreateUser={isCreateUser}
                onEmailChange={onEmailChange}
                onCreateUserChange={onCreateUserChange}
                onPasswordChange={onPasswordChange}
                isGuestEmailSaved={isGuestEmailSaved}
            />
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading,
            locationEnable,
            sourcesName,
            dropdown
        } = this.props;

        return (
            <CheckoutShipping
                locationEnable={locationEnable}
                sourcesName={sourcesName}
                dropdown={dropdown}
                isLoading={isDeliveryOptionsLoading}
                shippingMethods={shippingMethods}
                saveAddressInformation={saveAddressInformation}
                onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
            />
        );
    }

    renderBillingStep() {
        const {
            setLoading,
            setDetailsStep,
            shippingAddress,
            paymentMethods = [],
            savePaymentInformation,
            checkoutTotals,
            checkoutStep,
            paymentTotals,
            pointsAvailable,
            cashbackpercent,
            toggle,
            handleLoyaltyToggle,
            isLoading,
            apistatus
        } = this.props;
        return (
            <CheckoutBilling
                handleLoyaltyToggle={handleLoyaltyToggle}
                setLoading={setLoading}
                paymentMethods={paymentMethods}
                setDetailsStep={setDetailsStep}
                shippingAddress={shippingAddress}
                savePaymentInformation={savePaymentInformation}
                checkoutStep={checkoutStep}
                totals={checkoutTotals}
                paymentTotals={paymentTotals}
                loyalty={{ pointsAvailable, cashbackpercent, isLoading, apistatus }}
                toggle={toggle}
            />
        );
    }

    handleUpdateInput = (e) => {
        this.setState({ orderSmsCode: e.target.value });
    };

    handleApiResponse(result) {
        if (result.data) {
            if (result.data.matchOtp.status) {
                this.setState({
                    openPopup: false
                });
                alert('Your order has been confirmed.');
            }
            else {
                alert('Please enter correct OTP!');

                this.setState({
                    isVerifyBtnDisabled: false,
                    isVerifyBtnText: "Verify"
                });
            }
        }
        else {
            alert('Empty response, please try again!');

            this.setState({
                isVerifyBtnDisabled: false,
                isVerifyBtnText: "Verify"
            });
        }
    }

    handleVerifySms = (e) => {
        const { orderSmsCode, orderId } = this.state;
        e.preventDefault();

        if (orderId && orderSmsCode) {
            if (orderId.match(/^[0-9]*$/) && orderSmsCode.match(/^[0-9]*$/)) {
                this.setState({
                    isVerifyBtnDisabled: true,
                    isVerifyBtnText: "Wait"
                });

                clientAPI.query({
                    query: gql`
                  {
                      matchOtp(id: "${orderId}", sms_code: "${orderSmsCode}") {
                      response
                      status
                  }
                  }
                `
                }).then(result => this.handleApiResponse(result));
            }
            else {
                alert('Please enter only integers!');
            }
        }
        else {
            alert('Please enter your OTP!');
        }
    };

    handleResendApiResponse(result) {
        if (result.data) {
            if (result.data.sendOtp.status) {
                alert('OTP resend successfully.');
            }
            else {
                alert('OTP could not be sent, please contact administrator!');
            }
        }
        else {
            alert('Empty response, please try again!');
        }
    }

    handleResendSms = (e) => {
        const { orderId } = this.state;
        e.preventDefault();

        if (orderId) {
            if (orderId.match(/^[0-9]*$/)) {
                this.setState({ isShowResendBtn: false });

                clientAPI.query({
                    query: gql`
                  {
                      sendOtp(id: "${orderId}") {
                      response
                      status
                  }
                  }
                `
                }).then(result => this.handleResendApiResponse(result));
            }
            else {
                alert('Please enter only integers!');
            }
        }
        else {
            alert('Order ID is missing, please contact administrator!');
        }
    };

    startTimer() {
        if (this.timer == 0 && this.state.timerSeconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.timerSeconds - 1;
        this.setState({
            timerTime: this.secondsToTime(seconds),
            timerSeconds: seconds,
        });

        // Check if we're at zero.
        if (seconds == 0) {
            clearInterval(this.timer);
            this.setState({
                isResendBtnDisabled: false,
                isShowTimer: false
            });
        }
    }

    renderPopup() {
        return <CheckoutTermsAndConditionsPopup />;
    }

    renderTable(data) {
        const { estimated_delivery } = data
        let estimatedDeliveryTimeline = ""
        if (estimated_delivery === "No ETA") {
            estimatedDeliveryTimeline = "No ETA"
        } else if (DateFormat(new Date) === estimated_delivery) {
            estimatedDeliveryTimeline = "12 - 36 hours"
        } else {
            estimatedDeliveryTimeline = getExpectedDate(estimated_delivery)
        }
        return (
            <div block="KeyValueTable" elem="Wrapper">
                {(data.status_label.toLowerCase() !== 'complete') && <table block="KeyValueTable">
                    <tbody>
                        <tr key={'estimated_delivery'}>
                            <td>{'Estimated Delivery'}</td>
                            <th>{estimatedDeliveryTimeline}</th>
                        </tr>
                    </tbody>
                </table>}
                {(data.status_label.toLowerCase() === 'complete') && <table block="KeyValueTable">
                    <tbody>
                        <tr key={'estimated_delivery'}>
                            <td>{'Delivery Date'}</td>
                            <th>{data.delivery_date && DateFormatter.formatDate((new Date(data.delivery_date.replace(/\s/, 'T'))), "D MMM YYYY hh:mm A")}</th>
                        </tr>
                    </tbody>
                </table>}
                <table block="KeyValueTable">
                    <thead>
                        <tr>
                            <th
                                block="KeyValueTable"
                                elem="Heading"
                                colSpan={2}
                            >
                                {'Order Details'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={'order_total'}>
                            <th>{'Order Total'}</th>
                            <td>{data.grand_total}</td>
                        </tr>
                        <tr key={'order_number'}>
                            <th>{'Order Number'}</th>
                            <td>{data.orderID}</td>
                        </tr>
                        <tr key={'delivery_address'}>
                            <th>{'Delivery Address'}</th>
                            {(data.address && data.address.street && data.address.street.length > 0 && typeof (data.address.street) == "object") && <td>{data.address.street[0] ? data.address.street[0] : ''}</td>}
                            {(data.address && data.address.street && typeof (data.address.street) == "string") && <td>{data.address.street}</td>}
                        </tr>
                    </tbody>
                </table>
            </div>

        );
    }
    renderOrderSummaryTable(data) {
        const { order: { base_order_info: { redeempoints, cashback, apistatus } }, cashbackpercent } = this.props;
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
                    <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem">
                        <span block="CheckoutOrderSummary" elem="Text">
                            Subtotal
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            {numberWithCommas(data.sub_total)}
                        </span>
                    </li>
                    {apistatus && <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Loyalty Redeemed
                        </span>
                        <span style={{ color: "#DC6D6D", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            - Rs {numberWithCommas(redeempoints.split(".")[0])}
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
                            {numberWithCommas(data.grand_total)}
                        </span>
                    </li>

                    <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span style={{ textAlign: "left" }} block="CheckoutOrderSummary" elem="Text">
                            <p>Loyalty Credit {cashbackpercent}%</p>
                            <span>*Loyalty points earned accumalate once the order is delivered</span>
                        </span>
                        <span style={{ color: "#03a685", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            Rs {numberWithCommas(cashback)}
                        </span>
                    </li>
                </ul>
            </div>
        )
    }
    renderOrderSummaryTablePartial(data, loyaltyData) {
        const { redeempoints, cashback, apistatus, cashbackpercent } = loyaltyData
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
                    <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem">
                        <span block="CheckoutOrderSummary" elem="Text">
                            Subtotal
                        </span>
                        <span block="CheckoutOrderSummary" elem="Text">
                            {numberWithCommas(data.sub_total)}
                        </span>
                    </li>
                    {apistatus && <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span block="CheckoutOrderSummary" elem="Text">
                            Loyalty Redeemed
                        </span>
                        <span style={{ color: "#DC6D6D", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            - Rs {numberWithCommas(redeempoints.split(".")[0])}
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
                            {numberWithCommas(data.grand_total)}
                        </span>
                    </li>

                    <li block="CheckoutOrderSummary" elem="SummaryItem" >
                        <span style={{ textAlign: "left" }} block="CheckoutOrderSummary" elem="Text">
                            <p>Loyalty Credit {cashbackpercent}%</p>
                            <span>*Loyalty points earned accumalate once the order is delivered</span>
                        </span>
                        <span style={{ color: "#03a685", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
                            Rs {numberWithCommas(cashback)}
                        </span>
                    </li>
                </ul>
            </div>
        )
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
                <h4 className="align-left">{__('Items Ordered')}</h4>
                <table className="MyAccountOrderPopup-Products">
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
    renderPartialProducts(order_products) {
        return (
            <div block="MyAccountOrderPopup" elem="ProductsWrapper">
                <h4 className="align-left">{__('Items Ordered')}</h4>
                <table className="MyAccountOrderPopup-Products">
                    <thead>
                        {this.renderItemsHeading()}
                    </thead>
                    <tbody>
                        {this.renderPartialProductItems(order_products)}
                    </tbody>
                </table>
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
    renderPartialProductItems(order_products) {
        const { currency_code } = this.props;
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
    renderDetailsStep() {
        //const { openPopup } = this.state;

        const {
            orderID,
            match: { params: { route, orderid } },
            order,
            TrackingDetail,
            packet_list,
            currency_code,
            objectState
        } = this.props;

        let checkout_success = BrowserDatabase.getItem('checkout_success');
        let userData = BrowserDatabase.getItem('customer');
        if (!userData) {
            userData = { firstname: '' };
        }
        let detail = { orderID: '', grand_total: '', address: {} };

        if (order && order.base_order_info) {
            detail = {
                delivery_date: order.base_order_info.delivery_date,
                status_label: order.base_order_info.status_label,
                orderID: order.base_order_info.increment_id,
                sub_total: `${formatCurrency(currency_code)} ${order.base_order_info.sub_total}`,
                grand_total: `${formatCurrency(currency_code)} ${order.base_order_info.grand_total}`,
                address: order.shipping_info.shipping_address,
                estimated_delivery: order.base_order_info.estimated_delivery
            }
        }
        else if (checkout_success && checkout_success.grand_total) {
            detail = {
                status_label: '',
                orderID: orderID,
                sub_total: `${formatCurrency(currency_code)} ${checkout_success.sub_total}`,
                grand_total: `${formatCurrency(currency_code)} ${checkout_success.grand_total}`,
                address: checkout_success.shipping_address,
                estimated_delivery: (new Date())
            }
        }
        return (
            <>
                <div class="form-wrap-main" block="CheckoutSuccess">
                    {order.base_order_info && <OrderStatusLeopards
                        {...objectState}
                        isStepperVisible={true}
                        order={order}
                        userName={__(userData.firstname.split(' ')[0] + '!').toUpperCase()}
                    />}
                    {(!order.base_order_info || !checkRenderDetails(order.base_order_info.status_label)) && <div className="emptyDiv"> </div>}
                    {(order.base_order_info && checkRenderDetails(order.base_order_info.status_label)) && <div>
                        <div>
                            {this.renderTable(detail)}
                        </div>
                        <div>
                            {this.renderProducts()}
                        </div>
                        <div>
                            {this.renderOrderSummaryTable(detail)}
                        </div>
                        {(order.base_order_info) && <OrderStatusStepper
                            TrackingDetail={TrackingDetail}
                            orderid={orderid}
                            order={order}
                            packet_list={packet_list}
                        />}
                    </div>}
                    <div>
                        {this.renderPromo()}
                    </div>
                </div>
            </>
            /*<div block="CheckoutSuccess">
                <h3>{ __('Your order # is: %s', orderID) }</h3>
                <p>{ __('We`ll email you an order confirmation with details and tracking info.') }</p>
                <div block="CheckoutSuccess" elem="ButtonWrapper">
                    <Link
                    block="Button"
                    mix={ { block: 'CheckoutSuccess', elem: 'ContinueButton' } }
                    to="/"
                    >
                    { __('Continue shopping') }
                    </Link>
                     <Modal open={openPopup} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick={false} showCloseIcon={false} center>
                        <p>
                            <img block="CheckoutSuccess" elem="OtpImage" src={mobileRingGif} alt="Mobile ringing" />
                        </p>
                        <p>{ __('Please enter One-Time Password to verify your order.') }</p>
                        <form block="CheckoutSuccess" elem="OtpForm" onSubmit={ this.handleVerifySms }>
                            <div block="CheckoutSuccess" elem="OtpFields">
                                <div block="CheckoutSuccess" elem="FormControl">
                                    <input onChange={ this.handleUpdateInput } name="orderSmsCode" type="text" inputmode="numeric" id="popup_orderSmsCode" placeholder="6-digit code" autocomplete="one-time-code" pattern="[0-9]*" required/>
                                    <input name="orderId" type="hidden" id="popup_orderId" value={ __('%s', orderID) }/>
                                </div>
                            </div>
                            <div block="CheckoutSuccess" elem="OtpAction">
                                <button block="CheckoutSuccess" elem="OtpBtn" title="Verify" disabled={this.state.isVerifyBtnDisabled}>
                                            { this.state.isVerifyBtnText }
                                </button>
                            </div>
                            <p>{ __('An sms has been sent to you against order #%s', orderID) }</p>
                        </form>
                        <p block="CheckoutSuccess" elem="OtpResend">
                                    { this.state.isShowResendBtn ? <button block="CheckoutSuccess" elem="OtpResendBtn" title="Resend OTP" disabled={this.state.isResendBtnDisabled} onClick={this.handleResendSms}>{ __('Resend OTP') }</button> : null }
                                    { this.state.isShowTimer ? <span block="CheckoutSuccess" elem="OtpResendTimer">{this.state.timerTime.m}:{this.state.timerTime.s}</span> : null }
                        </p>
                    </Modal> 
                </div>
            </div>*/
        );
    }
    renderPartialDetailsStep() {
        const {
            partialOrder,
            TrackingDetail,
            packet_list,
            currency_code,
            objectState
        } = this.props;

        let checkout_success = BrowserDatabase.getItem('checkout_success');
        let userData = BrowserDatabase.getItem('customer');
        if (!userData) {
            userData = { firstname: '' };
        }
        let detail = { orderID: '', grand_total: '', address: {} };

        detail = {
            status_label: '',
            sub_total: `${formatCurrency(currency_code)} ${checkout_success.sub_total}`,
            grand_total: `${formatCurrency(currency_code)} ${checkout_success.grand_total}`,
            address: checkout_success.shipping_address,
            estimated_delivery: (new Date())
        }
        return (
            <>
                {
                    partialOrder.map((order) => {
                        const { base_order_info: { redeempoints, cashback, apistatus, status_label, sub_total, grand_total, increment_id, estimated_delivery }, order_products } = order
                        const { cashbackpercent } = this.props
                        detail.status_label = status_label
                        detail.orderID = increment_id
                        detail.sub_total = sub_total
                        detail.grand_total = grand_total
                        detail.address = order.shipping_info.shipping_address
                        detail.estimated_delivery = estimated_delivery
                        return (
                            <div class="form-wrap-main" block="CheckoutSuccess">
                                {order.base_order_info && <OrderStatusLeopards
                                    {...objectState}
                                    isStepperVisible={true}
                                    order={order}
                                    userName={__(userData.firstname.split(' ')[0] + '!').toUpperCase()}
                                />}
                                {(!order.base_order_info || !checkRenderDetails(status_label)) && <div className="emptyDiv"> </div>}
                                {(order.base_order_info && checkRenderDetails(status_label)) && <div>
                                    <div>
                                        {this.renderTable(detail)}
                                    </div>
                                    <div>
                                        {this.renderPartialProducts(order_products)}
                                    </div>
                                    <div>
                                        {this.renderOrderSummaryTablePartial(detail, { redeempoints, cashback, apistatus, cashbackpercent })}
                                    </div>
                                    {(order.base_order_info) && <OrderStatusStepper
                                        TrackingDetail={TrackingDetail}
                                        orderid={increment_id}
                                        order={order}
                                        packet_list={packet_list}
                                    />}
                                </div>}
                                <div>
                                    {this.renderPromo()}
                                </div>
                            </div>
                        )
                    })
                }
            </>
        );
    }
    renderStep() {
        const { checkoutStep } = this.props;
        const { render } = this.stepMap[checkoutStep];
        if (render) {
            return render();
        }

        return null;
    }

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={isLoading} />;
    }

    renderSummary() {
        const { checkoutTotals, checkoutStep, paymentTotals, pointsAvailable, cashbackpercent, toggle } = this.props;

        const { areTotalsVisible } = this.stepMap[checkoutStep];

        if (!areTotalsVisible) {
            return null;
        }

        return (
            <CheckoutOrderSummary
                checkoutStep={checkoutStep}
                totals={checkoutTotals}
                paymentTotals={paymentTotals}
                loyalty={{ pointsAvailable, cashbackpercent }}
                toggle={toggle}
            />
        );
    }

    renderPromo() {
        const { checkoutStep } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        const {
            checkout_content: {
                [isBilling ? 'checkout_billing_cms' : 'checkout_shipping_cms']: promo
            } = {}
        } = window.contentConfiguration;

        if (!promo) {
            return null;
        }

        return <CmsBlock identifier={promo} />;
    }

    // popup() {
    //     return <div style={{ backgroundColor: 'lightgrey', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    //         <h1>hello world</h1>
    //         <button onClick={() => this.setState({ ...this.state, locationPopup: true })}>Click for on the location</button>
    //     </div>
    // }

    render() {
        const { checkoutStep } = this.props;
        // if (this.state.locationPopup) {

        

        return (
            <main block="Checkout">
                {!this.props.locationState ? (
                    <div style={{ position: "absolute", backgroundColor: 'lightgrey', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1>hello world</h1>
                        <button onClick={() => this.props.onLocationPopup()}>Click for on the location</button>
                    </div>) : (
                    <ContentWrapper
                        wrapperMix={{ block: 'Checkout', elem: `${(checkoutStep !== DETAILS_STEP && checkoutStep !== ORDER_STATUS) ? 'Wrapper' : 'WrapperCenter'}` }}
                        label={__('Checkout page')}
                    >
                        <div block="Checkout" elem="Step">
                            {this.renderTitle()}
                            {this.renderGuestForm()}
                            {this.renderStep()}
                            {this.renderLoader()}
                        </div>
                        <div>
                            {this.renderSummary()}
                        </div>
                    </ContentWrapper>
                )}
            </main>
        );
        // }

        // return <div style={{ backgroundColor: 'lightgrey', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        //     <h1>hello world</h1>
        //     <button onClick={() => this.setState({ ...this.state, locationPopup: true })}>Click for on the location</button>
        // </div>
    }
}

export default Checkout;
