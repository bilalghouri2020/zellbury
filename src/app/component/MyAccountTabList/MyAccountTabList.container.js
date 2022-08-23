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
import history from 'Util/History';

import MyAccountTabList from './MyAccountTabList.component';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const mapDispatchToProps = (dispatch) => ({
    logout: () => MyAccountDispatcher.then(({ default: dispatcher }) => dispatcher.logout(null, dispatch)),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
});

export class MyAccountTabListContainer extends PureComponent {
    static propTypes = {
        onSignOut: PropTypes.func,
        logout: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };

    static defaultProps = {
        onSignOut: () => { }
    };

    containerFunctions = {
        handleLogout: this.handleLogout.bind(this),
        handleComplain: this.handleComplain.bind(this)
    };

    handleLogout() {
        const { onSignOut, logout } = this.props;
        logout().then(z => {
            this.setState({ state: "signIn", isOverlayVisible: true, isSignedIn: false }, () => {
            });
        });

    }
    goBack() {
        const { checkoutStep } = this.state;

        if (checkoutStep === BILLING_STEP) {
            this.setState({
                isLoading: false,
                checkoutStep: SHIPPING_STEP
            });

            BrowserDatabase.setItem(BrowserDatabase.getItem(PAYMENT_TOTALS), 'checkout_success', 3600)
            BrowserDatabase.deleteItem(PAYMENT_TOTALS);
        }

        history.goBack();
    }

    handleComplain() {
        const { setHeaderState } = this.props;
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
        history.push('/ordercomplain/orderslist');
    }

    render() {
        return (
            <MyAccountTabList
                {...this.props}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(MyAccountTabListContainer);
