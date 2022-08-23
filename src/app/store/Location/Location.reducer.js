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

 import { COORDS } from './Location.action';
 
 
 export const initialState = {
    coords: {}
 };
 
 export const LocationReducer = (state = initialState, action) => {
     const { coords, type } = action;
 
     switch (type) {
     case COORDS:
         return { ...state, coords };
     default:
         return state;
     }
 };
 
 export default LocationReducer;
 