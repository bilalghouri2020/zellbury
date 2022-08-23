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

import MyAccountQuery from 'Query/MyAccount.query';
import {
    updateCustomerDetails,
    updateCustomerPasswordForgotStatus,
    updateCustomerPasswordResetStatus,
    updateCustomerSignInStatus,
    updateCustomerOtpStatus,
    updateCustomerSignInByNumberStatus
} from 'Store/MyAccount/MyAccount.action';
import { showNotification } from 'Store/Notification/Notification.action';
import { ORDERS } from 'Store/Order/Order.reducer';
import {
    deleteAuthorizationToken,
    setAuthorizationToken
} from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';
import { prepareQuery } from 'Util/Query';
import { fetchQuery, executePost, fetchMutation } from 'Util/Request';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

export const WishlistDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Wishlist/Wishlist.dispatcher'
);

export const CUSTOMER = 'customer';

export const ONE_MONTH_IN_SECONDS = 2628000;

/**
 * My account actions
 * @class MyAccount
 */
export class MyAccountDispatcher {
    requestCustomerData(dispatch) {
        const query = MyAccountQuery.getCustomerQuery();

        const customer = BrowserDatabase.getItem(CUSTOMER) || {};
        if (customer.id) {
            dispatch(updateCustomerDetails(customer));
        }

        return executePost(prepareQuery([query])).then(
            ({ customer }) => {
                dispatch(updateCustomerDetails(customer));
                BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
            },
            (error) => dispatch(showNotification('error', error[0].message))
        );
    }
    requestCustomerDataAsync(dispatch) {
        return new Promise((resolve, reject) => {
            const query = MyAccountQuery.getCustomerQuery();
            executePost(prepareQuery([query])).then(
                ({ customer }) => {
                    //dispatch(updateCustomerDetails(customer));
                    //BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
                    resolve(customer);
                },
                (error) => {
                    dispatch(showNotification('error', error[0].message));
                    reject(error);
                });
        })

    }
    logout(_, dispatch) {
        return new Promise((resolve, reject) => {
            dispatch(updateCustomerSignInStatus(false));
            deleteAuthorizationToken();
            CartDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch));
            WishlistDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialWishlistData(dispatch));
            BrowserDatabase.deleteItem(ORDERS);
            BrowserDatabase.deleteItem(CUSTOMER);
            dispatch(updateCustomerDetails({}));
            resolve(true);
        });
    }

    /**
     * Forgot password action
     * @param {{email: String}} [options={}]
     * @returns {Promise<{status: String}>} Reset password token
     * @memberof MyAccountDispatcher
     */
    forgotPassword(options = {}, dispatch) {
        const mutation = MyAccountQuery.getForgotPasswordMutation(options);
        return fetchMutation(mutation).then(
            () => dispatch(updateCustomerPasswordForgotStatus()),
            (error) => dispatch(showNotification('error', error[0].message))
        );
    }

    setDataAfterLogin(dispatch) {
        // dispatch(updateCustomerOtpStatus());
        dispatch(updateCustomerSignInStatus(true));
        CartDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch));
        WishlistDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialWishlistData(dispatch));
    }

    async otp(options = {}, dispatch) {
        const mutation = MyAccountQuery.getOtpMutation(options);
        // return fetchMutation(mutation).then(
        //     () => dispatch(updateCustomerOtpStatus()),
        //     error => dispatch(showNotification('error', error[0].message))
        // );
        // const mutation = MyAccountQuery.getOtpMutation(options);
        // return fetchQuery(mutation).then(
        //         () => dispatch(updateCustomerOtpStatus()

        //         ),
        //         error => dispatch(showNotification('error', error[0].message))
        //     );
        try {
            // let phoneNumber = localStorage.getItem(phone);
            // options["phone"] = phoneNumber;

            const result = await fetchQuery(mutation)


            if (result && result.verifyCustomerOtp.response == "success") {
                //     // if(!result.verifyCustomerOtp.new_user){
                // dispatch(updateCustomerOtpStatus());
                //         dispatch(updateCustomerSignInStatus(true));
                //         setAuthorizationToken(result.verifyCustomerOtp.token);
                //         CartDispatcher.updateInitialCartData(dispatch);
                //         WishlistDispatcher.updateInitialWishlistData(dispatch);
                //     // }
            }
            // Promise.resolve(result);
            return result;
        } catch ([e]) {
            throw e;
        }
    }


    /**
     * Reset password action
     * @param {{token: String, password: String, password_confirmation: String}} [options={}]
     * @returns {Promise<{status: String}>} Reset password token
     * @memberof MyAccountDispatcher
     */
    resetPassword(options = {}, dispatch) {
        const mutation = MyAccountQuery.getResetPasswordMutation(options);

        return fetchMutation(mutation).then(
            ({ resetPassword: { status } }) => dispatch(updateCustomerPasswordResetStatus(status)),
            () => dispatch(updateCustomerPasswordResetStatus('error'))
        );
    }

    /**
     * Create account action
     * @param {{customer: Object, password: String}} [options={}]
     * @memberof MyAccountDispatcher
     */
    createAccount(options = {}, dispatch) {
        const mutation = MyAccountQuery.getUpdateInformationMutation(options);
        return fetchMutation(mutation).then(
            (data) => {
                return data;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        // const { customer: { email }, password } = options;
        // const mutation = MyAccountQuery.getCreateAccountMutation(options);

        // return fetchMutation(mutation).then(
        //     (data) => {
        //         const { createCustomer: { customer } } = data;
        //         const { confirmation_required } = customer;

        //         if (confirmation_required) {
        //             return 2;
        //         }

        //         return this.signIn({ email, password }, dispatch);
        //     },
        //     (error) => {
        //         dispatch(showNotification('error', error[0].message));
        //         Promise.reject();

        //         return false;
        //     }
        // );
    }

    /**
     * Confirm account action
     * @param {{key: String, email: String, password: String}} [options={}]
     * @memberof MyAccountDispatcher
     */
    confirmAccount(options = {}, dispatch) {
        const mutation = MyAccountQuery.getConfirmAccountMutation(options);

        return fetchMutation(mutation).then(
            () => dispatch(showNotification('success', __('Your account is confirmed!'))),
            () => dispatch(showNotification('error', __('Something went wrong! Please, try again!')))
        );
    }

    /**
     * Sign in action
     * @param {{email: String, password: String}} [options={}]
     * @memberof MyAccountDispatcher
     */
    // async signIn(options = {}, dispatch) {
    //     const mutation = MyAccountQuery.getSignInMutation(options);

    //     try {
    //         const result = await fetchMutation(mutation);
    //         const { generateCustomerToken: { token } } = result;

    //         setAuthorizationToken(token);
    //         dispatch(updateCustomerSignInStatus(true));
    //         CartDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch));
    //         WishlistDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialWishlistData(dispatch));

    //         return true;
    //     } catch ([e]) {
    //         throw e;
    //     }
    // }

    signIn(options = {}, dispatch) {
        // const mutation = MyAccountQuery.getSignInMutation(options);
        //localStorage.setItem("phone", options.phone);
        let guestId = localStorage.getItem('guest_quote_id')
        if (guestId) {
            options.guest_quote_id = JSON.parse(guestId).guest_quote_id
        }
        const mutation = MyAccountQuery.getSignInByNumberMutation(options);
        return fetchQuery(mutation).then(
            () => dispatch(updateCustomerSignInStatus()),
            error => dispatch(showNotification('error', error[0].message))
        );
    }

    /**
     * Social Sign in action
     * @param {{email: String, firstname: String}} [options={}]
     * @memberof MyAccountDispatcher
     */
    async socialSignIn(options = {}, dispatch) {
        const mutation = MyAccountQuery.getSocialSignInMutation(options);

        try {
            const result = await fetchMutation(mutation);
            const { generateCustomerTokenSocialLogin: { token } } = result;

            setAuthorizationToken(token);
            dispatch(updateCustomerSignInStatus(true));
            /*CartDispatcher.updateInitialCartData(dispatch);
            WishlistDispatcher.updateInitialWishlistData(dispatch);*/
            CartDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialCartData(dispatch));
            WishlistDispatcher.then(({ default: dispatcher }) => dispatcher.updateInitialWishlistData(dispatch));

            return true;
        } catch ([e]) {
            throw e;
        }
    }
}

export default new MyAccountDispatcher();