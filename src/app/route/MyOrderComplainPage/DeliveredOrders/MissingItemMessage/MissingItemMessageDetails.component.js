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

import './MissingItemMessageDetails.style';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { orderType } from 'Type/Account';
import { _cancelOrder, _orderDetailById } from 'Query/Complain.query';
import history from 'Util/History';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
// import history from 'Util/History';
export class MissingItemMessageDetails extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        showNotification: PropTypes.func.isRequired,
        order: orderType.isRequired,
        complainData: PropTypes.object.isRequired,
        showConfirmPopup: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };

    state = {
        address: null,
        fieldValid: true,
        errorMsg: "",
        quantity: 1,
    }

    // componentDidMount() {
    //     const { complainData } = this.props;
    //     if (!complainData) {
    //         history.push("/ordercomplain/orderslist");
    //     }
    // }


    contactSupportHandler = () => {
        history.push('/ordercomplain/orderslist');
        // history.push('/ordercomplain/delivered-orders/exchange-order', dataContactSupport)
    }

    renderContent() {
        const { location, complainData } = this.props;
        console.log(this.props, 'this.props');
        console.log(complainData, 'complainData');
        const { success } = this.state;

        if (complainData?.orderData?.orderOption === 'incompleteOrder') {
            if (complainData?.orderData?.subOption === "Complete item is missing") {
                return (
                    <>
                        <h3 className="fabric-message">We have received your complaint. Our Customer service team will get in touch with you within 24 hours. Thank you for patience</h3>
                        <button type="text" onClick={this.contactSupportHandler} className="submitBtnDetail">Close</button>
                    </>
                )
            } else {
                return (
                    <>
                        <h3 className="fabric-message">We have received your complaint. Our Customer service team will get in touch with you within 24 hours. Thank you for patience</h3>
                        <button type="text" onClick={this.contactSupportHandler} className="submitBtnDetail">Close</button>
                    </>
                )
            }
        } else {
            history.push('/ordercomplain/orderslist');
        }
        return;

        // return (
        //     <div className="fabric-light-thick-detail-section">
        //         <div class="detail-section">
        //             {/* <h3>Please take a picture</h3> */}
        //             {
        //                 complainData.orderData.orderOption === "incompleteOrder" ?



        //             }
        //             {
        //                 this.props.checkCondition === 'Fabric is very light' ? (
        //                     <>
        //                         <h4 className="fabric-message">The fabric you have ordered is from our {this.props.collection} {this.props.fabric} is usually designed to last hot & humid weather. <hr />  Our {this.props.fabric} quality is as high as any other brand.</h4>
        //                         <button type="text" onClick={() => this.contactSupportHandler("light")} className="submitBtnDetail">Contact Support</button>
        //                     </>
        //                 ) : (
        //                     <>
        //                         <h4 className="fabric-message">The fabric you have ordered is from our {this.props.collection} {this.props.fabric} is usually designed to last hot & humid weather. <hr />  Our {this.props.fabric} quality is as high as any other brand.</h4>
        //                         <button type="text" onClick={() => this.contactSupportHandler('thick')} className="submitBtnDetail">Contact Support</button>
        //                     </>
        //                 )
        //             }
        //         </div>
        //     </div>
        // )
    }

    handlePopupConfirm = () => {
        const { hidePopup, setHeaderState } = this.props;
        hidePopup();
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
    }

    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="Are you sure?" handlePopupConfirm={this.handlePopupConfirm} />
    }

    render() {

        return (
            <>
                <div className="centered" style={{ padding: '150px 20px 50px' }}>
                    {this.renderContent()}
                    {this.renderConfirmPopup()}
                    {/* hellow rodladsf;lasdhfl; ahsdljfh alsdjkfhadsj fh */}
                </div>

            </>
        );
    }
}


export default MissingItemMessageDetails;