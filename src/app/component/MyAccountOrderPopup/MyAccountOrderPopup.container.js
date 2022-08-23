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
import { _getCustomerLoyaltyPoints } from 'Query/Loyalty.query';

import OrderQuery from 'Query/Order.query';
import { showNotification } from 'Store/Notification/Notification.action';
import { orderType } from 'Type/Account';
import { getIndexedProducts } from 'Util/Product';
import { fetchQuery } from 'Util/Request';

import MyAccountOrderPopup from './MyAccountOrderPopup.component';
import { ORDER_POPUP_ID } from './MyAccountOrderPopup.config';

export const OrderDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Order/Order.dispatcher'
);

export const mapStateToProps = (state) => ({
    order: state.OrderReducer.order,
    payload: state.PopupReducer.popupPayload[ORDER_POPUP_ID] || {},
    currency_code: state.ConfigReducer.default_display_currency_code
});

export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    getOrder: (orderId) => OrderDispatcher.then(({ default: dispatcher }) => dispatcher.getOrderById(dispatch, orderId))
});

export class MyAccountOrderPopupContainer extends PureComponent {
    static propTypes = {
        payload: PropTypes.shape({
            order: orderType,
            increment_id: PropTypes.string
        }).isRequired,
        showNotification: PropTypes.func.isRequired,
        getOrder: PropTypes.func.isRequired,
        currency_code: PropTypes.string.isRequired
    };

    state = {
        order: {},
        prevOrderId: 0,
        isLoading: true,
        cashbackpercent : 5
    };

    static getDerivedStateFromProps(props, state) {
        const { payload: { increment_id: id } } = props;
        const { prevOrderId } = state;

        if (prevOrderId === id) {
            return null;
        }

        return { order: {}, isLoading: true, prevOrderId: id };
    }

    componentDidUpdate(prevProps) {
        const { payload: { increment_id: prevId } } = prevProps;
        const { payload: { increment_id: id } } = this.props;

        if (id !== prevId) {
            this.requestOrderDetails();
        }
    }
    componentDidMount(){
        this.getLoyaltyPointsAndCashback()
    }

    containerProps = () => {
        const { order: stateOrder, isLoading , cashbackpercent} = this.state;
        const { payload: { order: payloadOrder }, currency_code } = this.props;

        return {
            isLoading,
            cashbackpercent,
            currency_code,
            order: {
                ...payloadOrder,
                ...stateOrder
            }
        };
    };
    getLoyaltyPointsAndCashback = async () => {
        try {
            const { data } = JSON.parse(localStorage.getItem("auth_token"))
            const response = await _getCustomerLoyaltyPoints(data);
            const responseData = JSON.parse(response).data;
            const getCustomeLoyaltyPoints = responseData.getCustomeLoyaltyPoints;
            const cashbackpercent = getCustomeLoyaltyPoints.cashbackpercent
            this.setState({
                 cashbackpercent,
            })
        } catch (error) {
            console.log(error,"error popou")
        }
    }

    requestOrderDetails() {
        const { payload: { order: { base_order_info } } } = this.props;

        fetchQuery(OrderQuery.getOrderByIdQuery(base_order_info.id)).then(
            ({ getOrderById: rawOrder }) => {
                const { order_products = [] } = rawOrder;
                const indexedProducts = getIndexedProducts(order_products);
                const order = { ...rawOrder, order_products: indexedProducts };
                order.base_order_info = { ...order.base_order_info, ...base_order_info };
                this.setState({ order, isLoading: false });
            },
            () => {
                showNotification('error', __('Error getting Order by ID!'));
                this.setState({ isLoading: false });
            }
        );
    }

    render() {
        return (
            <MyAccountOrderPopup
                {...this.containerProps()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderPopupContainer);
