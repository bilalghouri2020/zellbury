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
import SampleQRCode from './SampleQRCode.component';
import { showNotification } from 'Store/Notification/Notification.action';
import { manageComplain } from 'Store/Complain/Complain.action';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

export const mapStateToProps = (state) => ({
    totals: state.CartReducer.cartTotals,
    wishlistItems: state.WishlistReducer.productsInWishlist,
    complainData: state.ComplainReducer.payload,
});

export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateComplain: (data) => dispatch(manageComplain(data)),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
});

export class SampleQRCodeContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        updateComplain: PropTypes.func.isRequired
    };

    render() {
        return (
            <SampleQRCode
                {...this.props}
                {...this.state}
            />
        );
    }
}

// export default SampleQRCodeContainer
export default connect(mapStateToProps, mapDispatchToProps)(SampleQRCodeContainer);
