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

import './ProductPrice.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import isMobile from 'Util/Mobile';

import TextPlaceholder from 'Component/TextPlaceholder';
import { MixType } from 'Type/Common';
import { PriceType } from 'Type/ProductList';

/**
 * Product price
 * @class ProductPrice
 */
export class ProductPrice extends PureComponent {
    static propTypes = {
        isSchemaRequired: PropTypes.bool,
        roundedRegularPrice: PropTypes.string,
        priceCurrency: PropTypes.string,
        discountPercentage: PropTypes.number,
        formatedCurrency: PropTypes.string,
        variantsCount: PropTypes.number,
        currency: PropTypes.string,
        price: PriceType,
        mix: MixType
    };

    static defaultProps = {
        isSchemaRequired: false,
        roundedRegularPrice: '0',
        priceCurrency: 'USD',
        discountPercentage: 0,
        formatedCurrency: '0',
        variantsCount: 0,
        currency: '$',
        mix: {},
        price: {}
    };

    renderPlaceholder() {
        const { mix } = this.props;

        return (
            <p block="ProductPrice" aria-label="Product Price" mix={mix}>
                <TextPlaceholder mix={{ block: 'ProductPrice', elem: 'Placeholder' }} length="custom" />
            </p>
        );
    }

    getCurrentPriceSchema() {
        const { isSchemaRequired, variantsCount } = this.props;

        if (variantsCount > 1) {
            return isSchemaRequired ? { itemProp: 'lowPrice' } : {};
        }

        return isSchemaRequired ? { itemProp: 'price' } : {};
    }

    renderCurrentPrice() {
        const {
            discountPercentage,
            formatedCurrency,
            currency
        } = this.props;

        const schema = this.getCurrentPriceSchema();

        // Use <ins></ins> <del></del> to represent new price and the old (deleted) one
        const PriceSemanticElementName = discountPercentage > 0 ? 'ins' : 'span';

        return (
            <PriceSemanticElementName>
                <data
                    value={formatedCurrency}
                >
                    <span>{currency}</span>
                    <span {...schema}>{' ' + formatedCurrency}</span>
                </data>
            </PriceSemanticElementName>
        );
    }

    renderOldPrice() {
        const {
            roundedRegularPrice,
            discountPercentage,
            isSchemaRequired,
            variantsCount,
            quantity
        } = this.props;
        const schema = isSchemaRequired && variantsCount > 1 ? { itemProp: 'highPrice' } : {};

        return (
            <del
                block="ProductPrice"
                elem="HighPrice"
                mods={{ isVisible: discountPercentage > 0 }}
                aria-label={__('Old product price')}
                {...schema}
            >
                { roundedRegularPrice}
            </del>
        );
    }

    renderSchema() {
        const { isSchemaRequired, priceCurrency } = this.props;

        if (isSchemaRequired) {
            return (
                <meta itemProp="priceCurrency" content={priceCurrency} />
            );
        }

        return null;
    }
    renderSkuMobile() {
        const {
            sku,
            stock_status,

            areDetailsLoaded
        } = this.props;



        return (
            <section
                block="ProductActions"
                elem="Section"
                mods={{ type: 'sku_mobile' }}
                aria-label="Product SKU and availability"
            >
                {
                    areDetailsLoaded && sku &&
                    <>
                        <span block="ProductPrice" elem="StockMobile">
                            {stock_status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'In Stock'}
                        </span>
                        <br />
                        {isMobile.any() && <span block="ProductPrice" elem="SkuMobile">
                            {`SKU: ${sku.length>17? sku.substring(0,17)+'...': sku}`}
                        </span>}
                        {!isMobile.any() && <span block="ProductPrice" elem="SkuMobile">
                            {`SKU: ${sku}`}
                        </span>}
                    </>
                }
            </section>
        );
    }
    render() {
        const {
            showTaxLabel,
            price: {
                minimum_price: {
                    final_price,
                    regular_price
                } = {}
            } = {},
            formatedCurrency,
            currency,
            mix
        } = this.props;

        if (!final_price || !regular_price) {
            return this.renderPlaceholder();
        }

        return (
            <p
                block="ProductPrice"
                mix={mix}
                aria-label={`Product price: ${formatedCurrency}${currency}`}
            >
                { this.renderSkuMobile()}
                { this.renderCurrentPrice()}
                { this.renderOldPrice()}
                { this.renderSchema()}
                {showTaxLabel && <label mix={{ block: 'ProductPrice', elem: 'TaxLabel' }}>inclusive of all taxes</label>}
            </p>
        );
    }
}

export default ProductPrice;
