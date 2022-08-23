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

 import { COMPLAIN } from './Complain.action';
 
 
 export const initialState = {
    data: {}
 };
 
 export const ComplainReducer = (state = initialState, action) => {
     const { payload, type } = action;
 
     switch (type) {
     case COMPLAIN:
         return { ...state, payload };
     default:
         return state;
     }
 };
 
 export default ComplainReducer;
 