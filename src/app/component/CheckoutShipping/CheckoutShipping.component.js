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
import Field from 'Component/Field';

import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import Form from 'Component/Form';
import Loader from 'Component/Loader';
import { SHIPPING_STEP } from 'Route/Checkout/Checkout.config';
import { shippingMethodsType, shippingMethodType } from 'Type/Checkout';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './CheckoutStyle.scss'

export class CheckoutShipping extends PureComponent {
    static propTypes = {
        onShippingSuccess: PropTypes.func.isRequired,
        _getAddressById: PropTypes.func._getAddressById,
        onShippingError: PropTypes.func.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        shippingMethods: shippingMethodsType.isRequired,
        onShippingMethodSelect: PropTypes.func.isRequired,
        selectedShippingMethod: shippingMethodType,
        onAddressSelect: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        locationEnable: PropTypes.bool.isRequired,
        sourcesName: PropTypes.array.isRequired,
        selectedCustomerAddressId: PropTypes.number.isRequired
    };
    state = {
        isOpen: false
    }
    static defaultProps = {
        selectedShippingMethod: null
    };
    renderActions() {
        const { selectedShippingMethod } = this.props;

        return (
            <div block="Checkout" elem="StickyButtonWrapper">
                <button
                    type="submit"
                    block="Button"
                    disabled={!selectedShippingMethod}
                    mix={{ block: 'CheckoutShipping', elem: 'Button' }}
                >
                    {__('Save & Continue')}
                </button>
            </div>
        );
    }

    renderDelivery() {
        const {
            shippingMethods,
            onShippingMethodSelect
        } = this.props;

        return (
            <CheckoutDeliveryOptions
                shippingMethods={shippingMethods}
                onShippingMethodSelect={onShippingMethodSelect}
            />
        );
    }

    renderAddressBook() {
        const {
            onAddressSelect,
            onShippingEstimationFieldsChange
        } = this.props;

        return (
            <CheckoutAddressBook
                onAddressSelect={onAddressSelect}
                onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
            />
        );
    }
    getAddressAndEnableLocation = (e) => {
        const {
            onShippingEstimationFieldsChange,
            selectedCustomerAddressId,
            _getAddressById
        } = this.props;
        const customer = JSON.parse(localStorage.getItem('customer')) || {};
        let address = { city: customer.data.city }
        if (selectedCustomerAddressId) {
            address = _getAddressById(selectedCustomerAddressId)
        }

        onShippingEstimationFieldsChange(address)
    }
    renderLocation() {
        const {
            sourcesName,
            locationEnable,
            dropdown,
            updateSources
        } = this.props;
        const { isOpen } = this.state
        if (locationEnable) {
            return (
                <div>
                    <p className="deliveryLocationHeading">Delivered from : <span className="locationEnabled">{sourcesName.toString()}</span></p>
                </div>
            )
        }
        console.log('dropdown', dropdown);
        console.log('sourcesName', sourcesName);
        sourcesName?.map((source) => {
            console.log(source);
        })

        return (
            <div>
                {/* <p className="deliveryLocationHeading">Delivered from : <span className="locationDisable">Location not enabled</span></p> */}
                <p className="deliveryLocationHeading">Delivered from : {!dropdown && <span className="locationEnabled">{sourcesName.toString()}</span>}
                    {dropdown && <div className='delivered-from-selector'>
                        <select
                            // block="FieldSelect"
                            elem="Select"
                            onChange={(v) => {
                                updateSources(v.target.value)
                            }}
                        >
                            {/* <option value="">----Select----</option> */}
                            {sourcesName?.map((source) => <option value={source}>{source}</option>)}
                        </select>
                        <img src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%221em%22%20height%3D%221em%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M98%20190.06l139.78%20163.12a24%2024%200%200%200%2036.44%200L414%20190.06c13.34-15.57%202.28-39.62-18.22-39.62h-279.6c-20.5%200-31.56%2024.05-18.18%2039.62z%22%20fill%3D%22lightgray%22%2F%3E%3C%2Fsvg%3E' alt="" style={{marginLeft: '0px', marginBottom: '-6px', width: '24px', height: '24px'}}/>
                        
                    </div>}
                </p>
                {/* <p className="deliveryLocationPara">Please enable location on your browser - <span onClick={() => this.setState({ isOpen: true })} className="locationDisable">See How to enable</span> </p>
                <button type="button" onClick={() => this.getAddressAndEnableLocation()} className="enableLocationButton">enable location now</button>
                {isOpen && (
                    <Lightbox
                        mainSrc={`${window.location.protocol + '//' + window.location.hostname + '/media/demo/demo.gif'}`}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        enableZoom={false}
                        imageTitle="How to Enable Location"
                    />
                )} */}
            </div >
        )
    }
    render() {
        const {
            onShippingSuccess,
            onShippingError,
            isLoading
        } = this.props;

        return (
            <Form
                autocomplete="off"
                id={SHIPPING_STEP}
                mix={{ block: 'CheckoutShipping' }}
                onSubmitError={onShippingError}
                onSubmitSuccess={onShippingSuccess}
            >
                {this.renderAddressBook()}
                <div>
                    {this.renderLocation()}
                    <Loader isLoading={isLoading} />
                    {this.renderDelivery()}
                    {this.renderActions()}
                </div>
            </Form>
        );
    }
}

export default CheckoutShipping;
