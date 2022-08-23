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
import { PureComponent } from 'react';
import OrdersListing from './OrdersListing.component';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CUSTOMER_ACCOUNT, CUSTOMER_ACCOUNT_PAGE } from 'Component/Header/Header.config';
import { showNotification } from 'Store/Notification/Notification.action';
import { manageComplain } from 'Store/Complain/Complain.action';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
// import { fetchQuery } from 'Util/Request';
// import OrderQuery from 'Query/Order.query';

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    changeHeaderState: PropTypes.func.isRequired,
    isLoading: state.UrlRewritesReducer.isLoading,
    setHeaderState: PropTypes.func.isRequired,
});

export const mapDispatchToProps = (dispatch) => ({
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    requestCustomerData: () => MyAccountDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch),
    ),
    toggleOverlayByKey: (key) => dispatch(toggleOverlayByKey(key)),
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateComplain: (data) => dispatch(manageComplain(data)),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
});

export class OrdersListingContainer extends PureComponent {
    static propTypes = {
        changeHeaderState: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
    };

    // requestOrderDetails() {
    //     const { payload: { order: { base_order_info } } } = this.props;

    //     fetchQuery(OrderQuery.getOrderByIdQuery(base_order_info.id)).then(
    //         ({ getOrderById: rawOrder }) => {
    //             console.log('rawOrder', rawOrder);

    //             // const { order_products = [] } = rawOrder;
    //             // const indexedProducts = getIndexedProducts(order_products);
    //             // const order = { ...rawOrder, order_products: indexedProducts };
    //             // order.base_order_info = { ...order.base_order_info, ...base_order_info };
    //             // this.setState({ order, isLoading: false });
    //         },
    //         () => {
    //             showNotification('error', __('Error getting Order by ID!'));
    //             this.setState({ isLoading: false });
    //         }
    //     );
    // }

    render() {
        return (
            <OrdersListing
                {...this.props}
                {...this.state}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersListingContainer);
