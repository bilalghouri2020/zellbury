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

import './AddToCart.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { MixType } from 'Type/Common';
import { ProductType } from 'Type/ProductList';

const addToCartImg = window.location.protocol+'//'+window.location.hostname+'/media/wysiwyg/homepage/add-to-cart.png';

/**
 * Button for adding product to Cart
 * @class AddToCart
 */
export class AddToCart extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool,
        product: ProductType,
        mix: MixType,
        buttonClick: PropTypes.func.isRequired
    };

    static defaultProps = {
        product: {},
        mix: {},
        isLoading: false
    };

    renderPlaceholder() {
        const { isLoading, mix } = this.props;

        return (
            <div
              block="AddToCart"
              mods={ { isLoading, isPlaceholder: true } }
              mix={ mix }
            />
        );
    }

    render() {
        const {
            mix,
            product: { type_id },
            isLoading,
            buttonClick
        } = this.props;

        if (!type_id) {
            this.renderPlaceholder();
        }

        return (
            <button
              onClick={ buttonClick }
              block="Button AddToCart"
              mix={ mix }
              mods={ { isLoading } }
              disabled={ isLoading }
            >
                <span><img block="AddToCart" elem="BagImage" src={addToCartImg} alt="Add to bag" /> { __('Add to bag') }</span>
                <span>{ __('Adding...') }</span>
            </button>
        );
    }
}

export default AddToCart;
