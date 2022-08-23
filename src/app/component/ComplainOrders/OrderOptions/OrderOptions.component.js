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

 import './OrderOptions.style';

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 
 import Loader from 'Component/Loader';
 
 export class OrderOptions extends PureComponent {
     static propTypes = {
         isLoading: PropTypes.bool.isRequired,
         handleOrderOptionSelect: PropTypes.func.isRequired,
         ordersOptions: PropTypes.array.isRequired
     };
 
     render() {
         const { isLoading, ordersOptions, handleOrderOptionSelect } = this.props;
        
         console.log("this.props in order opt", this.props);

         return (
             <>
                <h3>What would you like help with</h3>

                <div className="centeredSec">
                {ordersOptions.map((item) => {
                    console.log(item);
                   return (
                    <div className="roundedButtonsSec" block="OrderStatusComplain" elem="Buttons">
                        <button
                        className="optionsBtn"
                        type="text"
                        value={item.value}
                        onClick={handleOrderOptionSelect}
                        block={item.label}
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
 
 export default OrderOptions;