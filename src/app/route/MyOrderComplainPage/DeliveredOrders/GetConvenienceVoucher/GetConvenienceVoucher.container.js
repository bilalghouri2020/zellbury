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
 import GetConvenienceVoucher from './GetConvenienceVoucher.component';
 
 export const OrderDispatcher = import(
     /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
     'Store/Order/Order.dispatcher'
 );
 
 export const mapStateToProps = (state) => ({
    customer: state.MyAccountReducer.customer
});
 
 export const mapDispatchToProps = (dispatch) => ({
    showPopup: (payload) => dispatch(showPopup(CONFIRM_POPUP_ID, payload)),
    hidePopup: () => dispatch(showPopup('', {}))
});
 
 export class GetConvenienceVoucherContainer extends PureComponent {
    //  static propTypes = {
    //      getOrderList: PropTypes.func.isRequired
    //  };
     static propTypes = {
        showPopup: PropTypes.func.isRequired,
        hidePopup: PropTypes.func.isRequired,
        customer: customerType.isRequired
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
             <GetConvenienceVoucher
               { ...this.props }
               { ...this.containerFunctions }
             />
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(GetConvenienceVoucherContainer);