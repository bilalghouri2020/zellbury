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

 import './MyOrdersListing.style';

 import PropTypes from 'prop-types';
//  import { PureComponent } from 'react';
 
 import Loader from 'Component/Loader';
//  import MyAccountOrderPopup from 'Component/MyAccountOrderPopup';
 import MyAccountOrderTableRow from 'Component/MyAccountOrderTableRow';
 import { ordersType } from 'Type/Account';
 import isMobile from 'Util/Mobile';
import { Component } from 'react';
import moment from 'moment';
 
 export class MyOrdersListing extends Component {
     static propTypes = {
         orderList: ordersType.isRequired,
         isLoading: PropTypes.bool.isRequired,
         handleChangeOrder: PropTypes.func.isRequired,
         ordersList: PropTypes.array.isRequired,
     };

     state = {
        isLoading: false
    };
 
     renderNoOrders() {
         return (
             <tr block="MyOrdersListing" elem="NoOrders">
                 { /* eslint-disable-next-line no-magic-numbers */ }
                 <td colSpan={ isMobile.any() ? 3 : 4 }>{ __('You have no orders.') }</td>
             </tr>
         );
     }
 
     renderOrderHeadingRow() {
         return (
             <tr>
                 <th>{ __('Order') }</th>
                 <th>{ __('Date') }</th>
                 <th>{ __('Status') }</th>
                 {/* <th block="hidden-mobile">{ __('Total') }</th> */}
             </tr>
         );
     }
 
     renderTable() {
         return (
             <table block="MyOrdersListing" elem="Table">
                 <thead>
                     { this.renderOrderHeadingRow() }
                 </thead>
                 <tbody>
                     { this.renderOrderRows() }
                 </tbody>
             </table>
         );
     }
 
     renderOrderRow = (order) => {
         const { base_order_info: { id } } = order;
 
         return (
             <MyAccountOrderTableRow
               key={ id }
               order={ order }
             />
         );
     };
 
     renderOrderRows() {
        //  const { orderList, isLoading } = this.props;
         const { isLoading, handleChangeOrder, ordersList } = this.props;
        
        //  console.log('myOrders1', ordersList);
        //  if (!isLoading && !orderList.length) {
        //      return this.renderNoOrders();
        //  }

         
        if(ordersList && ordersList.length > 0 ){
            return ordersList.map((item) => {
                if((item.status_label.split('_'))[0] !== 'closed' && item.status_label !== 'Undelivered' && item.status_label !== 'canceled'){
                    return (
                        <tr onClick={() => handleChangeOrder(item)} className='TableList'>
                            <td>{item.increment_id}</td>
                            <td>{moment(item.created_at).format('DD-MMM-YY')}</td>
                            <td>{item.status_label}</td>
                        </tr>
                    )
                }
                return
             })
        }else{
            return (
                <tr>
                    <td>No Orders Found</td>
                </tr>
            )
        }
        
        //  const orders = orderList.length
        //      ? orderList
        //      : Array.from({ length: 10 }, (_, id) => ({ base_order_info: { id } }));
         
        //  return orders.reduceRight(
        //      (acc, e) => [...acc, this.renderOrderRow(e)],
        //      []
        //  );
     }
 
     render() {
         const { isLoading } = this.state;
        console.log("isLoading in orderslisting1", isLoading);
         return (
             <div block="MyOrdersListing">
                 <Loader isLoading={ isLoading } />
                 <h3>Please select your order</h3>
                 { this.renderTable() }
                 {/* { this.renderPopup() } */}
             </div>
         );
     }
 }
 
 export default MyOrdersListing;
 