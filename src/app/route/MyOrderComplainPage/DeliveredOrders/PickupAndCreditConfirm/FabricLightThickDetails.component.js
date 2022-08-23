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

import './FabricLightThickDetails.style';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { orderType } from 'Type/Account';
import { _cancelOrder, _orderDetailById } from 'Query/Complain.query';
import history from 'Util/History';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
// import history from 'Util/History';
export class FabricLightThickDetails extends PureComponent {
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


    contactSupportHandler = (dataContactSupport) => {
        
        history.push('/ordercomplain/delivered-orders/exchange-order', dataContactSupport)
    }

    renderContent() {
        const { location, complainData } = this.props;
        const { success } = this.state;
        return (
            <div className="fabric-light-thick-detail-section">
                <div class="detail-section">
                    {/* <h3>Please take a picture</h3> */}
                    {
                        this.props.checkCondition === 'Fabric is very light' ? (
                            <>
                                <h4 className="fabric-message">The fabric you have ordered is from our {this.props.collection} {this.props.fabric} is usually designed to last hot & humid weather. <hr />  Our {this.props.fabric} quality is as high as any other brand.</h4>
                                <button type="text" onClick={() => this.contactSupportHandler("light")} className="submitBtnDetail">Contact Support</button>
                            </>
                        ) : (
                            <>
                                <h4 className="fabric-message">Our fabric is carefully crafted to last hot & </h4>
                                <button type="text" onClick={() => this.contactSupportHandler('thick')} className="submitBtnDetail">Contact Support</button>
                            </>
                        )
                    }
                </div>
            </div>
        )
    }

    handlePopupConfirm = () => {
        const { hidePopup, setHeaderState } = this.props;
        hidePopup();
        setHeaderState({ name: 'order-complain' });
    }

    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="Are you sure?" handlePopupConfirm={this.handlePopupConfirm} />
    }

    render() {

        return (
            <>
                <div className="centered">
                    {this.renderContent()}
                    {this.renderConfirmPopup()}

                </div>

            </>
        );
    }
}


export default FabricLightThickDetails;