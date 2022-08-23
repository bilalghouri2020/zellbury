import './ParcelStatus.style';
import CheckIcon from '@material-ui/icons/CheckCircleOutlined';
import BrowserDatabase from 'Util/BrowserDatabase';
import React from 'react';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import OrderStatusStepper from "Component/OrderStatusStepper"
import OrderStatusLeopards from "Component/OrderStatusLeopards"
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'Component/Loader';
import MyAccountOrderPopup from 'Component/MyAccountOrderPopup';
import MyAccountOrderTableRow from 'Component/MyAccountOrderTableRow';
import { ordersType } from 'Type/Account';
import isMobile from 'Util/Mobile';
import BottomSheet from 'Component/BottomSheet'

export class ParcelStatus extends PureComponent {

    static propTypes = {
        orderList: ordersType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderPopup() {
        return <MyAccountOrderPopup />;
    }

    renderNoOrders() {
        return (
            <tr block="MyAccountMyOrders" elem="NoOrders">
                { /* eslint-disable-next-line no-magic-numbers */}
                <td colSpan={isMobile.any() ? 3 : 4}>{__('You have no orders.')}</td>
            </tr>
        );
    }

    renderOrderHeadingRow() {
        return (
            <tr>
                <th>{__('Order')}</th>
                <th>{__('Date')}</th>
                <th>{__('Status')}</th>
                <th block="hidden-mobile">{__('Total')}</th>
            </tr>
        );
    }

    renderTable() {
        return (
            <table block="MyAccountMyOrders" elem="Table">
                <thead>
                    {this.renderOrderHeadingRow()}
                </thead>
                <tbody>
                    {this.renderOrderRows()}
                </tbody>
            </table>
        );
    }

    renderOrderRow = (order) => {
        const { base_order_info: { id } } = order;

        return (
            <MyAccountOrderTableRow
                key={id}
                redirectForStatus={true}
                order={order}
            />
        );
    };

    renderOrderRows() {
        const { orderList, isLoading } = this.props;
        
        if (!isLoading && !orderList.length) {
            return this.renderNoOrders();
        }
        const userData = BrowserDatabase.getItem('customer'); //JSON.parse(localStorage.getItem('customer'));
        if (!userData) {
            userData = {firstname:''};
        }
        const orders = orderList.length
            ? orderList
            : Array.from({ length: 10 }, (_, id) => ({ base_order_info: { id } }));
        let hours = 48 * 60 * 60 * 1000; /* ms */
        // return orders.filter(x => x.base_order_info.status_label && ((x.base_order_info.status_label.toLowerCase() == 'processing' || x.base_order_info.status_label.toLowerCase() == 'pending') || (x.base_order_info.status_label.toLowerCase() == 'complete' && (new Date() - new Date(x.base_order_info.created_at)) < hours))).reduceRight(
        //     (acc, e) => [...acc, this.renderOrderRow(e)],
        //     []
        // );
        let filteredOrders = orders.filter(x => x.base_order_info.status_label && ((x.base_order_info.status_label.toLowerCase() == 'processing' || x.base_order_info.status_label.toLowerCase() == 'shipped' || x.base_order_info.status_label.toLowerCase() == 'pending') || (x.base_order_info.status_label.toLowerCase() == 'complete' && (new Date() - new Date(x.base_order_info.created_at)) < hours)));

        return (<>{filteredOrders.length > 0 && <BottomSheet orders={filteredOrders} userData={userData}></BottomSheet>}</>)
    }
    
   
    
    
   
    render() {
        const { isLoading } = this.props;
        
        
        return (
            <div block="MyAccountMyOrders">
                <Loader isLoading={isLoading} />
                {/* { this.renderTable()} */}
               
               {this.renderOrderRows()}
                
            </div>
        );
    }
}
export default ParcelStatus;