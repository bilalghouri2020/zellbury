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
 import {
    COMPLAIN_CONFIRM,
    CONFIRM_POPUP_ID
} from 'Component/ExchangeFromStorePopup';
import { customerType } from 'Type/Account';
import { showPopup } from 'Store/Popup/Popup.action';
import ProductPicture from './ProductPicture.component';
import { showNotification } from 'Store/Notification/Notification.action';
import { manageComplain } from 'Store/Complain/Complain.action';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

 export const OrderDispatcher = import(
     /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
     'Store/Order/Order.dispatcher'
 );
 
 export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer,
    complainData: state.ComplainReducer.payload,
});
 
 export const mapDispatchToProps = (dispatch) => ({
    showPopup: (payload) => dispatch(showPopup(CONFIRM_POPUP_ID, payload)),
    hidePopup: () => dispatch(showPopup('', {})),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
    updateComplain: (data) => dispatch(manageComplain(data)),
});
 
 export class ProductPictureContainer extends PureComponent {
    //  static propTypes = {
    //      getOrderList: PropTypes.func.isRequired
    //  };
     static propTypes = {
        showPopup: PropTypes.func.isRequired,
        hidePopup: PropTypes.func.isRequired,
        customer: customerType.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };

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

     render() {
         return (
             <ProductPicture
               { ...this.props }
               { ...this.state }
               { ...this.containerFunctions }
             />
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(ProductPictureContainer);