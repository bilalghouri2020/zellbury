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
import { connect } from 'react-redux';

import { DEFAULT_MAX_PRODUCTS } from 'Component/ProductActions/ProductActions.config';
import { CartItemType } from 'Type/MiniCart';
import { CONFIGURABLE } from 'Util/Product';
import { makeCancelable } from 'Util/Promise';
import { objectToUri } from 'Util/Url';

import CartItem from './CartItem.component';
import TagManager from 'react-gtm-module';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

export const mapDispatchToProps = (dispatch) => ({
    addProduct: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.addProductToCart(dispatch, options)
    ),
    changeItemQty: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.changeItemQty(dispatch, options)
    ),
    removeProduct: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.removeProductFromCart(dispatch, options)
    )
});

export class CartItemContainer extends PureComponent {
    static propTypes = {
        item: CartItemType.isRequired,
        currency_code: PropTypes.string.isRequired,
        changeItemQty: PropTypes.func.isRequired,
        removeProduct: PropTypes.func.isRequired
    };

    state = { isLoading: false };

    handlers = [];

    setStateNotLoading = this.setStateNotLoading.bind(this);

    containerFunctions = {
        handleChangeQuantity: this.handleChangeQuantity.bind(this),
        handleRemoveItem: this.handleRemoveItem.bind(this),
        getCurrentProduct: this.getCurrentProduct.bind(this)
    };

    componentWillUnmount() {
        if (this.handlers.length) {
            [].forEach.call(this.handlers, (cancelablePromise) => cancelablePromise.cancel());
        }
    }

    /**
     * @returns {Product}
     */
    getCurrentProduct() {
        const { item: { product } } = this.props;
        const variantIndex = this._getVariantIndex();

        return variantIndex < 0
            ? product
            : product.variants[variantIndex];
    }

    getMinQuantity() {
        const { stock_item: { min_sale_qty } = {} } = this.getCurrentProduct() || {};
        return min_sale_qty || 1;
    }

    getMaxQuantity() {
        const { stock_item: { max_sale_qty } = {} } = this.getCurrentProduct() || {};
        return max_sale_qty || DEFAULT_MAX_PRODUCTS;
    }

    setStateNotLoading() {
        this.setState({ isLoading: false });
    }

    containerProps = () => ({
        linkTo: this._getProductLinkTo(),
        thumbnail: this._getProductThumbnail(),
        minSaleQuantity: this.getMinQuantity(),
        maxSaleQuantity: this.getMaxQuantity()
    });

    /**
     * Handle item quantity change. Check that value is <1
     * @param {Number} value new quantity
     * @return {void}
     */
    handleChangeQuantity(quantity) {
        // const {item,item:{qty}} = this.props
        // const {sku,product:{variants=[]}} = item;
        // if(variants && variants.length>0)
        // {
        //     let curentItem =variants.find(x=>x.sku==sku);
        //     if(curentItem && Object.keys(curentItem.attributes).length>0 && Object.keys(curentItem.attributes.IsInMeter).length>0 && curentItem.attributes.IsInMeter.attribute_value=='1'){
        //         quantity=qty+0.5;
        //     }
        // }
        this.setState({ isLoading: true }, () => {
            const { changeItemQty, item: { item_id, sku, product } } = this.props;
            this.hideLoaderAfterPromise(changeItemQty({ item_id, quantity, sku, product }));
        });
    }
    /**
     * @return {void}
     */
    handleRemoveItem() {
        this.setState({ isLoading: true }, () => {
            const { removeProduct, item: { item_id } } = this.props;
            console.log('remove Item this.props.', this.props);
            this.hideLoaderAfterPromise(removeProduct(item_id));

            
            const sku = this?.props?.item?.sku
            const item_name = this?.props?.item?.product?.name
            const amount_off = this?.props?.item?.product?.price_range?.minimum_price?.discount?.amount_off
            const category1 = this?.props?.item?.product?.categories[0]?.name
            const category2 = this?.props?.item?.product?.categories[1]?.name
            const category3 = this?.props?.item?.product?.categories[2]?.name
            const color = this?.props?.item?.product?.attributes?.color?.attribute_options[this?.props?.item?.product?.attributes?.color?.attribute_value]?.label || 'color not mention'
            const price = this?.props?.item?.price

            const GtmDataLayerProductArgs = {
                dataLayer: {
                    event: "remove_from_cart",
                    ecommerce: {
                        items: [
                            {
                                item_id: sku,//"SKU_12345", //sku
                                item_name, //"Stan and Friends Tee", //product name
                                // affiliation: "Google Merchandise Store",
                                // coupon: "SUMMER_FUN",
                                currency: "PKR",
                                discount: amount_off,// 2.22, // PRICE - SPECIAL PRICE
                                // index: 0, // PRODUCT POSITION
                                item_brand: "Zellbury",
                                item_category: category1, // category level 1
                                item_category2: category2, // category level 2
                                item_category3: category3, //category level 3
                                //item_category4: "null", 
                                //item_category5: "null",
                                //item_list_id: "related_products",
                                //item_list_name: "Related Products",
                                item_variant: color, // color
                                //location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
                                price,//: 9.99, // price - (not special price)
                                quantity: this.props.item.qty//1 // QTY THAT IS removed from CART FOR THIS ITEM SPECIFICALLY
                            }
                        ]
                    }
                },
            };

            TagManager.dataLayer(GtmDataLayerProductArgs);
        });


    }

    /**
     * @param {Promise}
     * @returns {cancelablePromise}
     */
    registerCancelablePromise(promise) {
        const cancelablePromise = makeCancelable(promise);
        this.handlers.push(cancelablePromise);
        return cancelablePromise;
    }

    /**
     * @param {Promise} promise
     * @returns {void}
     */
    hideLoaderAfterPromise(promise) {
        this.registerCancelablePromise(promise)
            .promise.then(this.setStateNotLoading, this.setStateNotLoading);
    }

    /**
     * @returns {Int}
     */
    _getVariantIndex() {
        const {
            item: {
                sku: itemSku,
                product: { variants = [] } = {}
            }
        } = this.props;

        return variants.findIndex(({ sku }) => sku === itemSku || itemSku.includes(sku));
    }

    /**
     * Get link to product page
     * @param url_key Url to product
     * @return {{pathname: String, state Object}} Pathname and product state
     */
    _getProductLinkTo() {
        const {
            item: {
                product,
                product: {
                    type_id,
                    configurable_options,
                    parent,
                    variants = [],
                    url
                }
            }
        } = this.props;

        if (type_id !== CONFIGURABLE) {
            return {
                pathname: url,
                state: { product }
            };
        }

        const variant = variants[this._getVariantIndex()];
        const { attributes } = variant;

        const parameters = Object.entries(attributes).reduce(
            (parameters, [code, { attribute_value }]) => {
                if (Object.keys(configurable_options).includes(code)) {
                    return { ...parameters, [code]: attribute_value };
                }

                return parameters;
            }, {}
        );

        return {
            pathname: url,
            state: { product: parent || product },
            search: objectToUri(parameters)
        };
    }

    _getProductThumbnail() {
        const product = this.getCurrentProduct();
        const { thumbnail: { url: thumbnail } = {} } = product;
        return thumbnail || '';
    }

    render() {
        return (
            <CartItem
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(CartItemContainer);
