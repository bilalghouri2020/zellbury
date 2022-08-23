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

 import { LOYALTY_TOGGLE } from './Loyalty.action';
 
 const toggleState = JSON.parse(localStorage.getItem("toggle")) ? JSON.parse(localStorage.getItem("toggle")).toggle : true;

 export const initialState = {
    toggle: toggleState
 };
 
 export const LoyaltyReducer = (state = initialState, action) => {
     const { toggle, type } = action;
 
     switch (type) {
     case LOYALTY_TOGGLE:
         return { ...state, toggle };
     default:
         return state;
     }
 };
 
 export default LoyaltyReducer;
 