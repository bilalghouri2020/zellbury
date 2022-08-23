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

 import './CancelOrderOptions.style';

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 
 import Loader from 'Component/Loader';
 
 export class CancelOrderOptions extends PureComponent {
     static propTypes = {
         isLoading: PropTypes.bool.isRequired,
         handleSubOptionChange: PropTypes.func.isRequired,
         cancelOrdersOptions: PropTypes.array.isRequired
     };
 
     render() {
         const { isLoading, cancelOrdersOptions, handleSubOptionChange } = this.props;
        
         console.log("this.props in order opt", this.props);

         return (
             <>
                <h3>What would you like help with</h3>
               
                <div className="orderOptCenteredSecCancel">
                {cancelOrdersOptions.map((item) => {
                   return (
                    <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                        <button
                        className="optionsBtn"
                        type="text"
                        value={item.value}
                        onClick={handleSubOptionChange}
                        // block={item.label}
                        elem="Button"
                        mix={ { block: 'Button' } }
                        >
                            { __(`${item.label}`) }
                        </button>
                    </div>
                   )
                })}
                    {/* <div className="roundedButtonsSec" block="OrderStatusComplain" elem="Buttons">
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
                    </div> */}
                </div>
            </>
         );
     }
 }
 
 export default CancelOrderOptions;