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

import './OverchargedOptions.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import history from 'Util/History';
import axios from 'axios';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';

import Loader from 'Component/Loader';
let countForTicket = 0
export class OverchargedOptions extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        handleSubOptionChange: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        complainData: PropTypes.object.isRequired,
        showConfirmPopup: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };

    state = {
        riderOption: "",
    }

    setRiderOption = (event) => {
        const { showConfirmPopup } = this.props;
        const { riderOption } = this.state;
        console.log("riderOption", event.target.value);
        this.setState({ riderOption: event.target.value })
        showConfirmPopup();
    }

    renderContent() {

        //  console.log("this.props in order opt", this.props);

        return (
            <div className='overchargedSection'>
                <h4> We are sorry you have been overcharged, please select the details below so we will look into it for you</h4>

                <div className="orderOptCenteredSecOvercharged">
                    <div className="overchargedButtonsSec" block="OrderStatusComplain" elem="Buttons">
                        <button
                            className="optionsBtnOver"
                            type="text"
                            value="Rider didn’t provided the change"
                            onClick={this.setRiderOption}
                            // block={item.label}
                            elem="Button"
                            mix={{ block: 'Button' }}
                        >
                            {__(`Rider didn’t provided the change`)}
                        </button>
                    </div>
                    <div className="overchargedButtonsSec" block="OrderStatusComplain" elem="Buttons">
                        <button
                            className="optionsBtnOver"
                            type="text"
                            value="Rider demand extra payment"
                            onClick={this.setRiderOption}
                            // block={item.label}
                            elem="Button"
                            mix={{ block: 'Button' }}
                        >
                            {__(`Rider demand extra payment`)}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="The case is escalated to the concerned team and you'll be contacted within 4 hours by our specialist on this concern." handlePopupConfirm={this.handlePopupConfirm} />
    }

    submitFreshDeskTicket = () => {
        if (countForTicket === 0) {
            countForTicket++
            const { location, complainData, showNotification, setHeaderState } = this.props;
            const { riderOption } = this.state;
            let dataObj = {};
            let customer = JSON.parse(localStorage.getItem('customer'));
            dataObj['email'] = `${customer.data.email}`;
            dataObj['subject'] = `${riderOption} - ${complainData.orderData.orderData.increment_id} `;
            dataObj['group_id'] = 82000622276;
            dataObj['type'] = "Rider Payments Complaints";
            dataObj['priority'] = 3;
            dataObj['status'] = 2;
            dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
            let data = JSON.stringify(dataObj);
            var config = {
                method: 'post',
                url: 'https://newaccount1631100479992.freshdesk.com/api/v2/tickets',
                headers: {
                    'Authorization': 'Basic aGY2MWJqQkdOU1lsNndRZzA5Uzp4',
                    'Content-Type': 'application/json',
                    'Cookie': '_x_w=2'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    showNotification('success', __('Ticket Submitted Successfully'));
                    setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
                    history.push("/ordercomplain/orderslist");
                    countForTicket--
                })
                .catch(function (error) {
                    console.log(error);
                    countForTicket--
                });
        }
    }

    handlePopupConfirm = () => {
        const { hidePopup, setHeaderState } = this.props;
        hidePopup();
        this.submitFreshDeskTicket()
    }

    render() {
        return (
            <>
                {this.renderContent()}
                {this.renderConfirmPopup()}
            </>
        )
    }
}

export default OverchargedOptions;