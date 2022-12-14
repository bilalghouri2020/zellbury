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

import './ProductConfigurableAttributes.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ExpandableContent from 'Component/ExpandableContent';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import ProductConfigurableAttributeDropdown from 'Component/ProductConfigurableAttributeDropdown';
import { MixType } from 'Type/Common';
import { AttributeType } from 'Type/ProductList';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export const sizeGuideImages = [];

export class ProductConfigurableAttributes extends PureComponent {
    static propTypes = {
        isContentExpanded: PropTypes.bool,
        numberOfPlaceholders: PropTypes.arrayOf(PropTypes.number),
        configurable_options: PropTypes.objectOf(AttributeType).isRequired,
        parameters: PropTypes.shape({}).isRequired,
        updateConfigurableVariant: PropTypes.func.isRequired,
        isReady: PropTypes.bool,
        mix: MixType,
        getIsConfigurableAttributeAvailable: PropTypes.func,
        handleOptionClick: PropTypes.func.isRequired,
        getSubHeading: PropTypes.func.isRequired,
        isSelected: PropTypes.func.isRequired,
        getLink: PropTypes.func.isRequired
    };

    static defaultProps = {
        isReady: true,
        mix: {},
        // eslint-disable-next-line no-magic-numbers
        numberOfPlaceholders: [6, 10, 7],
        isContentExpanded: false,
        getIsConfigurableAttributeAvailable: () => true
    };

    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0,
            isOpen: false
        };
    }

    renderConfigurableAttributeValue(attribute) {
        const {
            getIsConfigurableAttributeAvailable,
            handleOptionClick,
            getLink,
            variants,
            isSelected,
            scaleableItems,
            productOrVariant,
            productSKU,
        } = this.props;
        const { attribute_value } = attribute;
        return (
            <ProductAttributeValue
                productOrVariant={productOrVariant}
                productSKU={productSKU}
                scaleableItems={scaleableItems}
                key={attribute_value}
                attribute={attribute}
                isSelected={isSelected(attribute)}
                isAvailable={getIsConfigurableAttributeAvailable(attribute)}
                onClick={handleOptionClick}
                getLink={getLink}
                variants={variants}
            />
        );
    }

    renderSwatch(option) {
        const { attribute_values ,attribute_code} = option;
        let isColor =(attribute_code=='color');
        
        return (
            <div
                block="ProductConfigurableAttributes"
                elem="SwatchList"
                mods={{ isColor }}
            >
                { attribute_values.map((attribute_value) => (
                    this.renderConfigurableAttributeValue({ ...option, attribute_value })
                ))}
            </div>
        );
    }

    renderDropdown(option) {
        const {
            updateConfigurableVariant,
            getIsConfigurableAttributeAvailable,
            parameters
        } = this.props;

        return (
            <ProductConfigurableAttributeDropdown
                option={option}
                updateConfigurableVariant={updateConfigurableVariant}
                getIsConfigurableAttributeAvailable={getIsConfigurableAttributeAvailable}
                parameters={parameters}
            />
        );
    }

    renderPlaceholders() {
        const { numberOfPlaceholders, isContentExpanded } = this.props;

        return numberOfPlaceholders.map((length, i) => (
            <ExpandableContent
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                mix={{
                    block: 'ProductConfigurableAttributes',
                    elem: 'Expandable'
                }}
                isContentExpanded={isContentExpanded}
            >
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    block="ProductConfigurableAttributes"
                    elem="SwatchList"
                >
                    {Array.from({ length }, (_, i) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            block="ProductConfigurableAttributes"
                            elem="Placeholder"
                        />
                    ))}
                </div>
            </ExpandableContent>
        ));
    }

    renderSizeGuide() {
        const { photoIndex, isOpen } = this.state;

        const {
            product: {
                attributes: { size_guide: { attribute_value: size_guide } = {} } = {}
            }
        } = this.props;

        if (size_guide) {
            sizeGuideImages.push(size_guide);

            return (
                <section
                    block="ProductConfigurableAttributes"
                    elem="MeasurementPopup"
                >
                    All measurements are in inches, <a block="SizeGuide" elem="MeasureImage" onClick={() => this.setState({ isOpen: true })}>See Measurement Guide</a>

                    {isOpen && (
                        <Lightbox
                            mainSrc={sizeGuideImages[photoIndex]}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                            enableZoom={false}
                            imageTitle="How to measure"
                        />
                    )}
                </section>
            );
        }

        return null;
    }

    renderConfigurableAttributes() {
        const {
            configurable_options,
            isContentExpanded,
            variants,
            getSubHeading,
        } = this.props;
        const selectedAttributes = ['size', 'length', 'shoulder', 'chest', 'hip', 'waist', 'sleeves', 'collar'];
        return Object.values(configurable_options).map((option) => {
            const {
                attribute_label,
                attribute_code,
                attribute_options
            } = option;
            const [{ swatch_data }] = attribute_options ? Object.values(attribute_options) : [{}];
            const isSwatch = !!swatch_data;

            if (variants && attribute_code == 'size' && variants.length > 0) {
                return (
                    <ExpandableContent
                        key={attribute_code}
                        heading={attribute_label}
                        subHeading={getSubHeading(option)}
                        mix={{
                            block: 'ProductConfigurableAttributes',
                            elem: 'Expandable'
                        }}
                        isContentExpanded={isContentExpanded}
                    >
                        { this.renderSizeGuide()}

                        <div block="SizeAttributes" elem="LabelsCon">
                            {variants.map(({ sku, name, attributes }, i) => {
                                if (i == 0) {
                                    return <div key={i} block="SizeAttributes" elem="Labels">
                                        {Object.keys(attributes).map(function (key, index) {
                                            let pAttributes = attributes[key];
                                            if (selectedAttributes.indexOf(pAttributes.attribute_code) > -1) {
                                                return <span block="Attribute" elem="Label">{pAttributes.attribute_label}</span>
                                            }
                                        })}
                                    </div>
                                }
                            })}
                        </div>
                        { isSwatch ? this.renderSwatch(option) : this.renderDropdown(option)}
                    </ExpandableContent>
                );
            }

            return (
                <ExpandableContent
                    key={attribute_code}
                    heading={attribute_label}
                    subHeading={getSubHeading(option)}
                    mix={{
                        block: 'ProductConfigurableAttributes',
                        elem: 'Expandable'
                    }}
                    isContentExpanded={isContentExpanded}
                >
                    { isSwatch ? this.renderSwatch(option) : this.renderDropdown(option)}
                </ExpandableContent>
            );
        });
    }

    render() {
        const { isReady, mix } = this.props;
        return (
            <div
                block="ProductConfigurableAttributes"
                mods={{ isLoading: !isReady }}
                mix={mix}
            >
                { isReady ? this.renderConfigurableAttributes() : this.renderPlaceholders()}
            </div>
        );
    }
}

export default ProductConfigurableAttributes;
