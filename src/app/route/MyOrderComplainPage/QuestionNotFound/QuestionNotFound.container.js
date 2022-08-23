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
 
 import QuestionNotFound from './QuestionNotFound.component';
 import BrowserDatabase from 'Util/BrowserDatabase';
 import {
    COMPLAIN_CONFIRM,
    CONFIRM_POPUP_ID
} from 'Component/ExchangeFromStorePopup';
 import { showNotification } from 'Store/Notification/Notification.action';
 import { showPopup } from 'Store/Popup/Popup.action';
 import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation/Navigation.action';
 import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
 import history from 'Util/History';

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
 
 export class QuestionNotFoundContainer extends PureComponent {
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

     componentDidMount(){
        const { complainData } = this.props;
        if(!complainData){
            history.push('/ordercomplain/orderslist');
        }
     }


 
     render() {
         return (
             <>
                <QuestionNotFound
                    { ...this.props }
                    {...this.state}
                />
             </>
             
         );
     }
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(QuestionNotFoundContainer);