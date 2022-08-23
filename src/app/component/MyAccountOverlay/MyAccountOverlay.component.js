/* eslint-disable max-len */
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

import './MyAccountOverlay.style';
import ApolloClient from 'apollo-boost';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import Field from 'Component/Field';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import Overlay from 'Component/Overlay';
import isMobile from 'Util/Mobile';

import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FaFacebook } from 'react-icons/fa';
import ringer from "../../../../media/phonelink-ring.gif";
import secure from "../../../../media/shield.svg";
import success from "../../../../media/check-circle.gif";
import promo from "../../../../media/promo.jpg";
import {
    CUSTOMER_ACCOUNT_OVERLAY_KEY,
    STATE_CONFIRM_EMAIL,
    STATE_CREATE_ACCOUNT,
    STATE_FORGOT_PASSWORD,
    STATE_FORGOT_PASSWORD_SUCCESS,
    STATE_LOGGED_IN,
    STATE_SIGN_IN,
    STATE_OTP,
    STATE_OTP_SUCCESS
} from './MyAccountOverlay.config';

const facebookLoginImg = window.location.protocol + '//' + window.location.hostname + '/media/wysiwyg/social/facebook-login.png';
const googleLoginImg = window.location.protocol + '//' + window.location.hostname + '/media/wysiwyg/social/google-login.png';
const clientAPI = new ApolloClient({
    uri: window.location.protocol + '//' + window.location.hostname + '/graphql'
});
export class MyAccountOverlay extends PureComponent {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        isOverlayVisible: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        state: PropTypes.oneOf([
            STATE_SIGN_IN,
            STATE_FORGOT_PASSWORD,
            STATE_FORGOT_PASSWORD_SUCCESS,
            STATE_CREATE_ACCOUNT,
            STATE_LOGGED_IN,
            STATE_CONFIRM_EMAIL,
            STATE_OTP,
            STATE_OTP_SUCCESS,
        ]).isRequired,
        // otpValue: PropTypes.string.isRequired,

        onVisible: PropTypes.func.isRequired,
        onSignInSuccess: PropTypes.func.isRequired,
        onSocialSignInSuccess: PropTypes.func.isRequired,
        onSignInAttempt: PropTypes.func.isRequired,
        onCreateAccountAttempt: PropTypes.func.isRequired,
        onCreateAccountSuccess: PropTypes.func.isRequired,
        onForgotPasswordSuccess: PropTypes.func.isRequired,
        onForgotPasswordAttempt: PropTypes.func.isRequired,
        onFormError: PropTypes.func.isRequired,
        handleForgotPassword: PropTypes.func.isRequired,
        handleSignIn: PropTypes.func.isRequired,
        handleCreateAccount: PropTypes.func.isRequired,
        isCheckout: PropTypes.bool,
        onCloseBtnClick: PropTypes.func.isRequired,
        handleOTP: PropTypes.func.isRequired,
        onOtpSuccess: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isCheckout: false
    };

    state = {
        otpValue: '',
        telephone: "333",
        isLoaded: false,
        timerTime: {},
        timerSeconds: '90',
        orderSmsCode: '',
        isShowTimer: false,
        isResendBtnDisabled: true
    };

    timer = 0;

    renderMap = {
        [STATE_SIGN_IN]: {
            render: () => this.renderSignIn(),
            // title: __('Sign in to your account')
        },
        [STATE_FORGOT_PASSWORD]: {
            render: () => this.renderForgotPassword(),
            title: __('Get password link')
        },
        [STATE_FORGOT_PASSWORD_SUCCESS]: {
            render: () => this.renderForgotPasswordSuccess()
        },
        [STATE_CREATE_ACCOUNT]: {
            render: () => this.renderCreateAccount(),
            title: __('Create new account')
        },
        [STATE_LOGGED_IN]: {
            render: () => { }
        },
        [STATE_CONFIRM_EMAIL]: {
            render: () => this.renderConfirmEmail(),
            title: __('Confirm the email')
        },
        [STATE_OTP]: {
            render: () => this.renderOTP(),
            // title: __('Get OTP')
        },
        [STATE_OTP_SUCCESS]: {
            render: () => this.renderCreateAccount(),
            // title: __('Create an account')
        },
    };

    handleResponseGoogle = (response) => {
        const {
            onSocialSignInSuccess
        } = this.props;

        if (response.profileObj) {
            let socialSignInData = {
                email: response.profileObj.email,
                firstname: response.profileObj.name
            };
            onSocialSignInSuccess(socialSignInData);
        }
    }

    handleResponseFacebook = (response) => {
        const {
            onSocialSignInSuccess
        } = this.props;

        if (response.accessToken) {
            let socialSignInData = {
                email: response.email,
                firstname: response.name
            };
            onSocialSignInSuccess(socialSignInData);
        } else {
        }
    }

    handleSocialLoginResponseFailure = (response) => {
    }

    renderMyAccount() {
        const { state, onCloseBtnClick } = this.props;
        const { render, title } = this.renderMap[state];

        return (
            <div block="MyAccountOverlay" elem="Action" mods={{ state }}>
                <div class="secured_Wrap">
                    <img class="secure-img" src={secure} />
                    <label>Secured</label>
                </div>
                {/* <p block="MyAccountOverlay" elem="Heading">{title}</p> */}
                { !isMobile.any() && (
                    <button
                        block="MyAccountOverlay"
                        elem="CloseButton"
                        onClick={onCloseBtnClick}
                        aria-label={__('Close')}
                    />
                )}
                { state && state == "otpSuccess" ? this.renderCreateAccount() : render()}
            </div>
        );
    }

    renderConfirmEmail() {
        const { state, handleSignIn } = this.props;

        return (
            <article
                aria-labelledby="confirm-email-notice"
                block="MyAccountOverlay"
                elem="Additional"
                mods={{ state }}
            >
                <p id="confirm-email-notice">
                    { /* eslint-disable-next-line max-len */}
                    {__('The email confirmation link has been sent to your email. Please confirm your account to proceed.')}
                </p>
                <button
                    block="Button"
                    onClick={handleSignIn}
                >
                    {__('Got it')}
                </button>
            </article>
        );
    }

    // renderOTP() {
    //     const {
    //         state,
    //         onOtpAttempt,
    //         onOtpSuccess,
    //         onFormError,
    //         handleSignIn,
    //         onForgotPasswordAttempt,
    //         onForgotPasswordSuccess,
    //         handleCreateAccount,
    //         isCheckout
    //     } = this.props;

    //     const { isShowTimer } = this.state;
    //     const phoneNumber = localStorage.getItem("phone")

    //     return (
    //         <>

    //             <img class="ringer-img" src={ringer} />
    //             <p class="txt-center">A text has been sent to your <br /> number {phoneNumber}</p>

    //             <Form
    //                 onSubmit={onOtpAttempt}
    //                 onSubmitSuccess={onOtpSuccess}
    //                 onSubmitError={onFormError}
    //             >
    //                 <Field
    //                     // title="You have entered incomplete OTP next line Please enter 4 digit OTP received on your number"
    //                     maxLength="4"
    //                     type="otp"
    //                     label={__('Enter OTP')}

    //                     id="otp"
    //                     name="otp"
    //                     validation={['notEmpty', 'otp']}
    //                 />

    //                 <div block="MyAccountOverlay" elem="Buttons">
    //                     <button block="Button" type="submit">
    //                         {__('VERIFY')}
    //                     </button>
    //                 </div>
    //                 <p block="CheckoutSuccess" elem="OtpResend">
    //                     <button block="CheckoutSuccess" elem="OtpResendBtn" onClick={this.handleVerifySms} title="Resend OTP" disabled={this.state.isResendBtnDisabled}>{__('Resend OTP')}</button>
    //                     <span block="CheckoutSuccess" elem="OtpResendTimer">{state == "otp" ? this.startTimer() : null}</span>
    //                 </p>

    //             </Form>
    //             <div class="wrap-verify">
    //                 <p class="MyAccountOverlay-Heading txt-center">Why Verify?</p>
    //                 <p class="txt-center">Verifying your number helps us <br /> create a personalized shopping <br /> experience for you</p>
    //             </div>
    //         </>
    //     );
    // }
    handlemyOtp = (e) => {
        const {
            onOtpSuccess,
        } = this.props;
        if (e.target.value.length == 4) {
            onOtpSuccess({ otp: e.target.value });
        }

    }

    renderOTP() {
        const {
            state,
            onOtpAttempt,
            onOtpSuccess,
            onFormError,
            handleSignIn,
            onForgotPasswordAttempt,
            onForgotPasswordSuccess,
            handleCreateAccount,
            isCheckout,
            otpValue
        } = this.props;
        let { isShowTimer } = this.state;
        let phoneNumber = localStorage.getItem('phone');

        return (
            <>
                <div class="form-wrap-main">
                    <img class="ringer-img" src={ringer} />
                    <p class="txt-center">A text has been sent to your <br /> number {phoneNumber}</p>

                    <Form
                        onSubmit={onOtpAttempt}
                        onSubmitSuccess={onOtpSuccess}
                        onSubmitError={onFormError}
                    >
                        <Field
                            autoFocus="true"
                            value={this.state.otpValue}
                            maxLength="4"
                            type="text"
                            onKeyUp={this.handlemyOtp}
                            autocomplete="one-time-code"
                            label={__('Enter OTP')}
                            id="otp"
                            name="otp"
                            pattern="[0-9]"
                            inputmode="numeric"
                            validation={['notEmpty', 'otp']}
                        />
                        {/* <input type="text" autocomplete="one-time-code" /> */}
                        <div block="MyAccountOverlay" elem="Buttons" >
                            <button disabled={this.state.otpValue.length < 4} block="Button" type="submit">
                                {__('VERIFY')}
                            </button>
                        </div>
                        <p block="CheckoutSuccess" elem="OtpResend">
                            <button block="CheckoutSuccess" elem="OtpResendBtn" onClick={this.handleVerifySms} title="Resend OTP" disabled={this.state.isResendBtnDisabled}>{__('Resend OTP')}</button>
                            <span block="CheckoutSuccess" elem="OtpResendTimer">{state == "otp" ? this.startTimer() : ''}</span>
                        </p>
                    </Form>
                </div>
                <div class="wrap-verify">
                    <div>
                        <div>
                            <p class="MyAccountOverlay-Heading txt-center">WHY VERIFY?</p>
                            <p class="txt-center">Verifying your number helps us <br /> create a personalized shopping <br /> experience for you</p>
                        </div>
                    </div>
                </div>
            </>
        );

    }

    renderForgotPassword() {
        const {
            state,
            onForgotPasswordAttempt,
            onForgotPasswordSuccess,
            onFormError,
            handleSignIn,
            handleCreateAccount,
            isCheckout
        } = this.props;

        return (
            <>
                <Form
                    key="forgot-password"
                    onSubmit={onForgotPasswordAttempt}
                    onSubmitSuccess={onForgotPasswordSuccess}
                    onSubmitError={onFormError}
                >
                    <Field
                        type="email"
                        id="email"
                        name="email"
                        label={__('Email')}
                        placeholder={__('Email')}
                        autocomplete="email"
                        validation={['notEmpty', 'email']}
                    />
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button block="Button" type="submit">
                            {__('Send reset link')}
                        </button>
                    </div>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={{ state }}>
                    <section aria-labelledby="forgot-password-labe">
                        <h4 id="forgot-password-label">{__('Already have an account?')}</h4>
                        <button
                            block="Button"
                            mods={{ likeLink: true }}
                            onClick={handleSignIn}
                        >
                            {__('Sign in here')}
                        </button>
                    </section>
                    {!isCheckout && (
                        <section aria-labelledby="create-account-label">
                            <h4 id="create-account-label">{__('Don`t have an account?')}</h4>
                            <button
                                block="Button"
                                mods={{ likeLink: true }}
                                onClick={handleCreateAccount}
                            >
                                {__('Create an account')}
                            </button>
                        </section>
                    )}
                </article>
            </>
        );
    }

    renderForgotPasswordSuccess() {
        const { state, handleSignIn } = this.props;

        return (
            <article
                aria-labelledby="forgot-password-success"
                block="MyAccountOverlay"
                elem="Additional"
                mods={{ state }}
            >
                <p id="forgot-password-success">
                    {__('If there is an account associated with the provided address you will receive an email with a link to reset your password')}
                </p>
                <button
                    block="Button"
                    onClick={handleSignIn}
                >
                    {__('Got it')}
                </button>
            </article>
        );
    }

    renderOTPSuccess() {
        return (
            <>
                <Form
                    key="create-account"
                    onSubmit={onCreateAccountAttempt}
                    onSubmitSuccess={onCreateAccountSuccess}
                    onSubmitError={onCreateAccountAttempt}
                >
                    <fieldset block="MyAccountOverlay" elem="Legend">
                        <Field
                            type="text"
                            label={__('Full Name')}
                            id="fullname"
                            autocomplete="name"
                            placeholder={__('Full Name')}
                            name="fullname"
                            validation={['fullName']}
                            autofocus="true"
                        />
                        <Field
                            type="auto"
                            label={__('City')}
                            id="city"
                            autocomplete='off'
                            placeholder={__('City')}
                            name="city"
                            validation={['selectCity', 'matchCity']}
                        />
                    </fieldset>
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button
                            block="Button"
                            type="submit"
                        >
                            {__('SAVE & CONTINUE')}
                        </button>
                    </div>
                </Form>
            </>
        )
    }
    getDefaultValues([key, props]) {
        const {
            type = 'text',
            ...otherProps
        } = props;

        return {
            ...otherProps,
            key,
            name: key,
            id: key,
            type
        };
    }
    getCityFields() {
        return (
            <>
                <Field
                    id="city"
                    name="city"
                    label={__('City')}
                    type='auto'
                    autocomplete='off'
                    placeholder={__('City')}
                    validation={['selectCity', 'matchCity']} />
            </>
        );
    }
    renderCreateAccount() {
        const {
            state,
            onCreateAccountAttempt,
            onCreateAccountSuccess,
            handleSignIn,
            userFullName
        } = this.props;
        return (
            <>
                <div class="form-wrap-main">
                    <img class="success-img" src={success} />
                    <p class="txt-center">Finalize your profile</p>
                    <Form
                        key="create-account"
                        onSubmit={onCreateAccountAttempt}
                        onSubmitSuccess={onCreateAccountSuccess}
                        onSubmitError={onCreateAccountAttempt}
                        class="full_Name_Field"
                    >
                        <fieldset block="MyAccountOverlay" elem="Legend">
                            <Field
                                type="text"
                                label={__('Full Name')}
                                id="firstname"
                                autocomplete="name"
                                placeholder={__('Full Name')}
                                name="firstname"
                                validation={['fullName']}
                                autofocus="true"
                                value={userFullName}
                            />
                            {this.getCityFields()}
                        </fieldset>
                        <div block="MyAccountOverlay" elem="Buttons">
                            <button
                                block="Button"
                                type="submit"
                            >
                                {__('SAVE & CONTINUE')}
                            </button>
                        </div>
                    </Form>
                </div>
                <div class="wrap-verify">
                    <div>
                        <div>
                            <p class="MyAccountOverlay-Heading txt-center">WHY CREATE PROFILE?</p>
                            <p class="txt-center">Create profile will help you get<br /> a personalized shopping <br /> experience every time you visit</p>
                        </div>
                    </div>
                </div>

            </>
        );
    }
    // renderCityField() {
    //     const {
    //         onCreateAccountSuccess
    //     } = this.props;
    //     return (
    //         <>
    //             <div class="form-wrap-main">
    //                 <Form
    //                     key="create-city"
    //                     onSubmitSuccess={onCreateAccountSuccess}
    //                     class="full_Name_Field"
    //                 >
    //                     <fieldset block="MyAccountOverlay" elem="Legend">
    //                         {this.getCityFields()}
    //                     </fieldset>
    //                 </Form>

    //             </div>

    //         </>
    //     )
    // }
    // renderCreateAccount() {
    //     const {
    //         state,
    //         onCreateAccountAttempt,
    //         onCreateAccountSuccess,
    //         handleSignIn
    //     } = this.props;

    //     return (
    //         <>
    //             <Form
    //               key="create-account"
    //               onSubmit={ onCreateAccountAttempt }
    //               onSubmitSuccess={ onCreateAccountSuccess }
    //               onSubmitError={ onCreateAccountAttempt }
    //             >
    //                 <fieldset block="MyAccountOverlay" elem="Legend">
    //                     <Field
    //                       type="text"
    //                       label={ __('Full Name') }
    //                     placeholder={ __('Full Name') }
    //                       id="firstname"
    //                       name="firstname"
    //                       autocomplete="given-name"
    //                       validation={ ['fullName'] }
    //                     />
    //                     <Field
    //                       type="hidden"
    //                       label={ __('-') }
    //                       id="lastname"
    //                       name="lastname"
    //                       validation={ ['notEmpty'] }
    //                     value="-"
    //                     />
    //                     <Field
    //                       type="email"
    //                       label={ __('Email') }
    //                     placeholder={ __('Email') }
    //                       id="email"
    //                       name="email"
    //                       autocomplete="email"
    //                       validation={ ['notEmpty', 'email'] }
    //                     />
    //                     <Field
    //                       type="password"
    //                       label={ __('Password') }
    //                     placeholder={ __('Password') }
    //                       id="password"
    //                       name="password"
    //                       autocomplete="new-password"
    //                       validation={ ['notEmpty', 'password'] }
    //                     />
    //                     <Field
    //                     type="checkbox"
    //                     value="is_subscribed"
    //                     label={ __('Subscribe to newsletter') }
    //                     id="is_subscribed"
    //                     mix={ { block: 'MyAccountOverlay', elem: 'Checkbox' } }
    //                     name="is_subscribed"
    //                     />
    //                 </fieldset>
    //                 <div block="MyAccountOverlay" elem="Buttons">
    //                     <button
    //                       block="Button"
    //                       type="submit"
    //                     >
    //                         { __('Sign up') }
    //                     </button>
    //                 </div>
    //             </Form>
    //             <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
    //                 <section>
    //                     <h4>{ __('Already have an account?') }</h4>
    //                     <button
    //                       block="Button"
    //                       mods={ { likeLink: true } }
    //                       onClick={ handleSignIn }
    //                     >
    //                         { __('Sign in here') }
    //                     </button>
    //                 </section>
    //             </article>
    //         </>
    //     );
    // }

    // renderSignIn() {
    //     const {
    //         state,
    //         onSignInAttempt,
    //         onSignInSuccess,
    //         onFormError,
    //         handleForgotPassword,
    //         handleCreateAccount,
    //         isCheckout,
    //         isOverlayVisible
    //     } = this.props;

    //     return (
    //         <>
    //             <Form
    //               key="sign-in"
    //               onSubmit={ onSignInAttempt }
    //               onSubmitSuccess={ onSignInSuccess }
    //               onSubmitError={ onFormError }
    //             >
    //                 <Field
    //                   type="email"
    //                   label={ __('Email Address') }
    //                 placeholder={ __('Email Address') }
    //                   id="email"
    //                   name="email"
    //                   autocomplete="email"
    //                   validation={ ['notEmpty', 'email'] }
    //                 />
    //                 <Field
    //                   type="password"
    //                   label={ __('Password') }
    //                 placeholder={ __('Password') }
    //                   id="password"
    //                   name="password"
    //                   autocomplete="current-password"
    //                   validation={ ['notEmpty', 'password'] }
    //                 />
    //                 <div block="MyAccountOverlay" elem="Buttons">
    //                     <button block="Button">{ __('Sign in') }</button>
    //                 </div>
    //                 <button
    //                   block="Button"
    //                   mods={ { likeLink: true } }
    //                   onClick={ handleForgotPassword }
    //                 >
    //                     { __('Forgot password?') }
    //                 </button>
    //             </Form>

    //             <p block="MyAccountOverlay" elem="SocialOr">
    //                     { __('OR') }
    //             </p>

    //             <span block="MyAccountOverlay" elem="SocialLogins">
    //                 <FacebookLogin
    //                 appId="2911329662299005"
    //                 autoLoad={false}
    //                 disableMobileRedirect={true}
    //                 fields="name,email"
    //                 callback={this.handleResponseFacebook}
    //                 size="medium"
    //                 textButton="Continue with Facebook"
    //                 icon={<FaFacebook />}
    //                 />

    //                 <GoogleLogin
    //                 clientId="131328262227-ueii0dli9ajlc009gq51ghjhdaihrm2u.apps.googleusercontent.com"
    //                 onSuccess={this.handleResponseGoogle}
    //                 onFailure={this.handleSocialLoginResponseFailure}
    //                 cookiePolicy={'single_host_origin'}
    //                 theme="dark"
    //                 className="kep-login-google"
    //                 />
    //             </span>

    //             { !isCheckout && (
    //                 <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
    //                     <section>
    //                         <h4 id="forgot-password-label">{ __('Don`t have an account?') }</h4>
    //                         <button
    //                           block="Button"
    //                           mods={ { isHollow: true } }
    //                           onClick={ handleCreateAccount }
    //                         >
    //                             { __('Create an account') }
    //                         </button>
    //                     </section>
    //                 </article>
    //             ) }
    //         </>
    //     );
    // }
    // onChangeMobile(e,q,b) {
    //     //const  {telephone}=this.state;
    //     if (e.length == 1 && e == '0') {
    //         return '';
    //     }
    //     if (e.length > 0 && e.indexOf('3') > -1) {
    //         return e.slice(e.indexOf('3'), e.length);
    //     }
    // }
    renderSignIn() {
        const {
            state,
            onSignInAttempt,
            onSignInSuccess,
            onFormError,
            handleForgotPassword,
            handleCreateAccount,
            onOtpSuccess,
            onOtpAttempt,
            isCheckout,
            isOverlayVisible,
            handleOTP,
            handleSignInByNumber,
            onSignInByNumberSuccess,
            onSignInByNumberAttempt
        } = this.props;
        const { isLoaded, telephone } = this.state;
        return (
            <>

                <img class="promo-img" src={promo} />
                <p class="txt-center">Please enter your Whatsapp number</p>

                <Form
                    key="sign-in"
                    onSubmit={onSignInAttempt}
                    onSubmitSuccess={onSignInSuccess}
                    onSubmitError={onFormError}
                >
                    <Field
                        value="+92"
                        maxLength="3"
                        disabled
                        type="tel"
                        fieldType="countryCode"
                        id="countryCode"
                        name="countryCode"
                    />
                    <Field
                        value={this.state.telephone}
                        autoFocus="true"
                        type="tel_masks"
                        fieldType="phone"
                        label={__('Phone Number')}
                        // onChange={this.onChangeMobile}
                        id="phone"
                        name="phone"
                        validation={['notEmpty', 'telephonePk']}
                    />


                    <div block="MyAccountOverlay" elem="Buttons">
                        <button type="submit" block="Button">{__('CONTINUE')}</button>
                    </div>
                </Form>
            </>
        );
    }

    timer() {
        const { timer } = this.state;
        if (timer != 0) {
            this.setState({ timer: this.state.timer - 1 }, () => {
                setTimeout(() => {
                    this.timer();
                }, 1000);
            });
        }
    }

    startTimer = () => {
        if (this.timer == 0 && this.state.timerSeconds > 0) {

            this.timer = setInterval(this.countDown, 1000);
        }
        // return this.timer;
        let time = `${this.state.timerTime.m}:${this.state.timerTime.s}`;

        if (this.state.timerTime.m != undefined) {
            return time;
        }

    }

    countDown = () => {
        // Remove one second, set state so a re-render happens.
        if (this.state.timerSeconds > 0) {
            let seconds = this.state.timerSeconds - 1;
            this.setState({
                timerTime: this.secondsToTime(seconds),
                timerSeconds: seconds,
            });
            if (seconds == 0) {
                //clearInterval(this.timer);
                this.setState({
                    isResendBtnDisabled: false,
                });
                //this.startTimer();
                // this.handleVerifySms(null);
            }
        }


        // Check if we're at zero.

    }

    secondsToTime = (secs) => {
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

    handleVerifySms = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            isResendBtnDisabled: true,
            isShowTimer: false,
            timer: 0,
            timerSeconds: '90',
            timerTime: {}
        });
        const numberMobile = localStorage.getItem("phone");
        clientAPI.query({
            query: gql`
                 {
                   sendCustomerOtp(phone: "${numberMobile}") {
                       status
                       response
                     }
                 }
               `
        }).then(result => {

        });
    };

    render() {
        const { isLoading, onVisible, isCheckout } = this.props;
        return (
            <Overlay
                id={CUSTOMER_ACCOUNT_OVERLAY_KEY}
                mix={{ block: 'MyAccountOverlay' }}
                onVisible={onVisible}
                isStatic={!isCheckout && !!isMobile.any()}
            >
                <Loader isLoading={isLoading} />
                { this.renderMyAccount()}
            </Overlay>
        );
    }
}

export default withRouter(MyAccountOverlay);
