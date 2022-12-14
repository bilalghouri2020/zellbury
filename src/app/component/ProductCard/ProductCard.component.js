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

import './ProductCard.style';

import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

import Image from 'Component/Image';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import ProductPrice from 'Component/ProductPrice';
import ProductReviewRating from 'Component/ProductReviewRating';
import TextPlaceholder from 'Component/TextPlaceholder';
import TierPrices from 'Component/TierPrices';
import { ProductType } from 'Type/ProductList';
import { CONFIGURABLE } from 'Util/Product';

/**
 * Product card
 * @class ProductCard
 */
export class ProductCard extends PureComponent {
    static propTypes = {
        linkTo: PropTypes.shape({}),
        product: ProductType.isRequired,
        productOrVariant: ProductType.isRequired,
        thumbnail: PropTypes.string,
        availableVisualOptions: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        })).isRequired,
        getAttribute: PropTypes.func.isRequired,
        registerSharedElement: PropTypes.func.isRequired,
        children: PropTypes.element,
        isLoading: PropTypes.bool,
        mix: PropTypes.shape({})
    };

    static defaultProps = {
        thumbnail: '',
        linkTo: {},
        children: null,
        isLoading: false,
        mix: {}
    };

    imageRef = createRef();

    registerSharedElement = () => {
        const { registerSharedElement } = this.props;
        registerSharedElement(this.imageRef);
    };

    renderConfigurablePriceBadge() {
        const {
            product: { type_id }
        } = this.props;

        if (type_id !== CONFIGURABLE) {
            return null;
        }

        return (
            <p
              mix={ {
                  block: 'ProductCard',
                  elem: 'PriceBadge'
              } }
            >
                { __('As Low as') }
            </p>
        );
    }

    renderProductPrice() {
        const { productOrVariant: { price_range } } = this.props;

        if (!price_range) {
            return <TextPlaceholder />;
        }

        return (
            <>
                {/* { this.renderConfigurablePriceBadge() } */}
                <ProductPrice
                  price={ price_range }
                  mix={ { block: 'ProductCard', elem: 'Price' } }
                />
            </>
        );
    }

    renderTierPrice() {
        const { productOrVariant } = this.props;

        return (
            <TierPrices
              product={ productOrVariant }
              isLowestPrice
            />
        );
    }

    renderVisualConfigurableOptions() {
        const { availableVisualOptions } = this.props;

        return (
            <div block="ProductCard" elem="ConfigurableOptions">
                { availableVisualOptions.map(({ value, label }) => (
                    <span
                      block="ProductCard"
                      elem="Color"
                      key={ value }
                      style={ { backgroundColor: value } }
                      aria-label={ label }
                    />
                )) }
            </div>
        );
    }

    renderPicture() {
        const { product: { id, name }, thumbnail } = this.props;

        this.sharedComponent = (
            <Image
              imageRef={ this.imageRef }
              src={ thumbnail }
              alt={ name }
              ratio="custom"
              mix={ { block: 'ProductCard', elem: 'Picture' } }
              isPlaceholder={ !id }
            />
        );

        return (
            <>
                { this.sharedComponent }
                <img
                  style={ { display: 'none' } }
                  alt={ name }
                  src={ thumbnail }
                />
            </>
        );
    }

    renderReviews() {
        const {
            product: {
                review_summary: {
                    rating_summary
                } = {}
            }
        } = this.props;

        if (!rating_summary) {
            return null;
        }

        return (
            <div
              block="ProductCard"
              elem="Reviews"
            >
                <ProductReviewRating summary={ rating_summary || 0 } />
            </div>
        );
    }

    renderAdditionalProductDetails() {
        const { product: { sku }, getAttribute } = this.props;
        const { product_list_content: { attribute_to_display } = {} } = window.contentConfiguration;
        const brand = getAttribute(attribute_to_display || 'brand') || {};

        if (sku && !brand) {
            return null;
        }

        return (
            <div
              block="ProductCard"
              elem="Brand"
              mods={ { isLoaded: !!brand } }
            >
                <ProductAttributeValue
                  attribute={ brand }
                  isFormattedAsText
                />
            </div>
        );
    }

    renderMainDetails() {
        const { product: { name } } = this.props;

        return (
            <p
              block="ProductCard"
              elem="Name"
              mods={ { isLoaded: !!name } }
            >
                <TextPlaceholder content={ name } length="medium" />
            </p>
        );
    }

    renderCardWrapper(children) {
        const { linkTo, product: { url } } = this.props;

        if (!url) {
            return (<div>{ children }</div>);
        }

        return (
            <Link
              block="ProductCard"
              elem="Link"
              to={ linkTo }
              onClick={ this.registerSharedElement }
            >
              { children }
            </Link>
        );
    }

    render() {
        const {
            children,
            mix,
            isLoading
        } = this.props;

        return (
            <li
              block="ProductCard"
              mix={ mix }
            >
                <Loader isLoading={ isLoading } />
                { this.renderCardWrapper((
                    <>
                        <figure block="ProductCard" elem="Figure">
                            { this.renderPicture() }
                        </figure>
                        <div block="ProductCard" elem="Content">
                            { this.renderReviews() }
                            { this.renderProductPrice() }
                            { this.renderVisualConfigurableOptions() }
                            { this.renderTierPrice() }
                            { this.renderMainDetails() }
                            { this.renderAdditionalProductDetails() }
                        </div>
                    </>
                )) }
                <div block="ProductCard" elem="AdditionalContent">
                    { children }
                </div>
            </li>
        );
    }
}

export default ProductCard;
