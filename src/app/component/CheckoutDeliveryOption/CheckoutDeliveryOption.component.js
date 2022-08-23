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

import './CheckoutDeliveryOption.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { shippingMethodType } from 'Type/Checkout';
import { TotalsType } from 'Type/MiniCart';
import { formatCurrency, roundPrice } from 'Util/Price';

export class CheckoutDeliveryOption extends PureComponent {
    static propTypes = {
        option: shippingMethodType.isRequired,
        onClick: PropTypes.func.isRequired,
        isSelected: PropTypes.bool,
        totals: TotalsType.isRequired
    };

    static defaultProps = {
        isSelected: false
    };

    onClick = () => {
        const {
            onClick,
            option
        } = this.props;

        onClick(option);
    };

    renderPrice() {
        const {
            option: { price_incl_tax },
            totals: { quote_currency_code }
        } = this.props;

        const roundedUpPrice = roundPrice(price_incl_tax);

        return (
            <span>
                {roundedUpPrice != 0 ? ` - ${roundedUpPrice} ${formatCurrency(quote_currency_code)}` : " - Free delivery"}
            </span>
        );
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    renderRow() {
        const {
            option: {
                carrier_title,
                timeline,
                image_url
            },
            shippingMethods
        } = this.props;
        const cielTimeline = timeline != 0.5 ? Math.ceil(timeline) : timeline
        let daysOrHoursString = ""
        let timelineValue = 0
        let timelineRange = 0
        const timelineTotalArray = shippingMethods.map((x) => x.timeline)
        let timelineTotal = 0
        if (!this.isInt(Number(cielTimeline))) {
            timelineTotal = timelineTotalArray.length && timelineTotalArray.reduce((a, b) => parseFloat(a) + parseFloat(b))
            timelineValue = 12
            timelineRange = 36
            daysOrHoursString = "hours"
        } else {
            timelineTotal = timelineTotalArray.length && timelineTotalArray.reduce((a, b) => parseInt(a) + parseInt(b))
            timelineValue = Number(cielTimeline)
            timelineRange = timelineValue + 2
            daysOrHoursString = "days"
        }
        const timelineColor = timelineTotal / shippingMethods.length

        return (
            <div block="CheckoutDeliveryOption" elem="Row">
                <div className="DeliveryOptionContent">
                    <span>
                        <span>{carrier_title} {this.renderPrice()}</span>
                    </span>
                    <br />
                    <span>
                        {__('Est Delivery : ')}
                        {timeline != "false" && timeline != 0 ? <span style={{ color: `${timelineColor >= timeline ? "#03A685" : "#DC6D6D"}`, fontFamily: "Muli", fontWeight: "bold" }}>
                            {`${timelineValue} - ${timelineRange} ${daysOrHoursString}`}</span> : "No estimates available"}
                    </span>
                </div>
                <div className="DeliveryOptionImage"><img src={image_url} /></div>
            </div>
        );
    }

    render() {
        const {
            isSelected
        } = this.props;
        return (
            <li block="CheckoutDeliveryOption">
                <button
                    block="CheckoutDeliveryOption"
                    mods={{ isSelected }}
                    elem="Button"
                    onClick={this.onClick}
                    type="button"
                >
                    {this.renderRow()}
                </button>
            </li>
        );
    }
}

export default CheckoutDeliveryOption;
