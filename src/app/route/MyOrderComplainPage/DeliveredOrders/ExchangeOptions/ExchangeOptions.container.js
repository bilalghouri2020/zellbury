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
 import ExchangeOptions from './ExchangeOptions.component';
 import { showNotification } from 'Store/Notification/Notification.action';
 import { manageComplain } from 'Store/Complain/Complain.action';
 import { _storesListCheck } from 'Query/Complain.query';
 import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
 import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
 import moment from 'moment';
 
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
    setHeaderState: (headerState) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, headerState)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    updateComplain: (data) => dispatch(manageComplain(data))
});
 
 export class ExchangeOptionsContainer extends PureComponent {
    //  static propTypes = {
    //      getOrderList: PropTypes.func.isRequired
    //  };
     static propTypes = {
        showPopup: PropTypes.func.isRequired,
        hidePopup: PropTypes.func.isRequired,
        customer: customerType.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        updateComplain: PropTypes.func.isRequired,

    };

    containerFunctions = {
        showConfirmPopup: this.showConfirmPopup.bind(this),
    };

    state = {
        showExchangeOption: true,
    }
    

    checkStore = async () => {
        const customerData = JSON.parse(localStorage.getItem("customer"));
        const { complainData } = this.props;
        const lat = '10.0';
        const lng = '10.0';
        let currentDate = moment().format('DD-MM-YYYY HH:mm:ss');
        const res = await _storesListCheck(complainData.barcodeData.data.validateBarcode.order[0].city, currentDate, lat, lng);
        const parse = JSON.parse(res);
        if(parse && !parse.data.storeLocationList.length){
            this.setState({ showExchangeOption: false })
        }
        let customerName = customerData.data.firstname.split(' ')[0];
        this.setState({customerName: customerName})
    }

    componentDidMount(){
        const { complainData } = this.props;
        this.checkStore();
    }

    
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
             <ExchangeOptions
               { ...this.state }
               { ...this.props }
               { ...this.containerFunctions }
             />
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(ExchangeOptionsContainer);