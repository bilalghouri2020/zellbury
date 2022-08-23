/* eslint-disable no-useless-escape */
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

import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";

const clientAPI = new ApolloClient({
    uri: window.location.protocol+'//'+window.location.hostname+'/graphql'
});
let matchCities;
let fetchPkCities;

clientAPI.query({
    query: gql`
{
    PkCities {
    id
    label
}
}
`
}).then(result => {
    if(result.data) {
    if(result.data.PkCities)
    {
        fetchPkCities = result.data.PkCities;
        matchCities = fetchPkCities.map(city => (city.label));
    }
    else
    {
        matchCities = [];
    }
} else {
    matchCities = [];
}
});

export const MIN_PASSWORD_LENGTH = 8;

export const validateEmail = ({ value }) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
export const validateEmails = ({ value }) => value.split(',').every((email) => validateEmail({ value: email.trim() }));
export const validatePassword = ({ value }) => value.length >= MIN_PASSWORD_LENGTH;
export const validateTelephone = ({ value }) => value.length > 0 && value.match(/^\+(?:[0-9-] ?){6,14}[0-9]$/);
export const isNotEmpty = ({ value }) => value.trim().length > 0;
export const validatePasswordMatch = ({ value }, { password }) => {
    const { current: { value: passwordValue } } = password || { current: {} };
    return value === passwordValue;
};

export default {
    otp:{
        validate: ({ value }) => {return value.match(/^[0-9]{4}$/)},
        message: __('You have entered incomplete OTP next line Please enter 4 digit OTP received on your number')
    },
    tel_mask:{
       validate: ({ value }) => { return value.replace(/ /g,'').match(/^\d{9}$/)},
            message: __('Please enter valid 10 digit mobile number 3xxxxxxxxx!')
    },
    email: {
        validate: validateEmail,
        message: __('Please enter a valid email address.')
    },
    emails: {
        validate: validateEmails,
            message: __('Email addresses are not valid')
    },
    password: {
        validate: validatePassword,
            message: __('Password should be at least 8 characters long')
    },
    telephone: {
        validate: validateTelephone,
        message: __('Mobile number is invalid!')
    },
    telephonePk: {
        validate: ({ value }) => {
            return value.match(/^([0-9]{10})$/)
        },
        message: __('Please enter valid 10 digit mobile number with country code !')
    },
    notEmpty: {
        validate: isNotEmpty,
        message: __('This field is required!')
    },
    password_match: {
        validate: validatePasswordMatch,
        message: __('Password does not match.')
    },
    fullName: {
        validate: ({ value }) => value.match(/^[a-zA-Z-.]{1,}\s*(?: [a-zA-Z-.]{1,}\s*){1,5}$/),
            message: __('Please enter your full name!')
    },
    completeAddress: {
        validate: ({ value }) => {return value.match(/^.{1,}\s*(?: .{1,}\s*){3,19}$/)},
            message: __('Please enter your complete delivery address!')
    },
    selectCity: {
        validate: ({ value }) => value.length > 0,
            message: __('Please select your delivery city!')
    },
    enterCity: {
        validate: ({ value }) => value.length > 0,
            message: __('Please enter your city!')
    },
    matchCity: {
        validate: ({ value }) => matchCities.indexOf(value) > -1,
            message: __('Please select any city from the suggested list!')
    },
    selectState: {
        validate: ({ value }) => value.length > 0,
            message: __('Please select your delivery state!')
    },
    enterState: {
        validate: ({ value }) => value.length > 0,
            message: __('Please enter your state!')
    },
    enterZip: {
        validate: ({ value }) => value.length > 0,
            message: __('Please enter your zipcode!')
    },
    numberOnly: {
        validate: ({ value }) => value.match(/^[0-9-+()]*$/),
            message: __('Mobile number is invalid!')
    }
};
