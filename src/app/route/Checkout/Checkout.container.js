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

import { orderType } from 'Type/Account';
import OrderQuery from 'Query/Order.query';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getExpectedDate } from 'Util/Order';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { manageLocation } from 'Store/Location/Location.action';
import { CART_TAB } from 'Component/NavigationTabs/NavigationTabs.config';
import CheckoutQuery from 'Query/Checkout.query';
import { _getLoyaltyPoints, _getCustomerLoyaltyPoints } from 'Query/Loyalty.query';
import { _getSources, _getSourcesWithoutLatLng } from "Query/Sources.query"
import { _getPartialOrder } from "Query/PartialOrder.query"
import MyAccountQuery from 'Query/MyAccount.query';
import { toggleBreadcrumbs } from 'Store/Breadcrumbs/Breadcrumbs.action';
import { GUEST_QUOTE_ID } from 'Store/Cart/Cart.dispatcher';
import { updateMeta } from 'Store/Meta/Meta.action';
import { BOTTOM_NAVIGATION_TYPE, TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { customerType } from 'Type/Account';
import { HistoryType } from 'Type/Common';
import { TotalsType } from 'Type/MiniCart';
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import history from 'Util/History';
import { fetchMutation, fetchQuery } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';
import { manageLoyaltyToggle } from "../../store/LoyaltyToggle/Loyalty.action"

import Checkout from './Checkout.component';
import {
    BILLING_STEP, DETAILS_STEP, PAYMENT_TOTALS, SHIPPING_STEP, STRIPE_AUTH_REQUIRED, ORDER_STATUS
} from './Checkout.config';

import isMobile from 'Util/Mobile';
import { data } from 'autoprefixer';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);
export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);
export const CUSTOMER = 'customer';

export const mapStateToProps = (state) => ({
    currency_code: state.ConfigReducer.default_display_currency_code,
    order: state.OrderReducer.order,
    totals: state.CartReducer.cartTotals,
    customer: state.MyAccountReducer.customer,
    guest_checkout: state.ConfigReducer.guest_checkout,
    countries: state.ConfigReducer.countries,
    toggle: state.LoyaltyReducer.toggle,
    location: state.LocationReducer.coords
});

export const mapDispatchToProps = (dispatch) => ({
    //changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    resetCart: () => CartDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch)),
    toggleBreadcrumbs: (state) => dispatch(toggleBreadcrumbs(state)),
    showErrorNotification: (message) => dispatch(showNotification('error', message)),
    showInfoNotification: (message) => dispatch(showNotification('info', message)),
    setHeaderState: (stateName) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    setNavigationState: (stateName) => dispatch(changeNavigationState(BOTTOM_NAVIGATION_TYPE, stateName)),
    createAccount: (options) => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.createAccount(options, dispatch)
    ),
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    ),
    updateToggle: (toggle) => dispatch(manageLoyaltyToggle(toggle)),
    updateLocation: (coords) => dispatch(manageLocation(coords))
});

export class CheckoutContainer extends PureComponent {
    static propTypes = {
        //changeHeaderState: PropTypes.func.isRequired,
        requestCustomerData: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        showInfoNotification: PropTypes.func.isRequired,
        toggleBreadcrumbs: PropTypes.func.isRequired,
        setNavigationState: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        resetCart: PropTypes.func.isRequired,
        guest_checkout: PropTypes.bool.isRequired,
        totals: TotalsType.isRequired,
        history: HistoryType.isRequired,
        customer: customerType.isRequired,
        payload: PropTypes.shape({
            order: orderType
        }).isRequired,
        countries: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                id: PropTypes.string,
                available_regions: PropTypes.arrayOf(
                    PropTypes.shape({
                        code: PropTypes.string,
                        name: PropTypes.string,
                        id: PropTypes.number
                    })
                )
            })
        ).isRequired,
        currency_code: PropTypes.string.isRequired,

    };

    containerFunctions = {
        setLoading: this.setLoading.bind(this),
        setDetailsStep: this.setDetailsStep.bind(this),
        savePaymentInformation: this.savePaymentInformation.bind(this),
        saveAddressInformation: this.saveAddressInformation.bind(this),
        onShippingEstimationFieldsChange: this.onShippingEstimationFieldsChange.bind(this),
        onEmailChange: this.onEmailChange.bind(this),
        onCreateUserChange: this.onCreateUserChange.bind(this),
        onPasswordChange: this.onPasswordChange.bind(this),
        goBack: this.goBack.bind(this),
        handleLoyaltyToggle: this.handleLoyaltyToggle.bind(this)
    };

    constructor(props) {
        super(props);

        const {
            toggleBreadcrumbs,
            totals: {
                is_virtual
            },
            location: { objectState }
        } = props;

        toggleBreadcrumbs(false);
        const q_param = this.getStateParam();
        this.state = {
            objectState,
            packet_list: {},
            TrackingDetail: [],
            order: {},
            isLoading: is_virtual,
            isDeliveryOptionsLoading: false,
            requestsSent: 0,
            paymentMethods: [],
            shippingMethods: [],
            shippingAddress: {},
            checkoutStep: (is_virtual && q_param != 'status' ? BILLING_STEP : q_param == 'status' ? ORDER_STATUS : SHIPPING_STEP),
            //checkoutStep: DETAILS_STEP,
            orderID: '',
            orderSms: '',
            paymentTotals: BrowserDatabase.getItem(PAYMENT_TOTALS) || {},
            email: '',
            isCreateUser: false,
            isGuestEmailSaved: false,
            redeempoints: 0,
            cashback: 0,
            pointsAvailable: 0,
            cashbackpercent: 0,
            isLoading: true,
            apistatus: false,
            locationEnable: false,
            sourcesName: [],
            estimated_delivery: null,
            shipping_description: null,
            sourcesCount: 1,
            dropdown: false,
            locationState: false,
            changeUpdateSources: false,
            customerAddress: '',
            myData: '',
            iDontWantFastDelievery: false,
            latlng: false,
            latlngState: false,
            status: ''

        };

        if (is_virtual) {
            this._getPaymentMethods();
        }
    }
    getStateParam() {
        const { match: { params: { route, orderid } } } = this.props;
        return route;
    }
    callOneSignal(order_id) {
        //const { match: { params: { orderid } } } = this.props;
        let user = BrowserDatabase.getItem('customer');
        if (order_id && user.customer_id) {
            fetch(`${window.location.origin}/onesignal?CustomerId=${user.customer_id}&OrderId=${order_id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        //window.location.href = `${result.page_url}${result.Data.SESSION_ID}`;
                    },
                    this._handleError
                )
        }

    }
    componentDidMount() {
        const {
            setNavigationState,
            history,
            showInfoNotification,
            guest_checkout,
            updateMeta,
            totals: {
                items = []
            },
            match: { params: { route, orderid } },

        } = this.props;
        updateMeta({ title: __('Checkout') });
        if (route && route.indexOf('status') > -1) {
            this.setState({ isLoading: true });
            this.requestOrderDetails(orderid);
            updateMeta({ title: __('Order Tracking') });
        }
        // if (!items.length && !route) {
        //     showInfoNotification(__('Please add at least one product to cart!'));
        //     history.push('/cart');
        // }

        // if guest checkout is disabled and user is not logged in => throw him to homepage
        if (!isSignedIn()) {
            //history.push('/');
            showInfoNotification(__('Please sign-in to complete checkout!'));
            if (isMobile.any()) {
                history.push('/my-account');
            } else {
                history.push('/cart');
            }
        }
        this.getLoyaltyPoints(orderid)
        this.getLoyaltyPointsAndCashback()
        // this.onShippingEstimationFieldsChange({
        //     country_id: "PK",
        //     region_id: 0,
        //     region: "",
        //     city: false,
        //     postcode: ""
        // })
        //updateMeta({ title: __('Checkout') });

        changeNavigationState({
            title: __('Order Tracking'),
        });
    }
    getLoyaltyPoints = async (orderid) => {
        if (orderid) {
            try {
                const res = await _getLoyaltyPoints(orderid);
                const { data: { getRedeemedPoints: { redeempoints, cashback } } } = JSON.parse(res)
                this.setState({
                    redeempoints,
                    cashback
                })
            } catch (error) {
                console.log(error, "checkout")
            }
        }
    }
    getLoyaltyPointsAndCashback = async () => {
        try {
            const { data } = JSON.parse(localStorage.getItem("auth_token"))
            if (!data) {
                this.setState({
                    isLoading: false
                })
            }
            const response = await _getCustomerLoyaltyPoints(data)
            const { getCustomeLoyaltyPoints: { pointsAvailable = 0, cashbackpercent = 5, apistatus = false } } = JSON.parse(response).data;
            this.setState({
                pointsAvailable, cashbackpercent, isLoading: false, apistatus
            })
        } catch (error) {
            this.setState({
                pointsAvailable: 0, cashbackpercent: 5, isLoading: false, apistatus: false
            })
        }
    }

    handleLoyaltyToggle(loyaltyToggle) {
        localStorage.setItem('toggle', JSON.stringify({ toggle: loyaltyToggle }))
        this.props.updateToggle(loyaltyToggle)
    }
    componentWillUnmount() {
        const { toggleBreadcrumbs } = this.props;
        toggleBreadcrumbs(true);
    }

    onEmailChange(email) {
        this.setState({ email });
    }

    onCreateUserChange() {
        const { isCreateUser } = this.state;
        this.setState({ isCreateUser: !isCreateUser });
    }

    onPasswordChange(password) {
        this.setState({ password });
    }

    onLocationHandler() {
        this.setState({ locationState: true })
    }
    withoutLocation() {
        this.setState({ iDontWantFastDelievery: true })
    }
    onShippingEstimationFieldsChange(address) {
        console.log("call in")
        const { requestsSent } = this.state;
        const { showErrorNotification } = this.props
        const customer = JSON.parse(localStorage.getItem('customer')) || {};
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            if (navigator.permissions && navigator.permissions.query) {

                navigator.permissions && navigator.permissions.query({ name: 'geolocation' })
                    .then((PermissionStatus) => {
                        if (PermissionStatus.state == 'granted') {
                            //allowed
                            // alert('allowed')
                            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                                this.props.updateLocation(coords)
                                const lat = coords.latitude
                                const lng = coords.longitude
                                let sourceData
                                if (customer.data) {
                                    if (customer.data.quoteid) {
                                        sourceData = await _getSources({
                                            city: address.city ? address.city : customer?.data?.city,
                                            lat,
                                            lng,
                                            quoteid: customer?.data?.quoteid
                                        })
                                    } else {
                                        await this.props.requestCustomerData()
                                        const { quoteid } = BrowserDatabase.getItem(CUSTOMER)
                                        sourceData = await _getSources({
                                            city: address.city ? address.city : customer?.data?.city,
                                            lat,
                                            lng,
                                            quoteid: quoteid
                                        })
                                    }
                                    const { data } = JSON.parse(sourceData)

                                    if (!data.getIdentifiedSources) {
                                        showErrorNotification(__('This Item Is Out of Stock!'));
                                        this.setState({
                                            isLoading: false
                                        });
                                        return
                                    }
                                    this.setState({
                                        isLoading: true,
                                        isDeliveryOptionsLoading: true,
                                        requestsSent: requestsSent + 1,
                                    });
                                    const cloneAddress = { ...address }
                                    const sourcesCount = [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))].length;
                                    cloneAddress.city = address.city ? address.city : customer?.data?.city
                                    fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                                        cloneAddress,
                                        data.getIdentifiedSources.items,
                                        data.getIdentifiedSources.samecity,
                                        data.getIdentifiedSources.zex_toggle,
                                        this._getGuestCartId()
                                    )).then(
                                        ({ estimateShippingCosts: shippingMethods }) => {
                                            const { requestsSent } = this.state;

                                            this.setState({
                                                isLoading: false,
                                                sourcesCount,
                                                sourcesName: [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))],
                                                shippingMethods,
                                                isDeliveryOptionsLoading: requestsSent > 1,
                                                requestsSent: requestsSent - 1,
                                                locationEnable: true,
                                                customerAddress: cloneAddress,
                                                myData: data
                                            });
                                        },
                                        this._handleError
                                    );
                                }
                            }, async () => {
                                let sourceData;

                                if (customer.data) {

                                    if (customer?.data?.quoteid) {

                                        sourceData = await _getSourcesWithoutLatLng({
                                            city: address.city ? address.city : customer?.data?.city,
                                            quoteid: customer?.data?.quoteid
                                        })


                                    } else {

                                        await this.props.requestCustomerData()
                                        const { quoteid } = BrowserDatabase.getItem(CUSTOMER)

                                        sourceData = await _getSourcesWithoutLatLng({
                                            city: address.city ? address.city : customer?.data?.city,
                                            quoteid: quoteid
                                        })
                                        // 

                                    }
                                    const { data } = JSON.parse(sourceData);

                                    if (!data.getSourceList) {
                                        showErrorNotification(__('This Item Is Out of Stock!'));
                                        this.setState({
                                            locationEnable: false,
                                            isLoading: false
                                        })
                                        return
                                    }

                                    this.setState({
                                        isLoading: true,
                                        isDeliveryOptionsLoading: true,
                                        requestsSent: requestsSent + 1,
                                    });

                                    const cloneAddress = { ...address }

                                    const sourcesCount = [...new Set(JSON.parse(data.getSourceList.sourcename))].length;

                                    cloneAddress.city = address.city ? address.city : customer?.data?.city

                                    fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                                        cloneAddress,
                                        data.getSourceList.items,
                                        data.getSourceList.samecity,
                                        data.getSourceList.zex_toggle,
                                        this._getGuestCartId()
                                    )).then(
                                        ({ estimateShippingCosts: shippingMethods }) => {
                                            const { requestsSent } = this.state;

                                            this.setState({
                                                isLoading: false,
                                                sourcesCount,
                                                dropdown: data?.getSourceList?.dropdown,
                                                sourcesName: [...new Set(JSON.parse(data.getSourceList.sourcename))],
                                                shippingMethods,
                                                isDeliveryOptionsLoading: requestsSent > 1,
                                                requestsSent: requestsSent - 1,
                                                locationEnable: false,
                                                customerAddress: cloneAddress,

                                                myData: data
                                            });
                                        },
                                        this._handleError
                                    );
                                }

                                // this.setState({
                                //     locationEnable: false,
                                //     isLoading: false
                                // })
                            })
                        } else if (PermissionStatus.state == 'prompt') {
                            // prompt - not yet grated or denied
                            // alert('not yet grated or denied')

                            if (this.state.iDontWantFastDelievery) {
                                (async () => {
                                    let sourceData;

                                    if (customer.data) {
                                        if (customer?.data?.quoteid) {
                                            sourceData = await _getSourcesWithoutLatLng({
                                                city: address.city ? address.city : customer?.data?.city,
                                                quoteid: customer?.data?.quoteid
                                            })
                                        } else {
                                            await this.props.requestCustomerData()
                                            const { quoteid } = BrowserDatabase.getItem(CUSTOMER)
                                            sourceData = await _getSourcesWithoutLatLng({
                                                city: address.city ? address.city : customer?.data?.city,
                                                quoteid: quoteid
                                            })
                                        }

                                        const { data } = JSON.parse(sourceData);

                                        if (!data.getSourceList) {

                                            showErrorNotification(__('This Item Is Out of Stock!'));
                                            this.setState({
                                                locationEnable: false,
                                                isLoading: false
                                            })
                                            return
                                        }

                                        this.setState({
                                            isLoading: true,
                                            isDeliveryOptionsLoading: true,
                                            requestsSent: requestsSent + 1,
                                        });

                                        const cloneAddress = { ...address }

                                        const sourcesCount = [...new Set(JSON.parse(data.getSourceList.sourcename))].length;

                                        cloneAddress.city = address.city ? address.city : customer?.data?.city

                                        fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                                            cloneAddress,
                                            data.getSourceList.items,
                                            data.getSourceList.samecity,
                                            data.getSourceList.zex_toggle,
                                            this._getGuestCartId()
                                        )).then(
                                            ({ estimateShippingCosts: shippingMethods }) => {

                                                const { requestsSent } = this.state;
                                                this.setState({
                                                    isLoading: false,
                                                    sourcesCount,
                                                    dropdown: data?.getSourceList?.dropdown,
                                                    sourcesName: [...new Set(JSON.parse(data.getSourceList.sourcename))],
                                                    shippingMethods,
                                                    isDeliveryOptionsLoading: requestsSent > 1,
                                                    requestsSent: requestsSent - 1,
                                                    locationEnable: false,
                                                    customerAddress: cloneAddress,
                                                    myData: data
                                                });
                                            },
                                            this._handleError
                                        );

                                    }
                                })()
                            }

                            if (this.state.locationState) {
                                navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                                    this.props.updateLocation(coords)
                                    const lat = coords.latitude
                                    const lng = coords.longitude
                                    let sourceData
                                    if (customer.data) {
                                        if (customer.data.quoteid) {
                                            sourceData = await _getSources({
                                                city: address.city ? address.city : customer?.data?.city,
                                                lat,
                                                lng,
                                                quoteid: customer?.data?.quoteid
                                            })
                                        } else {
                                            await this.props.requestCustomerData()
                                            const { quoteid } = BrowserDatabase.getItem(CUSTOMER)
                                            sourceData = await _getSources({
                                                city: address.city ? address.city : customer?.data?.city,
                                                lat,
                                                lng,
                                                quoteid: quoteid
                                            })
                                        }
                                        const { data } = JSON.parse(sourceData)

                                        if (!data.getIdentifiedSources) {
                                            showErrorNotification(__('This Item Is Out of Stock!'));
                                            this.setState({
                                                isLoading: false
                                            });
                                            return
                                        }
                                        this.setState({
                                            isLoading: true,
                                            isDeliveryOptionsLoading: true,
                                            requestsSent: requestsSent + 1,
                                        });
                                        const cloneAddress = { ...address }
                                        const sourcesCount = [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))].length;
                                        cloneAddress.city = address.city ? address.city : customer?.data?.city
                                        fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                                            cloneAddress,
                                            data.getIdentifiedSources.items,
                                            data.getIdentifiedSources.samecity,
                                            data.getIdentifiedSources.zex_toggle,
                                            this._getGuestCartId()
                                        )).then(
                                            ({ estimateShippingCosts: shippingMethods }) => {
                                                const { requestsSent } = this.state;

                                                this.setState({
                                                    isLoading: false,
                                                    sourcesCount,
                                                    sourcesName: [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))],
                                                    shippingMethods,
                                                    isDeliveryOptionsLoading: requestsSent > 1,
                                                    requestsSent: requestsSent - 1,
                                                    locationEnable: true,
                                                    customerAddress: cloneAddress,

                                                    myData: data
                                                });
                                            },
                                            this._handleError
                                        );
                                    }
                                }, async () => {
                                    let sourceData;

                                    if (customer.data) {

                                        if (customer?.data?.quoteid) {

                                            sourceData = await _getSourcesWithoutLatLng({
                                                city: address.city ? address.city : customer?.data?.city,
                                                quoteid: customer?.data?.quoteid
                                            })


                                        } else {

                                            await this.props.requestCustomerData()
                                            const { quoteid } = BrowserDatabase.getItem(CUSTOMER)

                                            sourceData = await _getSourcesWithoutLatLng({
                                                city: address.city ? address.city : customer?.data?.city,
                                                quoteid: quoteid
                                            })
                                            // 

                                        }
                                        const { data } = JSON.parse(sourceData);

                                        if (!data.getSourceList) {
                                            showErrorNotification(__('This Item Is Out of Stock!'));
                                            this.setState({
                                                locationEnable: false,
                                                isLoading: false
                                            })
                                            return
                                        }

                                        this.setState({
                                            isLoading: true,
                                            isDeliveryOptionsLoading: true,
                                            requestsSent: requestsSent + 1,
                                        });

                                        const cloneAddress = { ...address }

                                        const sourcesCount = [...new Set(JSON.parse(data.getSourceList.sourcename))].length;

                                        cloneAddress.city = address.city ? address.city : customer?.data?.city

                                        fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                                            cloneAddress,
                                            data.getSourceList.items,
                                            data.getSourceList.samecity,
                                            data.getSourceList.zex_toggle,
                                            this._getGuestCartId()
                                        )).then(
                                            ({ estimateShippingCosts: shippingMethods }) => {
                                                const { requestsSent } = this.state;

                                                this.setState({
                                                    isLoading: false,
                                                    sourcesCount,
                                                    dropdown: data?.getSourceList?.dropdown,
                                                    sourcesName: [...new Set(JSON.parse(data.getSourceList.sourcename))],
                                                    shippingMethods,
                                                    isDeliveryOptionsLoading: requestsSent > 1,
                                                    requestsSent: requestsSent - 1,
                                                    locationEnable: false,
                                                    customerAddress: cloneAddress,
                                                    myData: data
                                                });
                                            },
                                            this._handleError
                                        );
                                    }

                                    // this.setState({
                                    //     locationEnable: false,
                                    //     isLoading: false
                                    // })
                                })
                            }
                        } else {
                            //denied
                            // alert('denied')


                            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                                this.props.updateLocation(coords)
                                const lat = coords.latitude
                                const lng = coords.longitude
                                let sourceData
                                if (customer.data) {
                                    if (customer.data.quoteid) {
                                        sourceData = await _getSources({
                                            city: address.city ? address.city : customer?.data?.city,
                                            lat,
                                            lng,
                                            quoteid: customer?.data?.quoteid
                                        })
                                    } else {
                                        await this.props.requestCustomerData()
                                        const { quoteid } = BrowserDatabase.getItem(CUSTOMER)
                                        sourceData = await _getSources({
                                            city: address.city ? address.city : customer?.data?.city,
                                            lat,
                                            lng,
                                            quoteid: quoteid
                                        })
                                    }
                                    const { data } = JSON.parse(sourceData)

                                    if (!data.getIdentifiedSources) {
                                        showErrorNotification(__('This Item Is Out of Stock!'));
                                        this.setState({
                                            isLoading: false
                                        });
                                        return
                                    }
                                    this.setState({
                                        isLoading: true,
                                        isDeliveryOptionsLoading: true,
                                        requestsSent: requestsSent + 1,
                                    });
                                    const cloneAddress = { ...address }
                                    const sourcesCount = [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))].length;
                                    cloneAddress.city = address.city ? address.city : customer?.data?.city
                                    fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                                        cloneAddress,
                                        data.getIdentifiedSources.items,
                                        data.getIdentifiedSources.samecity,
                                        data.getIdentifiedSources.zex_toggle,
                                        this._getGuestCartId()
                                    )).then(
                                        ({ estimateShippingCosts: shippingMethods }) => {
                                            const { requestsSent } = this.state;

                                            this.setState({
                                                isLoading: false,
                                                sourcesCount,
                                                sourcesName: [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))],
                                                shippingMethods,
                                                isDeliveryOptionsLoading: requestsSent > 1,
                                                requestsSent: requestsSent - 1,
                                                locationEnable: true,
                                                customerAddress: cloneAddress,

                                                myData: data
                                            });
                                        },
                                        this._handleError
                                    );
                                }
                            }, async () => {
                                let sourceData;
                                if (customer.data) {
                                    if (customer?.data?.quoteid) {
                                        sourceData = await _getSourcesWithoutLatLng({
                                            city: address.city ? address.city : customer?.data?.city,
                                            quoteid: customer?.data?.quoteid
                                        })
                                    } else {
                                        await this.props.requestCustomerData()
                                        const { quoteid } = BrowserDatabase.getItem(CUSTOMER)
                                        sourceData = await _getSourcesWithoutLatLng({
                                            city: address.city ? address.city : customer?.data?.city,
                                            quoteid: quoteid
                                        })
                                    }
                                    const { data } = JSON.parse(sourceData);
                                    if (!data.getSourceList) {
                                        showErrorNotification(__('This Item Is Out of Stock!'));
                                        this.setState({
                                            locationEnable: false,
                                            isLoading: false
                                        })
                                        return
                                    }
                                    this.setState({
                                        isLoading: true,
                                        isDeliveryOptionsLoading: true,
                                        requestsSent: requestsSent + 1,
                                    });
                                    const cloneAddress = { ...address }
                                    const sourcesCount = [...new Set(JSON.parse(data.getSourceList.sourcename))].length;
                                    cloneAddress.city = address.city ? address.city : customer?.data?.city
                                    fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                                        cloneAddress,
                                        data.getSourceList.items,
                                        data.getSourceList.samecity,
                                        data.getSourceList.zex_toggle,
                                        this._getGuestCartId()
                                    )).then(
                                        ({ estimateShippingCosts: shippingMethods }) => {
                                            const { requestsSent } = this.state;
                                            this.setState({
                                                isLoading: false,
                                                sourcesCount,
                                                dropdown: data?.getSourceList?.dropdown,
                                                sourcesName: [...new Set(JSON.parse(data.getSourceList.sourcename))],
                                                shippingMethods,
                                                isDeliveryOptionsLoading: requestsSent > 1,
                                                requestsSent: requestsSent - 1,
                                                locationEnable: false,
                                                customerAddress: cloneAddress,
                                                myData: data
                                            });
                                        },
                                        this._handleError
                                    );
                                }
                            })
                        }
                    })

            } else {
                // start end

                navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                    this.props.updateLocation(coords)
                    const lat = coords.latitude
                    const lng = coords.longitude
                    let sourceData
                    if (customer.data) {
                        if (customer.data.quoteid) {
                            sourceData = await _getSources({
                                city: address.city ? address.city : customer?.data?.city,
                                lat,
                                lng,
                                quoteid: customer?.data?.quoteid
                            })
                        } else {
                            await this.props.requestCustomerData()
                            const { quoteid } = BrowserDatabase.getItem(CUSTOMER)
                            sourceData = await _getSources({
                                city: address.city ? address.city : customer?.data?.city,
                                lat,
                                lng,
                                quoteid: quoteid
                            })
                        }
                        const { data } = JSON.parse(sourceData)

                        if (!data.getIdentifiedSources) {
                            showErrorNotification(__('This Item Is Out of Stock!'));
                            this.setState({
                                isLoading: false
                            });
                            return
                        }
                        this.setState({
                            isLoading: true,
                            isDeliveryOptionsLoading: true,
                            requestsSent: requestsSent + 1,
                        });
                        const cloneAddress = { ...address }
                        const sourcesCount = [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))].length;
                        cloneAddress.city = address.city ? address.city : customer?.data?.city
                        fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                            cloneAddress,
                            data.getIdentifiedSources.items,
                            data.getIdentifiedSources.samecity,
                            data.getIdentifiedSources.zex_toggle,
                            this._getGuestCartId()
                        )).then(
                            ({ estimateShippingCosts: shippingMethods }) => {
                                const { requestsSent } = this.state;

                                this.setState({
                                    isLoading: false,
                                    sourcesCount,
                                    sourcesName: [...new Set(JSON.parse(data.getIdentifiedSources.sourcename))],
                                    shippingMethods,
                                    isDeliveryOptionsLoading: requestsSent > 1,
                                    requestsSent: requestsSent - 1,
                                    locationEnable: true,
                                    customerAddress: cloneAddress,

                                    myData: data
                                });
                            },
                            this._handleError
                        );
                    }
                }, async () => {
                    let sourceData;
                    if (customer.data) {
                        if (customer?.data?.quoteid) {
                            sourceData = await _getSourcesWithoutLatLng({
                                city: address.city ? address.city : customer?.data?.city,
                                quoteid: customer?.data?.quoteid
                            })
                        } else {
                            await this.props.requestCustomerData()
                            const { quoteid } = BrowserDatabase.getItem(CUSTOMER)
                            sourceData = await _getSourcesWithoutLatLng({
                                city: address.city ? address.city : customer?.data?.city,
                                quoteid: quoteid
                            })
                        }
                        const { data } = JSON.parse(sourceData);
                        if (!data.getSourceList) {
                            showErrorNotification(__('This Item Is Out of Stock!'));
                            this.setState({
                                locationEnable: false,
                                isLoading: false
                            })
                            return
                        }
                        this.setState({
                            isLoading: true,
                            isDeliveryOptionsLoading: true,
                            requestsSent: requestsSent + 1,
                        });
                        const cloneAddress = { ...address }
                        const sourcesCount = [...new Set(JSON.parse(data.getSourceList.sourcename))].length;
                        cloneAddress.city = address.city ? address.city : customer?.data?.city
                        fetchMutation(CheckoutQuery.getEstimateShippingCosts(
                            cloneAddress,
                            data.getSourceList.items,
                            data.getSourceList.samecity,
                            data.getSourceList.zex_toggle,
                            this._getGuestCartId()
                        )).then(
                            ({ estimateShippingCosts: shippingMethods }) => {
                                const { requestsSent } = this.state;
                                this.setState({
                                    isLoading: false,
                                    sourcesCount,
                                    dropdown: data?.getSourceList?.dropdown,
                                    sourcesName: [...new Set(JSON.parse(data.getSourceList.sourcename))],
                                    shippingMethods,
                                    isDeliveryOptionsLoading: requestsSent > 1,
                                    requestsSent: requestsSent - 1,
                                    locationEnable: false,
                                    customerAddress: cloneAddress,
                                    myData: data
                                });
                            },
                            this._handleError
                        );
                    }
                })
                // end
            }
        }
        // end
    }

    updateSourcesHandler = async (value) => {
        // alert(value.toString())
        console.log('value......................1', value);
        const customer = JSON.parse(localStorage.getItem('customer')) || {};
        console.log('value......................2', value);
        console.log('hello world', value);

        console.log('qouteid', customer?.data?.quoteid);
        const qouteid = customer?.data?.quoteid
        await fetchMutation(CheckoutQuery.updateSources(
            value,
            qouteid,
            this._getGuestCartId()
        )).then((result) => {
            console.log(result.updateSources.result)
            // alert(result.updateSources.result)

            // if (result.updateSources.result) {
            //     fetchMutation(CheckoutQuery.getEstimateShippingCosts(
            //         this.state.customerAddress,
            //         this.myData.getSourceList.items,
            //         this.myData.getSourceList.samecity,
            //         this.myData.getSourceList.zex_toggle,
            //         this._getGuestCartId()
            //     )).then(
            //         ({ estimateShippingCosts: shippingMethods }) => {
            //             const { requestsSent } = this.state;
            //             this.setState({
            //                 isLoading: false,
            //                 sourcesCount,
            //                 dropdown: this.myData?.getSourceList?.dropdown,
            //                 sourcesName: [...new Set(JSON.parse(this.myData.getSourceList.sourcename))],
            //                 shippingMethods,
            //                 isDeliveryOptionsLoading: requestsSent > 1,
            //                 requestsSent: requestsSent - 1,
            //                 locationEnable: false,
            //             });
            //         },
            //         this._handleError
            //     );
            // }
        }
            // ({ estimateShippingCosts: shippingMethods }) => {
            //     const { requestsSent } = this.state;
            //     console.log('then......', requestsSent);
            //     this.setState({
            //         isLoading: false,
            //         sourcesCount,
            //         dropdown: data?.getSourceList?.dropdown,
            //         sourcesName: [...new Set(JSON.parse(data.getSourceList.sourcename))],
            //         shippingMethods,
            //         isDeliveryOptionsLoading: requestsSent > 1,
            //         requestsSent: requestsSent - 1,
            //         locationEnable: false,
            //     });
            // },
            // this._handleError
        );
    }

    goBack() {
        const { checkoutStep } = this.state;

        if (checkoutStep === BILLING_STEP) {
            this.setState({
                isLoading: false,
                checkoutStep: SHIPPING_STEP
            });

            BrowserDatabase.setItem(BrowserDatabase.getItem(PAYMENT_TOTALS), 'checkout_success', 3600)
            BrowserDatabase.deleteItem(PAYMENT_TOTALS);
        }

        history.goBack();
    }

    setDetailsStep(orderID, orderSms, paymentMethodCode, orderData, estimated_delivery, shipping_description) {
        const { resetCart, setNavigationState } = this.props;

        // For some reason not logged in user cart preserves qty in it
        if (!isSignedIn()) {
            BrowserDatabase.deleteItem(GUEST_QUOTE_ID);
        }
        BrowserDatabase.setItem(BrowserDatabase.getItem(PAYMENT_TOTALS), 'checkout_success', 3600)
        // BrowserDatabase.deleteItem(PAYMENT_TOTALS);
        resetCart();


        // setNavigationState({
        //     name: CART_TAB
        // });
        if (paymentMethodCode == "hbl_pay") {
            fetch(`${window.location.origin}/customcheckout/CustomPayment/index`)
                .then(res => res.json())
                .then(
                    (result) => {

                        window.location.href = `${result.page_url}${result.Data.SESSION_ID}`;
                    },
                    this._handleError
                )
        }
        else {
            this.setState({
                isLoading: false,
                paymentTotals: {},
                estimated_delivery,
                shipping_description,
                checkoutStep: DETAILS_STEP,
                orderID,
                orderSms
            });
            setNavigationState({
                name: CART_TAB
            });
        }
    }

    setLoading(isLoading = true) {
        this.setState({ isLoading });
    }

    setShippingAddress = async () => {
        const { shippingAddress } = this.state;

        const shippingAddressFields = shippingAddress;
        const defaultAddressFields = { "default_billing": true, "default_shipping": true };
        const shippingAddressObj = { ...defaultAddressFields, ...shippingAddressFields };

        const { region, region_id, ...address } = shippingAddressObj;

        const mutation = MyAccountQuery.getCreateAddressMutation({
            ...address, region: { region, region_id }
        });

        await fetchMutation(mutation);

        return true;
    };
    requestTrackingDetails(OrderId) {
        var requestOptions = { method: 'GET' };
        fetch(`${window.location.origin}/trackingdetails?OrderId=${OrderId}`, requestOptions)
            .then(response => response.text())
            .then(result => {

                let data = JSON.parse(result);
                console.log(data);
                this.setState({ packet_list: data.packet_list[0] });
                this.setState({ TrackingDetail: data.packet_list[0]["Tracking Detail"] });
                this.setState({ isLoading: false });
            }).catch(error => { this.setState({ isLoading: false }); });
    }

    requestOrderDetails(order_id) {
        return fetchQuery(OrderQuery.getOrderByIdQuery(parseInt(order_id))).then(
            (resOrder) => {
                let { getOrderById } = resOrder;
                //let totalQuantity = getOrderById.order_products.reduce(function (acc, val) { return acc + val.qty; }, 0)
                // let user = BrowserDatabase.getItem('customer');
                // let dataLayerObj = window.dataLayer.find(x => x.event == 'Purchase');
                // let dataLayerObject = {
                //     name: user.firstname,
                //     order_amount: getOrderById.base_order_info.grand_total,
                //     qty: totalQuantity,
                //     courier: getOrderById.payment_info.method,
                //     est_delivery: getExpectedDate(getOrderById.base_order_info.created_at),
                //     orderuid: getOrderById.base_order_info.id
                // }
                // dataLayerObj.name= user.firstname;
                // dataLayerObj.courier = 'Leopards';
                // dataLayerObj.est_delivery = getExpectedDate(getOrderById.base_order_info.created_at);

                this.requestTrackingDetails(getOrderById.base_order_info.increment_id);

                this.callOneSignal(getOrderById.base_order_info.id);
                //this.requestTrackingDetails('7001016969');
                let orders = BrowserDatabase.getItem('orders');
                if (orders && (orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id) > -1)) {
                    let indexOfOrder = orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id);
                    getOrderById.base_order_info.delivery_date = orders[indexOfOrder].base_order_info.delivery_date;
                }
                this.setState({ order: getOrderById });
                return getOrderById
            },
            (err) => {
                this.setState({ isLoading: false });
                showNotification('error', __('Error getting Order by ID!'));
            }
        );
    }

    async requestPartialOrderDetails(orderId) {
        try {
            const mapOrderId = orderId.map((id) => parseInt(id))
            const { data } = JSON.parse(localStorage.getItem("auth_token"))
            const partialOrderResponse = await _getPartialOrder(JSON.stringify(mapOrderId), data)
            const items = JSON.parse(partialOrderResponse)?.data?.getPartialOrderById?.items
            items.forEach(getOrderById => {
                this.requestTrackingDetails(getOrderById.base_order_info.increment_id);

                this.callOneSignal(getOrderById.base_order_info.id);
                //this.requestTrackingDetails('7001016969');
                let orders = BrowserDatabase.getItem('orders');
                if (orders && (orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id) > -1)) {
                    let indexOfOrder = orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id);
                    getOrderById.base_order_info.delivery_date = orders[indexOfOrder].base_order_info.delivery_date;
                }
            });
            this.setState({ partialOrder: items });
            return items
        } catch (error) {
            this.setState({ isLoading: false });
            showNotification('error', __('Error getting Order by ID!'));
        }
    }

    containerProps = () => {
        const { paymentTotals } = this.state;
        const { currency_code } = this.props;
        return {
            currency_code,
            checkoutTotals: this._getCheckoutTotals(),
            paymentTotals
        };
    };

    _handleError = (error) => {
        const { showErrorNotification } = this.props;
        const [{ message, debugMessage }] = error;

        this.setState({
            isDeliveryOptionsLoading: false,
            isLoading: false
        }, () => {
            showErrorNotification(debugMessage || message);
        });

        return false;
    };

    _handlePaymentError = (error, paymentInformation) => {
        const [{ debugMessage: message = '' }] = error;
        const { paymentMethod: { handleAuthorization } } = paymentInformation;

        if (handleAuthorization && message.startsWith(STRIPE_AUTH_REQUIRED)) {
            const secret = message.substring(STRIPE_AUTH_REQUIRED.length);

            handleAuthorization(
                paymentInformation,
                secret,
                (paymentInformation) => this.savePaymentInformation(paymentInformation)
            );
        } else {
            this._handleError(error);
        }
    };

    _getGuestCartId = () => BrowserDatabase.getItem(GUEST_QUOTE_ID);

    _getPaymentMethods() {
        fetchQuery(CheckoutQuery.getPaymentMethodsQuery(
            this._getGuestCartId()
        )).then(
            ({ getPaymentMethods: paymentMethods }) => {
                this.setState({ isLoading: false, paymentMethods });
            },
            this._handleError
        );
    }

    _getCheckoutTotals() {
        const { totals: cartTotals } = this.props;
        const { paymentTotals: { shipping_amount } } = this.state;

        return shipping_amount
            ? { ...cartTotals, shipping_amount }
            : cartTotals;
    }

    saveGuestEmail() {
        const { email } = this.state;
        const guestCartId = BrowserDatabase.getItem(GUEST_QUOTE_ID);
        const mutation = CheckoutQuery.getSaveGuestEmailMutation(email, guestCartId);

        return fetchMutation(mutation).then(
            ({ setGuestEmailOnCart: data }) => {
                if (data) {
                    this.setState({ isGuestEmailSaved: true });
                }

                return true;
            },
            this._handleError
        );
    }

    async createUserOrSaveGuest() {
        const {
            createAccount,
            totals: { is_virtual }
        } = this.props;

        const {
            email,
            password,
            isCreateUser,
            shippingAddress: {
                firstname,
                lastname
            }
        } = this.state;

        if (!isCreateUser) {
            return this.saveGuestEmail();
        }

        const options = {
            customer: {
                email,
                firstname,
                lastname
            },
            password
        };

        const creation = await createAccount(options);

        if (!creation) {
            return creation;
        }

        if (!is_virtual) {
            return this.setShippingAddress();
        }

        return true;
    }

    async saveAddressInformation(addressInformation) {
        const { shipping_address } = addressInformation;
        const { sourcesCount } = this.state
        this.setState({
            isLoading: true,
            shippingAddress: shipping_address
        });

        if (!isSignedIn()) {
            if (!await this.createUserOrSaveGuest()) {
                this.setState({ isLoading: false });
                return;
            }
        }

        fetchMutation(CheckoutQuery.getSaveAddressInformation(
            addressInformation,
            this._getGuestCartId(),
            sourcesCount
        )).then(
            ({ saveAddressInformation: data }) => {
                const { payment_methods, totals } = data;

                BrowserDatabase.setItem(
                    totals,
                    PAYMENT_TOTALS,
                    ONE_MONTH_IN_SECONDS
                );

                this.setState({
                    isLoading: false,
                    paymentMethods: payment_methods,
                    checkoutStep: BILLING_STEP,
                    paymentTotals: totals
                });
            },
            this._handleError
        );
    }

    async savePaymentInformation(paymentInformation) {
        const { isGuestEmailSaved } = this.state;
        this.setState({ isLoading: true });

        const { customer: { addresses } } = this.props;

        if (!isSignedIn() && !isGuestEmailSaved) {
            if (!await this.createUserOrSaveGuest()) {
                this.setState({ isLoading: false });
                return;
            }
        }

        if (!addresses.length) {
            this.setShippingAddress();
        }

        await this.saveBillingAddress(paymentInformation).then(
            () => this.savePaymentMethodAndPlaceOrder(paymentInformation),
            this._handleError
        );
    }

    trimAddressMagentoStyle(address) {
        const { countries } = this.props;

        const {
            country_id,
            region_code, // drop this
            region_id,
            region,
            ...restOfBillingAddress
        } = address;

        const newAddress = {
            ...restOfBillingAddress,
            country_code: country_id,
            region
        };

        /**
         * If there is no region specified, but there is region ID
         * get the region code by the country ID
         */
        if (region_id) {
            // find a country by country ID
            const { available_regions } = countries.find(
                ({ id }) => id === country_id
            ) || {};

            if (!available_regions) {
                return newAddress;
            }

            // find region by region ID
            const { code } = available_regions.find(
                ({ id }) => +id === +region_id
            ) || {};

            if (!code) {
                return newAddress;
            }

            newAddress.region = code;
        }

        return newAddress;
    }

    async saveBillingAddress(paymentInformation) {
        const guest_cart_id = !isSignedIn() ? this._getGuestCartId() : '';
        const { billing_address } = paymentInformation;
        BrowserDatabase.setItem(billing_address, 'shipping_address', 3600);
        await fetchMutation(CheckoutQuery.getSetBillingAddressOnCart({
            guest_cart_id,
            billing_address: {
                address: this.trimAddressMagentoStyle(billing_address)
            }
        }));
    }

    async savePaymentMethodAndPlaceOrder(paymentInformation) {
        const { requestCustomerData, toggle } = this.props;
        const { paymentTotals: { subtotal }, pointsAvailable, cashbackpercent, apistatus } = this.state
        const { paymentMethod: { code, additional_data } } = paymentInformation;
        const guest_cart_id = !isSignedIn() ? this._getGuestCartId() : '';
        try {
            let total = subtotal
            let loyaltyPointsSub = pointsAvailable
            const cashback = (subtotal / 100) * cashbackpercent
            if (toggle && apistatus) {
                if (pointsAvailable > subtotal) {
                    loyaltyPointsSub = subtotal
                } else if (pointsAvailable < subtotal) {
                    total = subtotal - pointsAvailable
                }
            } else {
                loyaltyPointsSub = 0
            }
            let parsma = {
                guest_cart_id,
                payment_method: {
                    code,
                    [code]: additional_data
                }
            }
            await fetchMutation(CheckoutQuery.getSetPaymentMethodOnCartMutation(parsma)).then(x => {

            });
            const orderData = await fetchMutation(CheckoutQuery.getPlaceOrderMutation(guest_cart_id, loyaltyPointsSub, cashback, this.props.location));
            const { placeOrder: { order: { order_id, order_sms } } } = orderData;
            requestCustomerData();
            const response = await this.requestPartialOrderDetails(JSON.parse(order_id))
            response.forEach(element => {
                const { base_order_info, shipping_info } = element;
                const estimated_delivery = base_order_info.estimated_delivery
                const shipping_description = shipping_info.shipping_description
                this.setDetailsStep(base_order_info.id, order_sms, parsma.payment_method.code, orderData, estimated_delivery, shipping_description);
            });
            // const { base_order_info, shipping_info } = await this.requestOrderDetails(order_id);
            // const estimated_delivery = base_order_info.estimated_delivery
            // const shipping_description = shipping_info.shipping_description
            // this.setDetailsStep(order_id, order_sms, parsma.payment_method.code, orderData, estimated_delivery, shipping_description);

        } catch (e) {
            this._handleError(e);
        }
    }

    changelatlngStateHandler(value) {
        this.setState({ latlngState: true, status: value })
    }
    changeWithOutlatlngStateHandler(value) {
        this.setState({ latlngState: true, status: value })

    }

    render() {
        return (
            <Checkout
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
                {...this.containerProps()}
                locationState={this.state.locationState}
                iDontWantFastDelievery={this.state.iDontWantFastDelievery}
                onLocationHandler={this.onLocationHandler.bind(this)}
                withoutLocation={this.withoutLocation.bind(this)}
                updateSources={this.updateSourcesHandler.bind(this)}
                changelatlngStateHandler={this.changelatlngStateHandler.bind(this)}
                latlng={this.state.latlng}
                status={this.state.status}
                latlngState={this.state.latlngState}
                anotherStatus={this.state.anotherStatus}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
