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
import { isSignedIn } from 'Util/Auth';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { appendWithStoreCode } from 'Util/Url';
import isMobile from 'Util/Mobile';
import history from 'Util/History';
import { ProductType } from 'Type/ProductList';
import { showNotification } from 'Store/Notification/Notification.action';
import {
    BUNDLE,
    CONFIGURABLE,
    GROUPED
} from 'Util/Product';
import BrowserDatabase from 'Util/BrowserDatabase';
import ProductActions from './ProductActions.component';
import { DEFAULT_MAX_PRODUCTS } from './ProductActions.config';

export const mapStateToProps = (state) => ({
    groupedProductQuantity: state.ProductReducer.groupedProductQuantity,
});
export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
});
export class ProductActionsContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        product: ProductType.isRequired,
        productOrVariant: PropTypes.object.isRequired,
        configurableVariantIndex: PropTypes.number.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        parameters: PropTypes.objectOf(PropTypes.string).isRequired,
        selectedBundlePrice: PropTypes.number.isRequired,
        getLink: PropTypes.func.isRequired
    };

    static getMinQuantity(props) {
        const {
            product: { stock_item: { min_sale_qty } = {}, variants } = {},
            configurableVariantIndex
        } = props;

        if (!min_sale_qty) {
            return 1;
        }
        if (!configurableVariantIndex && !variants) {
            return min_sale_qty;
        }

        const { stock_item: { min_sale_qty: minVariantQty } = {} } = variants[configurableVariantIndex] || {};

        return minVariantQty || min_sale_qty;
    }

    static getMaxQuantity(props) {
        const {
            product: {
                stock_item: {
                    max_sale_qty
                } = {},
                variants
            } = {},
            configurableVariantIndex
        } = props;

        if (!max_sale_qty) {
            return DEFAULT_MAX_PRODUCTS;
        }

        if (configurableVariantIndex === -1 || !Object.keys(variants).length) {
            return max_sale_qty;
        }

        const {
            stock_item: {
                max_sale_qty: maxVariantQty
            } = {}
        } = variants[configurableVariantIndex] || {};

        return maxVariantQty || max_sale_qty;
    }
    state = {
        dayName: '',
        city: '',
        pushed: false,
        showEstimates: false,
        quantity: 1.0,
        groupedProductQuantity: {},
    };

    containerFunctions = {
        getDeliveryEstimate: this.getDeliveryEstimate.bind(this),
        showOnlyIfLoaded: this.showOnlyIfLoaded.bind(this),
        onProductValidationError: this.onProductValidationError.bind(this),
        getIsOptionInCurrentVariant: this.getIsOptionInCurrentVariant.bind(this),
        setQuantity: this.setQuantity.bind(this),
        // setDefaultQuantity: this.setDefaultQuantity.bind(this),
        setGroupedProductQuantity: this._setGroupedProductQuantity.bind(this),
        clearGroupedProductQuantity: this._clearGroupedProductQuantity.bind(this),
        getIsConfigurableAttributeAvailable: this.getIsConfigurableAttributeAvailable.bind(this)
    };
    componentDidMount() {
        //const { getDefaultPosition } = this.props;
        //this.setState({ quantity: getDefaultPosition() })
        if (isSignedIn()) {
            let { city, addresses } = BrowserDatabase.getItem('customer')
            let shippingAddress = addresses.find(x => x.default_billing && x.default_shipping)
            if (shippingAddress) {
                this.getEstimatedDay(shippingAddress.city)
                // do some work
            }
            else if (city) {
                this.getEstimatedDay(city)
            }
            else {

            }
        }
    }

    getEstimatedDay(city) {
        // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // var d = new Date();
        // if (city == 'Karachi')
        //     d.setDate(d.getDate() + 5);
        // else {
        //     d.setDate(d.getDate() + 6);
        // }
        // let dayName = days[d.getDay()];
        // this.setState({ city, showEstimates: true, dayName });
        // return days[d.getDay()];
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var graphql = JSON.stringify({
            query: `{\ncityEstimateGet(city: \"${city}\") {\nitems {\nid\ncity\nvalue\n}\n}\n}`,
            variables: {}
        })
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: graphql,
            redirect: 'follow'
        };
        fetch(`${window.location.origin}/graphql`, requestOptions)
            .then(response => response.text())
            .then(result => {
                let response = JSON.parse(result);
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var d = new Date();
                let daysAfter =parseInt(response.data.cityEstimateGet.items[0].value);
                d.setDate(d.getDate() + daysAfter);
                let dayName = days[d.getDay()];
                this.setState({ city, showEstimates: true, dayName });
            })
            .catch(error => console.log('error', error));
    }
    getDeliveryEstimate() {
        const { showNotification } = this.props;
        if (isSignedIn()) {
            let { city, addresses } = BrowserDatabase.getItem('customer')
            let shippingAddress = addresses.find(x => x.default_billing && x.default_shipping)
            if (shippingAddress) {
                this.getEstimatedDay(shippingAddress.city)
            }
            else if (city) {
                this.getEstimatedDay(city)
            }
            else {

            }
        }
        else {
            showNotification('info', __('Please sign-in to complete checkout!'));
            if (isMobile.any()) { // for all mobile devices, simply switch route
                history.push({ pathname: appendWithStoreCode('/my-account') });
                return;
            }
            document.getElementsByClassName('Header-Button_type_account')[0].click()
        }

        //alert('work in progress')
    }
    static getDerivedStateFromProps(props, state) {
        const { quantity } = state;
        const minQty = ProductActionsContainer.getMinQuantity(props);
        const maxQty = ProductActionsContainer.getMaxQuantity(props);

        if (quantity < minQty) {
            return { quantity: minQty };
        }
        if (quantity > maxQty) {
            return { quantity: maxQty };
        }

        return null;
    }

    onConfigurableProductError = this.onProductError.bind(this, this.configurableOptionsRef);

    onGroupedProductError = this.onProductError.bind(this, this.groupedProductsRef);

    onProductError(ref) {
        if (!ref) {
            return;
        }
        const { current } = ref;

        current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        current.classList.remove('animate');
        // eslint-disable-next-line no-unused-expressions
        current.offsetWidth; // trigger a DOM reflow
        current.classList.add('animate');
    }

    onProductValidationError(type) {
        switch (type) {
            case CONFIGURABLE:
                this.onConfigurableProductError();
                break;
            case GROUPED:
                this.onGroupedProductError();
                break;
            default:
                break;
        }
    }
    getIsInMeter() {
        const { productOrVariant } = this.props;
        let IsInMeter = '';
        if (productOrVariant && Object.keys(productOrVariant).length > 0) {
            if (productOrVariant.attributes && productOrVariant.attributes.IsInMeter) {
                IsInMeter = productOrVariant.attributes.IsInMeter.attribute_value;
            }
        }
        return IsInMeter;
    }

    setQuantity(value) {
        // let val =document.getElementById('main_item_qty')
        // if(val)
        // {
        //     this.setState({ quantity: parseFloat(val.value) });
        //     this.state.quantity = parseFloat(value);
        // }

        // else
        // {
        //     this.setState({ quantity: parseFloat(value) });
        //     this.state.quantity = parseFloat(value);
        // }
        //setTimeout(() => {
        this.setState({ quantity: parseFloat(value) });
        //}, 1000)

    }

    // TODO: make key=>value based
    getIsOptionInCurrentVariant(attribute, value) {
        const { configurableVariantIndex, product: { variants } } = this.props;
        if (!variants) {
            return false;
        }

        return variants[configurableVariantIndex].product[attribute] === value;
    }

    getIsConfigurableAttributeAvailable({ attribute_code, attribute_value }) {
        const { parameters, product: { variants } } = this.props;

        const isAttributeSelected = Object.hasOwnProperty.call(parameters, attribute_code);

        // If value matches current attribute_value, option should be enabled
        if (isAttributeSelected && parameters[attribute_code] === attribute_value) {
            return true;
        }

        const parameterPairs = Object.entries(parameters);

        const selectedAttributes = isAttributeSelected
            // Need to exclude itself, otherwise different attribute_values of the same attribute_code will always be disabled
            ? parameterPairs.filter(([key]) => key !== attribute_code)
            : parameterPairs;

        return variants
            .some(({ stock_status, attributes }) => {
                const { attribute_value: foundValue } = attributes[attribute_code] || {};

                return (
                    stock_status === 'IN_STOCK'
                    // Variant must have currently checked attribute_code and attribute_value
                    && foundValue === attribute_value
                    // Variant must have all currently selected attributes
                    && selectedAttributes.every(([key, value]) => attributes[key].attribute_value === value)
                );
            });
    }

    containerProps = () => ({
        minQuantity: ProductActionsContainer.getMinQuantity(this.props),
        maxQuantity: ProductActionsContainer.getMaxQuantity(this.props),
        groupedProductQuantity: this._getGroupedProductQuantity(),
        productPrice: this.getProductPrice(),
        productName: this.getProductName(),
        offerCount: this.getOfferCount(),
        offerType: this.getOfferType(),
        stockMeta: this.getStockMeta(),
        metaLink: this.getMetaLink()
    });

    getProductName() {
        const {
            product,
            product: { variants = [] },
            configurableVariantIndex
        } = this.props;

        const {
            name
        } = variants[configurableVariantIndex] || product;

        return name;
    }

    getMetaLink() {
        const { getLink } = this.props;
        return window.location.origin + getLink().replace(/\?.*/, '');
    }

    getStockMeta() {
        const {
            product,
            product: { variants = [] },
            configurableVariantIndex
        } = this.props;

        const {
            stock_status
        } = variants[configurableVariantIndex] || product;

        if (stock_status === 'OUT_OF_STOCK') {
            return 'https://schema.org/OutOfStock';
        }

        return 'https://schema.org/InStock';
    }

    getOfferType() {
        const { product: { variants } } = this.props;

        if (variants && variants.length >= 1) {
            return 'https://schema.org/AggregateOffer';
        }

        return 'https://schema.org/Offer';
    }

    getOfferCount() {
        const { product: { variants } } = this.props;

        if (variants && variants.length) {
            return variants.length;
        }

        return 0;
    }

    getProductPrice() {
        const {
            product,
            product: { variants = [], type_id },
            configurableVariantIndex,
            selectedBundlePrice
        } = this.props;

        const {
            price_range
        } = variants[configurableVariantIndex] || product;

        if (type_id === BUNDLE) {
            const { price_range: { minimum_price: { regular_price: { currency } } } } = product;
            const priceValue = { value: selectedBundlePrice, currency };

            return {
                minimum_price: {
                    final_price: priceValue,
                    regular_price: priceValue
                }
            };
        }

        return price_range;
    }

    _getGroupedProductQuantity() {
        const { groupedProductQuantity } = this.state;
        return groupedProductQuantity;
    }

    _setGroupedProductQuantity(id, value) {
        this.setState(({ groupedProductQuantity }) => ({
            groupedProductQuantity: {
                ...groupedProductQuantity,
                [id]: value
            }
        }));
    }

    _clearGroupedProductQuantity() {
        this.setState({ groupedProductQuantity: {} });
    }

    showOnlyIfLoaded(expression, content, placeholder = content) {
        const { areDetailsLoaded } = this.props;

        if (!areDetailsLoaded) {
            return placeholder;
        }
        if (areDetailsLoaded && !expression) {
            return null;
        }

        return content;
    }

    render() {
        return (
            <ProductActions
                {...this.props}
                {...this.state}
                {...this.containerProps()}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductActionsContainer);
