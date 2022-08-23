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

import './ExchangeFromStorePopup.style';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import MyAccountCustomerForm from 'Component/MyAccountCustomerForm';
import MyAccountPasswordForm from 'Component/MyAccountPasswordForm';
import Popup from 'Component/Popup';
import { customerType } from 'Type/Account';

import { COMPLAIN_CONFIRM } from './ExchangeFromStorePopup.config';

export class ExchangeFromStorePopup extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        handlePopupConfirm: PropTypes.func.isRequired,
        payload: PropTypes.shape({
            action: PropTypes.oneOf([
                COMPLAIN_CONFIRM
            ]),
        }).isRequired
    };

    renderContent() {
        const { handlePopupConfirm, title } = this.props;
        
        return (
            <div className="orderOptCenteredSec">
                <h3 className="popupTitle">{title}</h3>
                <div className="buttonsSec" block="ExchangeFromStorePopup" elem="Buttons">
                    <button
                    className="optionsBtn"
                    type="text"
                    value="confirm"
                    onClick={handlePopupConfirm}
                    // block={"Exchange From Store"}
                    elem="Button"
                    mix={ { block: 'Button' } }
                    >
                        { __('CONFIRM') }
                    </button>
                </div>
            </div>
        )
    }

    render() {
        const { isLoading } = this.props;

        return (
            <Popup
              clickOutside={ false }
              mix={ { block: 'ExchangeFromStorePopup' } }
            >
                {/* <Loader isLoading={ isLoading } /> */}
                { this.renderContent() }
            </Popup>
        );
    }
}

export default ExchangeFromStorePopup;
