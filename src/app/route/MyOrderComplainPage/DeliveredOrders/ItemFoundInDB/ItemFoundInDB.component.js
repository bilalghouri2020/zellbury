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

import './ItemFoundInDB.style';
import ContentWrapper from 'Component/ContentWrapper';
import PropTypes from 'prop-types';
//  import { PureComponent } from 'react';
import Loader from 'Component/Loader';
import { customerType } from 'Type/Account';
import history from 'Util/History';
import { Component } from 'react';
import ProductPicture from 'Component/ProductPicture';
import FabricLightThickDetails from '../FabricLightThickDetails';


export class ItemFoundInDB extends Component {
    static propTypes = {
        showConfirmPopup: PropTypes.func.isRequired,
        customer: customerType.isRequired,
        showNotification: PropTypes.func.isRequired,
    };

    state = {
        productOption: {
            mainOption: null,
            subOption: null,
        }
    }

    componentDidMount() {
        const { setHeaderState } = this.props
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
    }

    handleVoucherRoute = () => {
        history.push('/ordercomplain/delivered-orders/convenience-voucher');
    }

    //  renderConfirmPopup = () => {
    //     return <ExchangeFromStorePopup handlePopupConfirm={this.handlePopupConfirm} />
    //  }

    handleOptionSelect = (event) => {
        const { productOption } = this.state;
        let obj = productOption;
        let val = event.target.value;
        obj.mainOption = val;
        // console.log(val);
        // console.log(mainOption);
        this.setState({ productOption: obj });
    }

    handleSubOptionSelect = (event) => {
        const { productOption } = this.state;
        let obj = productOption;
        let val = event.target.value;
        obj.subOption = val;
        this.setState({ productOption: obj });
    }

    renderProductSelectedOptions = () => {
        const { isLoading, showConfirmPopup } = this.props;
        return (
            <ContentWrapper>
                <>
                    <div className="orderOptCenteredSec">
                        <h3>Please select the option which applies best.</h3>
                        <h3>Item is not fit from</h3>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="Chest"
                                onClick={this.handleSubOptionSelect}
                                // onClick={handleSubOptionChange}
                                // block={item.label}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Chest')}
                            </button>
                        </div>

                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="Hips"
                                // block={item.label}
                                onClick={this.handleSubOptionSelect}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Hips')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="Length"
                                // block={item.label}
                                onClick={this.handleSubOptionSelect}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Length')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                // block={item.label}
                                onClick={this.handleSubOptionSelect}
                                value="Waist"
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Waist')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                // block={item.label}
                                onClick={this.handleSubOptionSelect}
                                value="Shoulder"
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Shoulder')}
                            </button>
                        </div>
                    </div>
                </>
            </ContentWrapper>
        );
    }

    renderProductScannedOptions = () => {
        const { isLoading, showConfirmPopup } = this.props;
        const customerData = JSON.parse(localStorage.getItem("customer"));
        return (
            <ContentWrapper>
                <>
                    <div className="orderOptCenteredSec">
                        <h3>{customerData ? customerData.data.firstname.split(' ')[0] : ""}, product that you have scanned is as per your order.</h3>
                        <p>Do you have a different issue?</p>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="Item doesnt fit me"
                                // value={item.value}
                                // onClick={handleSubOptionChange}
                                // block={item.label}
                                onClick={this.handleOptionSelect}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Item doesnt fit me')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="Item is mis-print"
                                // block={item.label}
                                onClick={this.handleOptionSelect}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Item is mis-print')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="itemDamaged"
                                // block={item.label}
                                onClick={this.handleOptionSelect}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Item is damaged')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                // block={item.label}
                                onClick={this.handleOptionSelect}
                                value="Item is faded"
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Item is faded')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                // block={item.label}
                                onClick={this.handleOptionSelect}
                                value="Color is not as per picture"
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Color is not as per picture')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                // block={item.label}
                                onClick={this.handleOptionSelect}
                                value="Fabric is very light"
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Fabric is very light')}
                            </button>
                        </div>
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                // block={item.label}
                                value="Fabric is too thick"
                                elem="Button"
                                onClick={this.handleOptionSelect}
                                mix={{ block: 'Button' }}
                            >{__('Fabric is too thick')}
                            </button>
                        </div>
                    </div>
                </>
            </ContentWrapper>
        );
    }

    renderContent = () => {
        const { productOption } = this.state;
        // const { updateComplain, complainData } = this.props;

        console.log('pro', productOption);
        console.log('pro1', this.props);
        // let obj = {
        //     complainData: complainData,
        //     barcodeMatchedData: productOption
        // }
        // updateComplain(obj);
        if (productOption.mainOption && productOption.mainOption == 'Item doesnt fit me' && !productOption.subOption) {
            return this.renderProductSelectedOptions();
        }

        if (productOption.mainOption && productOption.mainOption == 'Item doesnt fit me') {
            if (productOption.subOption) {
                return <ProductPicture productOption={productOption} />
            }
        }

        if (productOption.mainOption && productOption.mainOption === 'Fabric is very light') {
            return <FabricLightThickDetails
                productOption={productOption}
                checkCondition="Fabric is very light"
                collection={this.props?.complainData?.barcodeData?.data?.validateBarcode?.product[0]?.collection}
                fabric={this.props?.complainData?.barcodeData?.data?.validateBarcode?.product[0]?.fabric}
            />
        }
        if (productOption.mainOption && productOption.mainOption === 'Fabric is too thick') {
            return <FabricLightThickDetails
                checkCondition="Fabric is too thick"
                productOption={productOption}
            />
        }

        if (productOption.mainOption && productOption.mainOption != 'Item doesnt fit me') {
            return <ProductPicture productOption={productOption} />
        }





        if (!productOption.mainOption) {
            return this.renderProductScannedOptions();
        }
        // else{
        //     return this.renderProductScannedOptions();
        // }

    }

    render() {

        return (
            <div>
                {this.renderContent()}
                {/* { this.renderConfirmPopup() } */}
            </div>
        )

    }
}

export default ItemFoundInDB;