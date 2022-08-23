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

import { MixType } from 'Type/Common';
import { PriceType } from 'Type/ProductList';
import {
    calculateFinalPrice,
    formatCurrency,
    roundPrice
} from 'Util/Price';

import ProductPrice from './ProductPrice.component';
/**
 * Product price
 * @class ProductPrice
 */
export class ProductPriceContainer extends PureComponent {
    static propTypes = {
        isSchemaRequired: PropTypes.bool,
        price: PriceType,
        mix: MixType
    };

    static defaultProps = {
        isSchemaRequired: false,
        mix: {},
        price: {}
    };

    containerProps = () => {
        const {
            price: {
                minimum_price: {
                    discount: {
                        percent_off: discountPercentage
                    } = {},
                    final_price: {
                        value: minimalPriceValue,
                        currency: priceCurrency
                    } = {},
                    regular_price: {
                        value: regularPriceValue
                    } = {}
                } = {}
            } = {},
            quantity,
            IsMetered
        } = this.props;
       
        if (!minimalPriceValue || !regularPriceValue) {
            return {};
        }
        let f_price = 0.0;
        let r_price =0;
        if (quantity && IsMetered) {
            r_price = quantity * regularPriceValue;
        }
        else {
            r_price = regularPriceValue;
        }
        const roundedRegularPrice = roundPrice(r_price);
        const finalPrice = calculateFinalPrice(discountPercentage, minimalPriceValue, regularPriceValue);
        if (quantity && IsMetered) {
            f_price = quantity * finalPrice;
        }
        else
        {
            f_price = finalPrice;
        }
        const formatedCurrency = roundPrice(f_price);
        const currency = formatCurrency(priceCurrency);
        return {
            roundedRegularPrice,
            priceCurrency,
            discountPercentage,
            formatedCurrency,
            currency
        };
    };

    render() {
        return (
            <ProductPrice
                {...this.props}
                {...this.containerProps()}
            />
        );
    }
}

export default ProductPriceContainer;
