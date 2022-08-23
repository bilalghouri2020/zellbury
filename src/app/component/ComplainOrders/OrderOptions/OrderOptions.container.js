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

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 import { connect } from 'react-redux';
 
 import OrderOptions from './OrderOptions.component';
 import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

 export const OrderDispatcher = import(
     /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
     'Store/Order/Order.dispatcher'
 );
 
 export const mapStateToProps = (state) => ({
     orderList: state.OrderReducer.orderList,
     isLoading: state.OrderReducer.isLoading
 });
 
 export const mapDispatchToProps = (dispatch) => ({
     getOrderList: () => OrderDispatcher.then(
         ({ default: dispatcher }) => dispatcher.requestOrders(dispatch)
     ),
     setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
 });
 
 export class OrderOptionsContainer extends PureComponent {
     static propTypes = {
         getOrderList: PropTypes.func.isRequired
     };
     render() {
         return (
             <OrderOptions
               { ...this.props }
             />
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(OrderOptionsContainer);