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
import {
    updateCustomerDetails
} from 'Store/MyAccount/MyAccount.action';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CUSTOMER_ACCOUNT, CUSTOMER_SUB_ACCOUNT } from 'Component/Header/Header.config';
import { CHECKOUT_URL } from 'Route/Checkout/Checkout.config';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { hideActiveOverlay, toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import isMobile from 'Util/Mobile';

import { TotalsType } from 'Type/MiniCart';
import MyAccountOverlay from './MyAccountOverlay.component';

import {
    CUSTOMER_ACCOUNT_OVERLAY_KEY,
    STATE_CONFIRM_EMAIL, STATE_CREATE_ACCOUNT, STATE_FORGOT_PASSWORD,
    STATE_FORGOT_PASSWORD_SUCCESS,
    STATE_LOGGED_IN, STATE_SIGN_IN,
    STATE_OTP,
    STATE_OTP_SUCCESS
} from './MyAccountOverlay.config';
import {
    setAuthorizationToken,
    deleteAuthorizationToken
} from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    navigationState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    customer: state.MyAccountReducer.customer,
    isOtpSend: state.MyAccountReducer.isOtpSend,
    isPasswordForgotSend: state.MyAccountReducer.isPasswordForgotSend,
    isOverlayVisible: state.OverlayReducer.activeOverlay === CUSTOMER_ACCOUNT,
    otpValue: ''
});

export const mapDispatchToProps = (dispatch) => ({
    setDataAfterLogin: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.setDataAfterLogin(dispatch)
    ),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    setNavigationState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    goToPreviousNavigationState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    forgotPassword: (options) => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.forgotPassword(options, dispatch)
    ),
    createAccount: (options) => MyAccountDispatcher.then(({ default: dispatcher }) => dispatcher.createAccount(options, dispatch)),
    otp: (options) => MyAccountDispatcher.then(({ default: dispatcher }) => dispatcher.otp(options, dispatch)),
    signIn: (options) => MyAccountDispatcher.then(({ default: dispatcher }) => dispatcher.signIn(options, dispatch)),
    socialSignIn: (options) => MyAccountDispatcher.then(({ default: dispatcher }) => dispatcher.socialSignIn(options, dispatch)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE)),
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch)
    ),
    requestCustomerDataAsync: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerDataAsync(dispatch)
    ),
});

export class MyAccountOverlayContainer extends PureComponent {
    static propTypes = {
        requestCustomerData: PropTypes.func.isRequired,
        requestCustomerDataAsync: PropTypes.func.isRequired,
        isOtpSend: PropTypes.bool.isRequired,
        forgotPassword: PropTypes.func.isRequired,
        signIn: PropTypes.func.isRequired,
        socialSignIn: PropTypes.func.isRequired,
        isPasswordForgotSend: PropTypes.bool.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        showNotification: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired,
        isOverlayVisible: PropTypes.bool.isRequired,
        otpValue: PropTypes.string.isRequired,
        showOverlay: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        setDataAfterLogin: PropTypes.func.isRequired,
        onSignIn: PropTypes.func,
        otp: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func,
        isCheckout: PropTypes.bool,
        hideActiveOverlay: PropTypes.func.isRequired,
        totals: TotalsType.isRequired,
        goToPreviousNavigationState: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isCheckout: false,
        onSignIn: () => { },
        goToPreviousHeaderState: () => { }
    };

    containerFunctions = {
        onSignInSuccess: this.onSignInSuccess.bind(this),
        onSignInAttempt: this.onSignInAttempt.bind(this),
        onCreateAccountAttempt: this.onCreateAccountAttempt.bind(this),
        onCreateAccountSuccess: this.onCreateAccountSuccess.bind(this),
        onForgotPasswordSuccess: this.onForgotPasswordSuccess.bind(this),
        onForgotPasswordAttempt: this.onForgotPasswordAttempt.bind(this),
        onFormError: this.onFormError.bind(this),
        handleForgotPassword: this.handleForgotPassword.bind(this),
        handleSignIn: this.handleSignIn.bind(this),
        handleCreateAccount: this.handleCreateAccount.bind(this),
        onVisible: this.onVisible.bind(this),
        onCloseBtnClick: this.onCloseBtnClick.bind(this),
        onSocialSignInSuccess: this.onSocialSignInSuccess.bind(this),
        handleOTP: this.handleOTP.bind(this),
        onOtpAttempt: this.onOtpAttempt.bind(this),
        onOtpSuccess: this.onOtpSuccess.bind(this),
    };

    containerProps = () => {
        const { navigationState } = this.props;

        return {
            navigationState
        };
    };


    constructor(props) {
        super(props);

        this.state = this.redirectOrGetState(props);
    }
    componentDidMount() {
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
    }
    static getDerivedStateFromProps(props, state) {
        const {
            isSignedIn,
            isPasswordForgotSend,
            showNotification,
            isOverlayVisible,
            isOtpSend
        } = props;

        const {
            isPasswordForgotSend: currentIsPasswordForgotSend,
            state: myAccountState,
            state: STATE_SIGN_IN,
        } = state;

        const { location: { pathname, state: { isForgotPassword } = {} } } = history;

        const stateToBeUpdated = {};

        if (!isMobile.any()) {
            if (!isOverlayVisible && !isSignedIn) {
                if (pathname !== '/forgot-password' && !isForgotPassword) {
                    stateToBeUpdated.state = STATE_SIGN_IN;
                }
            } else if (!isOverlayVisible && isSignedIn) {
                stateToBeUpdated.state = STATE_LOGGED_IN;
            }
            if (!isSignedIn) {
                stateToBeUpdated.state = STATE_SIGN_IN;
            }
        }

        if (myAccountState !== STATE_LOGGED_IN && isSignedIn) {
            stateToBeUpdated.isLoading = false;
            showNotification('success', __('You are successfully logged in!'));
            //stateToBeUpdated.state = STATE_LOGGED_IN;
        }

        if (myAccountState === STATE_LOGGED_IN && !isSignedIn) {
            stateToBeUpdated.state = STATE_SIGN_IN;
            // showNotification('success', __('You are successfully logged out!'));
        }

        if (isPasswordForgotSend !== currentIsPasswordForgotSend) {
            stateToBeUpdated.isLoading = false;
            stateToBeUpdated.isPasswordForgotSend = isPasswordForgotSend;
            // eslint-disable-next-line max-len
            showNotification('success', __('If there is an account associated with the provided address you will receive an email with a link to reset your password.'));
            stateToBeUpdated.state = STATE_SIGN_IN;
        }

        return Object.keys(stateToBeUpdated).length ? stateToBeUpdated : null;
    }

    // componentDidUpdate(prevProps, prevState) {
    //     const { isSignedIn: prevIsSignedIn } = prevProps;
    //     const { state: oldMyAccountState } = prevState;
    //     const { state: newMyAccountState } = this.state;
    //     const { location: { pathname } } = history;

    //     const {
    //         isSignedIn,
    //         hideActiveOverlay,
    //         isCheckout,
    //         goToPreviousHeaderState,
    //         totals: cartTotals
    //     } = this.props;

    //     if (oldMyAccountState === newMyAccountState) {
    //         return;
    //     }

    //     // if (isSignedIn !== prevIsSignedIn) {
    //     //     hideActiveOverlay();

    //     //     if (isCheckout) {
    //     //         goToPreviousHeaderState();
    //     //     }
    //     // }

    //     // if (isSignedIn()) hideActiveOverlay();

    //     if (!pathname.includes(CHECKOUT_URL) && newMyAccountState === STATE_LOGGED_IN) {
    //         history.push({ pathname: '/my-account/dashboard' });
    //        if(cartTotals) {
    //             const { items } = cartTotals;
    //             if(items) {
    //                 history.push({ pathname: '/checkout/shipping' });
    //             } else {
    //                 history.push({ pathname: '/my-account/dashboard' });
    //             }
    //         } else {
    //             history.push({ pathname: '/my-account/dashboard' });
    //         }
    //     }
    // }

    redirectOrGetState = (props) => {
        const {
            showOverlay,
            setHeaderState,
            isPasswordForgotSend
        } = props;

        const { location: { pathname, state: { isForgotPassword } = {} } } = history;

        const state = {
            // state: isSignedIn() ? STATE_LOGGED_IN : STATE_SIGN_IN,
            state: STATE_SIGN_IN,
            // eslint-disable-next-line react/no-unused-state
            isPasswordForgotSend,
            isLoading: false,
            userFullName:'',
            timerTime: {},
            timerSeconds: '90',
            orderSmsCode: '',
            isShowTimer: false,
            isResendBtnDisabled: true
        };

        // if customer got here from forgot-password
        // if (pathname !== '/forgot-password' && !isForgotPassword) {
        //     return state;
        // }

        // state.state = STATE_FORGOT_PASSWORD;

        // setHeaderState({
        //     name: CUSTOMER_SUB_ACCOUNT,
        //     title: 'Forgot password',
        //     onBackClick: (e) => {
        //         history.push({ pathname: '/my-account' });
        //         this.handleSignIn(e);
        //     }
        // });

        // if (isMobile.any()) {
        //     history.push({ pathname: '/my-account', state: { isForgotPassword: true } });
        //     return state;
        // }

        // showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);

        return state;
    };
    otprenderGetMobile() {
        // const { otpValue } = this.props;
        if ('OTPCredential' in window) {
            let ac = new AbortController();

            setTimeout(() => {
                // abort after 10 minutes
                ac.abort();
            }, 10 * 60 * 1000);
            navigator.credentials.get({
                otp: { transport: ['sms'] },
                signal: ac.signal
            }).then(otp => {
                this.setState({ otpValue: otp.code });
                this.setState({ isLoading: true });
                this.onOtpSuccess({ otp: otp.code });
            }).catch(err => {
            });
        }
    }
    async onSignInSuccess(fields) {
        const {
            signIn,
            showNotification,
            onSignIn,
            cartTotals,
            requestCustomerData
        } = this.props;

        // try {
        //     let success = await signIn(fields);
        //     if (success && success.type) {
        //         this.setState({ state: STATE_OTP, isLoading: false });
        //         // this.stopLoading();
        //     }
        // } catch (e) {
        //     this.setState({ isLoading: false });
        //     showNotification('error', e.message);
        // }
        fields.phone = fields.countryCode + fields.phone;
        localStorage.setItem('phone', fields.phone);
        delete fields.countryCode;
        try {
            this.setState({ state: STATE_OTP });
            await signIn(fields);
            this.otprenderGetMobile();
            //onSignIn();
            // if (cartTotals) {
            //     const { items_qty } = cartTotals;
            //     if (items_qty > 0) {
            //         requestCustomerData();
            //         history.push({ pathname: '/checkout/shipping' });
            //     }
            //     //  else {
            //     //     onSignIn();
            //     // }
            // } else {
            //     // onSignIn();
            //     this.stopLoading();
            // }
            this.setState({ isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false });
            showNotification('error', e.message);
        }
    }

    async onSocialSignInSuccess(fields) {
        const {
            socialSignIn,
            showNotification,
            onSignIn,
            totals: cartTotals,
            requestCustomerData
        } = this.props;

        this.setState({ isLoading: true });

        try {
            await socialSignIn(fields);
            if (cartTotals) {
                const { items_qty } = cartTotals;
                if (items_qty > 0) {
                    requestCustomerData();
                    history.push({ pathname: '/checkout/shipping' });
                } else {
                    onSignIn();
                }
            } else {
                onSignIn();
            }
        } catch (e) {
            this.setState({ isLoading: false });
            showNotification('error', e.message);
        }
    }

    onVisible() {
        const { setHeaderState, isCheckout } = this.props;

        if (isMobile.any() && !isCheckout) {
            setHeaderState({ name: CUSTOMER_ACCOUNT, title: 'Sign in' });
        }
    }

    onSignInAttempt() {
        this.setState({ isLoading: true });
    }

    onCreateAccountAttempt(_, invalidFields) {
        const { showNotification } = this.props;

        if (invalidFields) {
            showNotification('info', __('Incorrect data! Please resolve all field validation errors.'));
        }

        this.setState({ isLoading: !invalidFields });
    }

    onCreateAccountSuccess(fields) {
        const {
            hideActiveOverlay,
            setDataAfterLogin,
            createAccount,
            onSignIn,
            totals: cartTotals,
            requestCustomerData
        } = this.props;

        const { fullname, city } = fields;
        const customerData = {
            customer: {
                fullname,
                city
            }
        };
        //setAuthorizationToken(localStorage.getItem('user_token'));
        createAccount(fields).then(
            (code) => {
                setDataAfterLogin();
                requestCustomerData();
                if (cartTotals) {
                    const { items_qty } = cartTotals;
                    if (items_qty > 0) {
                        // requestCustomerData();
                        // hideActiveOverlay();
                        //     history.push({ pathname: '/checkout/shipping' });
                        this.getCustomer().then(x => {
                            if(x){
                                history.push({ pathname: '/checkout/shipping' });
                                hideActiveOverlay();
                            }
                        })
                    } else {
                        // requestCustomerData();
                        // hideActiveOverlay();
                        this.getCustomer().then(x => {
                            if(x){
                                history.push({ pathname: '/my-account/dashboard' });
                                hideActiveOverlay();
                            }
                        })
                    }
                } else {
                    // requestCustomerData();
                    // hideActiveOverlay();
                    // //  history.push({ pathname: '/my-account/dashboard' });
                    this.getCustomer().then(x => {
                        if(x){
                            history.push({ pathname: '/my-account/dashboard' });
                            hideActiveOverlay();
                        }
                    })
                }

                this.stopLoading();
            },
            this.stopLoading
        );
    }

    onCloseBtnClick() {
        const {
            goToPreviousNavigationState,
            hideActiveOverlay,
            navigationState: { name }
        } = this.props;

        if (isMobile.any()) return;
        if (name === CUSTOMER_SUB_ACCOUNT) goToPreviousNavigationState();
        goToPreviousNavigationState();
        hideActiveOverlay();
    }

    onForgotPasswordSuccess(fields) {
        const { forgotPassword } = this.props;

        forgotPassword(fields).then(() => {
            this.setState({ state: STATE_FORGOT_PASSWORD_SUCCESS });
            this.stopLoading();
        }, this.stopLoading);
    }

    onForgotPasswordAttempt() {
        this.setState({ isLoading: true });
    }
    clearCustomer() {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('auth_token');
            this.setState({ isSignedIn: false });
            setTimeout(() => {
                resolve(true);
            }, 600)

        })
    }
    getCustomer() {
        return new Promise((resolve, reject) => {
            const { totals: cartTotals, hideActiveOverlay, requestCustomerData, requestCustomerDataAsync, setDataAfterLogin } = this.props;
            requestCustomerDataAsync().then(customer => {
                this.setState({userFullName:customer.firstname});
                let usertoken = JSON.parse(localStorage.getItem('auth_token')).data;
                
                if (customer.firstname.toLocaleLowerCase() == "first name" || !customer.city) {
                    this.clearCustomer().then(res => {
                        this.setState({ state: STATE_CREATE_ACCOUNT, isLoading: false });
                        setAuthorizationToken(usertoken);
                    });
                    resolve(false);
                }
                else {
                    BrowserDatabase.setItem(customer, 'customer', 2628000);
                    setDataAfterLogin();
                    requestCustomerData();
                    this.setState({ isSignedIn: true, isLoading: false });
                    resolve(true);
                }
            })
        });

    }
    onOtpSuccess(fields) {
        const { onSignIn, totals: cartTotals, requestCustomerData, showNotification, hideActiveOverlay, otp, setDataAfterLogin } = this.props;
        this.setState({
            isLoading: true
        });
        otp(fields).then((response) => {
            if (response.verifyCustomerOtp.response == 'success' && response.verifyCustomerOtp.status == true) {
                if (response.verifyCustomerOtp.new_user == false) {
                    setAuthorizationToken(response.verifyCustomerOtp.token);
                    if (cartTotals) {
                        const { items_qty } = cartTotals;
                        if (items_qty > 0) {
                            this.getCustomer().then(x => {
                                if(x){
                                     history.push({ pathname: '/checkout/shipping' });
                                     hideActiveOverlay();
                                     this.setState({ isLoading: false });
                                }
                            });

                        } else {
                            this.getCustomer().then(x => {
                                if(x){
                                    history.push({ pathname: '/my-account/dashboard' });
                                    hideActiveOverlay();
                                    this.setState({ isLoading: false });
                                }
                            });
                        }
                    } else {
                        this.getCustomer().then(x => {
                            if(x){
                                history.push({ pathname: '/my-account/dashboard' });
                                hideActiveOverlay();
                                this.setState({ isLoading: false });
                            }
                        });
                    }
                    //hideActiveOverlay();
                    //this.setState({ isLoading: false });
                } else {
                    setAuthorizationToken(response.verifyCustomerOtp.token);
                    //localStorage.setItem('user_token', response.verifyCustomerOtp.token);
                    this.setState({ state: STATE_CREATE_ACCOUNT, isLoading: false });
                }
                //this.stopLoading();
            }
            else {
                let phone = localStorage.getItem('phone');
                if (phone) phone = phone.splice(3, 0, '(').splice(7, 0, ')')
                showNotification('error', 'You have entered incorrect OTP \n Please enter correct OTP received on your number ' + phone);
                this.setState({ isLoading: false });
                //this.stopLoading();
            }

        }, () => {
            this.stopLoading();
        });
    }

    onOtpAttempt() {
        this.setState({ isLoading: true });
    }

    onFormError() {
        this.setState({ isLoading: false });
    }

    stopLoading = () => this.setState({ isLoading: false });

    stopLoadingAndHideOverlay = () => {
        const { hideActiveOverlay } = this.props;
        this.stopLoading();
        hideActiveOverlay();
    };

    handleForgotPassword(e) {
        const { setHeaderState } = this.props;
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_FORGOT_PASSWORD });

        setHeaderState({
            name: CUSTOMER_SUB_ACCOUNT,
            title: __('Forgot password'),
            onBackClick: () => this.handleSignIn(e)
        });
    }

    handleOTP(e) {
        const { setHeaderState } = this.props;
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_OTP });

        setHeaderState({
            name: CUSTOMER_SUB_ACCOUNT,
            title: 'OTP',
            onBackClick: () => this.handleSignIn(e)
        });
    }

    handleSignIn(e) {
        const { setHeaderState } = this.props;
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_SIGN_IN });

        setHeaderState({
            name: CUSTOMER_ACCOUNT,
            title: __('Sign in')
        });
    }

    handleCreateAccount(e) {
        const { setHeaderState } = this.props;
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ state: STATE_CREATE_ACCOUNT });

        setHeaderState({
            name: CUSTOMER_SUB_ACCOUNT,
            title: __('Create account'),
            onBackClick: () => this.handleSignIn(e)
        });
    }

    render() {
        return (
            <MyAccountOverlay
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOverlayContainer);
