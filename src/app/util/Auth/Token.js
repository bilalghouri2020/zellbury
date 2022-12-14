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

import BrowserDatabase from 'Util/BrowserDatabase';

export const AUTH_TOKEN = 'auth_token';

export const USER_TOKEN = 'user_token';

export const DELETE_NUMBER = 'phone';

export const ONE_HOUR = (3600*24)*165; //10 days

export const setAuthorizationToken = (token) => BrowserDatabase.setItem(token, AUTH_TOKEN, ONE_HOUR);

export const deleteAuthorizationToken = () => BrowserDatabase.deleteItem(AUTH_TOKEN);

export const deleteUserToken = () => BrowserDatabase.deleteItem(USER_TOKEN);

export const deleteNumber = () => BrowserDatabase.deleteItem(DELETE_NUMBER);

export const getAuthorizationToken = () => BrowserDatabase.getItem(AUTH_TOKEN);

export const isSignedIn = () => !!getAuthorizationToken();
