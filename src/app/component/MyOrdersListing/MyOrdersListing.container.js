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
 
 import MyOrdersListing from './MyOrdersListing.component';
 
 export const OrderDispatcher = import(
     /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
     'Store/Order/Order.dispatcher'
 );
 
 export const mapStateToProps = (state) => ({
     orderList: state.OrderReducer.orderList,
     isLoading: state.OrderReducer.isLoading,
    //  ordersOptions: PropTypes.array.isRequired,
 });
 
 export const mapDispatchToProps = (dispatch) => ({
    //  getOrderList: () => OrderDispatcher.then(
    //      ({ default: dispatcher }) => dispatcher.requestOrders(dispatch)
    //  )
 });
 
 export class MyOrdersListingContainer extends PureComponent {
     static propTypes = {
        //  getOrderList: PropTypes.func.isRequired
     };
 
     componentDidMount() {
         const { getOrderList } = this.props;
        //  getOrderList();
     }
 
     render() {
         return (
             <MyOrdersListing
               { ...this.props }
             />
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(MyOrdersListingContainer);
 