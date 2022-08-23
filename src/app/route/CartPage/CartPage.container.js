/* eslint-disable react/prop-types */
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

import { CART, CART_EDITING } from 'Component/Header/Header.config';
import { CUSTOMER_ACCOUNT_OVERLAY_KEY } from 'Component/MyAccountOverlay/MyAccountOverlay.config';
import { CHECKOUT_URL } from 'Route/Checkout/Checkout.config';
import { updateMeta } from 'Store/Meta/Meta.action';
import { changeNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { showNotification } from 'Store/Notification/Notification.action';
import { toggleOverlayByKey } from 'Store/Overlay/Overlay.action';
import { HistoryType } from 'Type/Common';
import { TotalsType } from 'Type/MiniCart';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import isMobile from 'Util/Mobile';
import { appendWithStoreCode } from 'Util/Url';
import { _getCustomerLoyaltyPoints } from "../../query/Loyalty.query"
import TagManager from 'react-gtm-module';
import jQuery from 'jquery';
import { manageLoyaltyToggle } from "../../store/LoyaltyToggle/Loyalty.action"


import CartPage from './CartPage.component';

export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
    guest_checkout: state.ConfigReducer.guest_checkout,
    toggle: state.LoyaltyReducer.toggle
});

export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
    showOverlay: (overlayKey) => dispatch(toggleOverlayByKey(overlayKey)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateMeta: (meta) => dispatch(updateMeta(meta)),
    updateToggle: (toggle) => dispatch(manageLoyaltyToggle(toggle))
});

export class CartPageContainer extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        updateMeta: PropTypes.func.isRequired,
        guest_checkout: PropTypes.bool.isRequired,
        history: HistoryType.isRequired,
        totals: TotalsType.isRequired
    };

    state = { isEditing: false, pointsAvailable: 0, cashbackpercent: 0, isLoading: true , apistatus : false};


    containerFunctions = {
        onCheckoutButtonClick: this.onCheckoutButtonClick.bind(this),
        handleLoyaltyToggle: this.handleLoyaltyToggle.bind(this)
    };
    handleLoyaltyToggle(loyaltyToggle) {
        this.props.updateToggle(loyaltyToggle)
        localStorage.setItem('toggle', JSON.stringify({ toggle: loyaltyToggle }))
    }
    componentDidMount() {
        const { updateMeta } = this.props;

        updateMeta({ title: __('Shopping Bag') });

        let GtmDataLayerCartArgs = {
            dataLayer: {
                pageType: 'cart'
            }
        };
        TagManager.dataLayer(GtmDataLayerCartArgs);

        this._updateBreadcrumbs();
        this._changeHeaderState();
        this.getLoyaltyPointsAndCashback();
        // this.props.updateToggle(true)

    }
    getLoyaltyPointsAndCashback = async () => {
        try {
            const { data } = JSON.parse(localStorage.getItem("auth_token")) || { data: null }
            if (!data) {
                this.setState({
                    isLoading: false
                })
            }
            const response = await _getCustomerLoyaltyPoints(data)
            const { getCustomeLoyaltyPoints: { pointsAvailable = 0, cashbackpercent = 5  , apistatus = false} } = JSON.parse(response).data || {};
            this.setState({
                pointsAvailable, cashbackpercent, isLoading: false , apistatus
            })
        } catch (error) {
            this.setState({
                pointsAvailable: 0, cashbackpercent: 5, isLoading: false , apistatus : false
            })
        }
    }

    componentDidUpdate(prevProps) {
        const {
            changeHeaderState,
            totals: { items_qty },
            headerState,
            headerState: { name }
        } = this.props;

        const {
            totals: { items_qty: prevItemsQty },
            headerState: { name: prevName }
        } = prevProps;

        if (name !== prevName) {
            if (name === CART) {
                this._changeHeaderState();
            }
        }

        if (items_qty !== prevItemsQty) {
            const title = `${items_qty || '0'} Items`;
            changeHeaderState({
                ...headerState,
                title
            });
        }
    }

    onCheckoutButtonClick(e) {
        const {
            history,
            guest_checkout,
            showOverlay,
            showNotification
        } = this.props;

        // to prevent outside-click handler trigger
        e.nativeEvent.stopImmediatePropagation();

        /*if (guest_checkout) {
            history.push({
                pathname: appendWithStoreCode(CHECKOUT_URL)
            });

            return;
        }*/

        if (isSignedIn()) {
            history.push({
                pathname: appendWithStoreCode(CHECKOUT_URL)
            });

            return;
        }

        // fir notification whatever device that is
        showNotification('info', __('Please sign-in to get estimates!'));

        if (isMobile.any()) { // for all mobile devices, simply switch route
            history.push({ pathname: appendWithStoreCode('/my-account') });
            return;
        }

        jQuery(document).ready(function ($) {
            $('.Header-Button_type_account').click();
        });
        // for desktop, just open customer overlay
        //showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);
    }

    _updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            { url: '/cart', name: __('Shopping bag') },
            { url: '/', name: __('Home') }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    _changeHeaderState() {
        const { changeHeaderState, totals: { items_qty } } = this.props;
        const title = __('%s Items', items_qty || 0);

        changeHeaderState({
            name: CART,
            title,
            onEditClick: () => {
                this.setState({ isEditing: true });
                changeHeaderState({
                    name: CART_EDITING,
                    title,
                    onOkClick: () => this.setState({ isEditing: false }),
                    onCancelClick: () => this.setState({ isEditing: false })
                });
            },
            onCloseClick: () => {
                this.setState({ isEditing: false });
                history.goBack();
            }
        });
    }

    render() {
        return (
            <CartPage
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPageContainer);
