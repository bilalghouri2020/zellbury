/* eslint-disable react/no-unused-state */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-ProductReviewListtheme
 */

import './ProductPage.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ContentWrapper from 'Component/ContentWrapper';
import ProductActions from 'Component/ProductActions';
import ProductCustomizableOptions from 'Component/ProductCustomizableOptions';
import ProductGallery from 'Component/ProductGallery';
import ProductInformation from 'Component/ProductInformation';
import ProductLinks from 'Component/ProductLinks';
import ProductReviews from 'Component/ProductReviews';
import { RELATED, UPSELL } from 'Store/LinkedProducts/LinkedProducts.reducer';
import { ProductType } from 'Type/ProductList';
import isMobile from 'Util/Mobile';

import FabricInformation from 'Component/FabricInformation';
import DeliveryInformation from 'Component/DeliveryInformation';
import CustomerServiceInformation from 'Component/CustomerServiceInformation';
import TagManager from 'react-gtm-module';
import {
    calculateDiscountPercentage,
    calculateFinalPrice,
    roundPrice
} from 'Util/Price';

export class ProductPage extends PureComponent {
    static propTypes = {
        configurableVariantIndex: PropTypes.number.isRequired,
        productOrVariant: ProductType.isRequired,
        getLink: PropTypes.func.isRequired,
        parameters: PropTypes.objectOf(PropTypes.string).isRequired,
        updateConfigurableVariant: PropTypes.func.isRequired,
        dataSource: ProductType.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        getSelectedCustomizableOptions: PropTypes.func.isRequired,
        productOptionsData: PropTypes.object.isRequired,
        setBundlePrice: PropTypes.func.isRequired,
        selectedBundlePrice: PropTypes.number.isRequired
    };

    componentDidUpdate(prevProps) {
        const {
            location: { pathname },
            product: { id, sku, name, categories, price_range, stock_item },
            product
        } = this.props;
        // console.log('componentDidMount... props.......', this.props);
        if (product && price_range && stock_item) {
            const {
                location: { pathname: prevPathname },
                product: { id: prevId }
            } = prevProps;

            if (pathname !== prevPathname || id !== prevId) {

                const finalPrice = price_range.minimum_price.final_price.value;
                const finalCurrency = price_range.minimum_price.final_price.currency;
                const itemQty = stock_item.qty;



                const discountedPrice = price_range?.minimum_price?.discount?.amount_off
                const category1 = categories[0]?.name || ''
                const category2 = categories[1]?.name || ''
                const category3 = categories[2]?.name || ''
                const color = product?.attributes?.color?.attribute_options[product?.attributes?.color?.attribute_value]?.label
                const priceOfDataLayer = product?.price_range?.minimum_price?.regular_price?.value


                // console.log("data of datalayer......",
                //     discountedPrice,
                //     category1,
                //     category2,
                //     category3,
                //     color,
                //     priceOfDataLayer
                // );


                let itemCatPath = '';
                if (categories && categories.length > 0) {
                    let catKeys = Object.keys(categories);
                    let catLast = catKeys[catKeys.length - 1];
                    itemCatPath = categories[catLast].url;
                }
                if (itemCatPath.charAt(0) == "/") itemCatPath = itemCatPath.substr(1);
                if (itemCatPath.charAt(itemCatPath.length - 1) == "/") itemCatPath = itemCatPath.substr(0, itemCatPath.length - 1);

                const GtmDataLayerProductArgs = {
                    dataLayer: {
                        event: 'ProductView',
                        pageType: 'product',
                        prodId: id,
                        prodSku: sku,
                        prodName: name,
                        prodPrice: finalPrice,
                        prodCurrency: finalCurrency,
                        prodQty: itemQty,
                        prodCatPath: itemCatPath,
                    },

                };
                TagManager.dataLayer(GtmDataLayerProductArgs);
                
                let GtmDataLayerProductArgs2 = {
                    dataLayer: {
                        event: 'view_item',
                        ecommerce: {
                            items: [
                                {
                                    item_id: sku, //"SKU_12345", //sku
                                    item_name: name,//"Stan and Friends Tee", //product name
                                    // affiliation: "Google Merchandise Store",
                                    // coupon: "SUMMER_FUN",
                                    currency: "PKR",
                                    discount: discountedPrice,//2.22, // PRICE - SPECIAL PRICE
                                    // index: 0, // PRODUCT POSITION
                                    item_brand: "Zellbury",
                                    item_category: category1,//"Apparel", // category level 1
                                    item_category2: category2,//"Adult", // category level 2
                                    item_category3: category3,//"Shirts", //category level 3
                                    //item_category4: "null", 
                                    //item_category5: "null",
                                    //item_list_id: "related_products",
                                    //item_list_name: "Related Products",
                                    item_variant: color, // color
                                    //location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
                                    price: priceOfDataLayer,//9.99, // price - (not special price)
                                    quantity: 1
                                }
                            ]
                        }
                    },

                };
                
                TagManager.dataLayer(GtmDataLayerProductArgs2);
            }
        }
    }

    renderProductPageContent() {
        const {
            configurableVariantIndex,
            parameters,
            getLink,
            dataSource,
            updateConfigurableVariant,
            productOrVariant,
            areDetailsLoaded,
            getSelectedCustomizableOptions,
            productOptionsData,
            setBundlePrice,
            selectedBundlePrice,
            wishlist_count,
            scaleableItems,
            productSKU,
        } = this.props;
        console.log('this.props', this.props)
        return (
            <>
                <ProductGallery
                    product={productOrVariant}
                    areDetailsLoaded={areDetailsLoaded}
                />
                {<ProductActions
                    scaleableItems={scaleableItems}
                    productSKU={productSKU}
                    wishlist_count={wishlist_count}
                    getLink={getLink}
                    updateConfigurableVariant={updateConfigurableVariant}
                    product={dataSource}
                    productOrVariant={productOrVariant}
                    parameters={parameters}
                    areDetailsLoaded={areDetailsLoaded}
                    configurableVariantIndex={configurableVariantIndex}
                    getSelectedCustomizableOptions={getSelectedCustomizableOptions}
                    productOptionsData={productOptionsData}
                    setBundlePrice={setBundlePrice}
                    selectedBundlePrice={selectedBundlePrice}
                />}
            </>
        );
    }

    renderCustomizableOptions() {
        const {
            dataSource: { type_id, options },
            getSelectedCustomizableOptions,
            productOptionsData
        } = this.props;

        if (!isMobile.any()) {
            return null;
        }

        return (
            <ProductCustomizableOptions
                options={options || []}
                getSelectedCustomizableOptions={getSelectedCustomizableOptions}
                productOptionsData={productOptionsData}
            />
        );
    }

    renderAdditionalSections() {
        const {
            dataSource,
            parameters,
            areDetailsLoaded
        } = this.props;

        console.log('CustomerServiceInformation', this.props);
        return (
            <>
                {this.renderCustomizableOptions()}
                <ProductInformation
                    product={{ ...dataSource, parameters }}
                    areDetailsLoaded={areDetailsLoaded}
                />
                <FabricInformation
                    product={{ ...dataSource, parameters }}
                    areDetailsLoaded={areDetailsLoaded}
                />
                <DeliveryInformation
                    product={{ ...dataSource, parameters }}
                    areDetailsLoaded={areDetailsLoaded}
                />
                <CustomerServiceInformation
                    product={{ ...dataSource, parameters }}
                    areDetailsLoaded={areDetailsLoaded}
                />
                <ProductLinks
                    linkType={RELATED}
                    title={__('Recommended for you')}
                    areDetailsLoaded={areDetailsLoaded}
                />
                <ProductLinks
                    linkType={UPSELL}
                    title={__('You might also like')}
                    areDetailsLoaded={areDetailsLoaded}
                />
            </>
        );
    }

    render() {
        return (
            <main
                block="ProductPage"
                aria-label="Product page"
                itemScope
                itemType="http://schema.org/Product"
            >
                <ContentWrapper
                    wrapperMix={{ block: 'ProductPage', elem: 'Wrapper' }}
                    label={__('Main product details')}
                >
                    {this.renderProductPageContent()}
                </ContentWrapper>
                {this.renderAdditionalSections()}
            </main>
        );
    }
}

export default ProductPage;
