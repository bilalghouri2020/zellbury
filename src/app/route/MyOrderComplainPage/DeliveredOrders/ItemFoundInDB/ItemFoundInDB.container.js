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
import ItemFoundInDB from './ItemFoundInDB.component';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';

// import { showNotification } from 'Store/Notification/Notification.action';
// import { manageComplain } from 'Store/Complain/Complain.action';
 
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
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    // updateComplain: (data) => dispatch(manageComplain(data)),
    hidePopup: () => dispatch(showPopup('', {})),
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
});
 
 export class ItemFoundInDBContainer extends PureComponent {
    //  static propTypes = {
    //      getOrderList: PropTypes.func.isRequired
    //  };
     static propTypes = {
        showPopup: PropTypes.func.isRequired,
        hidePopup: PropTypes.func.isRequired,
        customer: customerType.isRequired,
        showNotification: PropTypes.func.isRequired,
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
             <ItemFoundInDB
               {...this.state}
               { ...this.props }
               { ...this.containerFunctions }
             />
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(ItemFoundInDBContainer);