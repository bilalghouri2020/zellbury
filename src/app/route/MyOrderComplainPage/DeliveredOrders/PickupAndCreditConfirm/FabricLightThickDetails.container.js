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

import FabricLightThickDetails from './FabricLightThickDetails.component';
import {
    COMPLAIN_CONFIRM,
    CONFIRM_POPUP_ID
} from 'Component/ExchangeFromStorePopup';
import { showNotification } from 'Store/Notification/Notification.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

export const OrderDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Order/Order.dispatcher'
);

export const mapStateToProps = (state) => ({
    orderList: state.OrderReducer.orderList,
    isLoading: state.OrderReducer.isLoading,
    complainData: state.ComplainReducer.payload,
    showPopup: PropTypes.func.isRequired,
    hidePopup: PropTypes.func.isRequired,
    setHeaderState: PropTypes.func.isRequired,
});

export const mapDispatchToProps = (dispatch) => ({
    getOrderList: () => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestOrders(dispatch)
    ),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    showPopup: (payload) => dispatch(showPopup(CONFIRM_POPUP_ID, payload)),
    hidePopup: () => dispatch(showPopup('', {})),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
});

class FabricLightThickDetailsContainer extends PureComponent {
    static propTypes = {
        getOrderList: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        showPopup: PropTypes.func.isRequired,
        hidePopup: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };

    state = {
        order: {},
        packet_list: {},
        TrackingDetail: [],
    }

    containerFunctions = {
        showConfirmPopup: this.showConfirmPopup.bind(this),
    };

    showConfirmPopup() {
        const { showPopup } = this.props;
        showPopup({
            action: COMPLAIN_CONFIRM,
            title: "",
            customerOrder: {}
        });
    }

    // componentDidMount() {
    //     const { location, complainData } = this.props;
    //     if (complainData) {
    //         // console.log('location', location.state.orderData.orderId);
    //         this.requestTrackingDetails(complainData.getOrderById.base_order_info.increment_id);
    //     } else {
    //         // history.push('/ordercomplain/orderslist');
    //     }
    // }


    // callOneSignal(order_id) {
    //     //const { match: { params: { orderid } } } = this.props;
    //     let user = BrowserDatabase.getItem('customer');
    //     if (order_id && user.customer_id) {
    //         fetch(`${window.location.origin}/onesignal?CustomerId=${user.customer_id}&OrderId=${order_id}`)
    //             .then(res => res.json())
    //             .then(
    //                 (result) => {
    //                     //window.location.href = `${result.page_url}${result.Data.SESSION_ID}`;
    //                 },
    //                 this._handleError
    //             )
    //     }

    // }

    //  requestOrderDetails(order_id) {
    //     return fetchQuery(OrderQuery.getOrderByIdQuery(parseInt(order_id))).then(
    //         (resOrder) => {
    //             let { getOrderById } = resOrder;

    //             console.log('resOrder', resOrder);
    //             // this.requestTrackingDetails(getOrderById.base_order_info.increment_id);

    //             // this.callOneSignal(getOrderById.base_order_info.id);
    //             //this.requestTrackingDetails('7001016969');
    //             let orders = BrowserDatabase.getItem('orders');
    //             if (orders && (orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id) > -1)) {
    //                 let indexOfOrder = orders.findIndex(x => x.base_order_info.id == getOrderById.base_order_info.id);
    //                 getOrderById.base_order_info.delivery_date = orders[indexOfOrder].base_order_info.delivery_date;
    //             }
    //             this.setState({ order: getOrderById });
    //             return getOrderById
    //         },
    //         (err) => {
    //             this.setState({ isLoading: false });
    //             // showNotification('error', __('Error getting Order by ID!'));
    //         }
    //     );
    // }

    render() {
        return (
            <>
                {/* {this. requestOrderDetails(38653)} */}
                <FabricLightThickDetails
                    {...this.props}
                    {...this.state}
                    {...this.containerFunctions}
                />
            </>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FabricLightThickDetailsContainer);