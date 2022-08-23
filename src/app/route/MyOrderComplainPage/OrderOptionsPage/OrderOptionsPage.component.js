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

 import './OrderOptionsPage.style';

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 
 import Loader from 'Component/Loader';
 
 export class OrderOptionsPage extends PureComponent {
     static propTypes = {
         isLoading: PropTypes.bool.isRequired
     };
 
     render() {
         const { isLoading } = this.props;
 
         return (
             <>
                <h3>What would you like help with TESTST</h3>
                <div className="centeredSec">
                    <div className="roundedButtonsSec" block="OrderStatusComplain" elem="Buttons">
                        <button
                        className="optionsBtn"
                        type="text"
                        block="Orders not Received"
                        elem="Button"
                        mix={ { block: 'Button' } }
                        >
                            { __('Orders not Received') }
                        </button>
                    </div>
                    <div className="roundedButtonsSec" block="OrderStatusComplain" elem="Buttons">
                        <button
                        className="optionsBtn"
                        type="text"
                        block="Cancel My Order"
                        elem="Button"
                        mix={ { block: 'Button' } }
                        >
                            { __('Cancel My Order') }
                        </button>
                    </div>
                    <div className="roundedButtonsSec" block="OrderStatusComplain" elem="Buttons">
                        <button
                        className="optionsBtn"
                        type="text"
                        block="Change My Order"
                        elem="Button"
                        mix={ { block: 'Button' } }
                        >
                            { __('Change My Order') }
                        </button>
                    </div>
                </div>
            </>
         );
     }
 }
 
 export default OrderOptionsPage;