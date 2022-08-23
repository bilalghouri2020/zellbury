/* eslint-disable no-magic-numbers */

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

import './ProductAttributeValue.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { MixType } from 'Type/Common';
import { AttributeType } from 'Type/ProductList';

export class ProductAttributeValue extends PureComponent {
    static propTypes = {
        getLink: PropTypes.func,
        onClick: PropTypes.func,
        attribute: AttributeType.isRequired,
        isSelected: PropTypes.bool,
        isAvailable: PropTypes.bool,
        mix: MixType,
        isFormattedAsText: PropTypes.bool
    };
    state = {
        scaleableQuantity: 0
    }
    static defaultProps = {
        isSelected: false,
        onClick: () => { },
        getLink: () => { },
        mix: {},
        isAvailable: true,
        isFormattedAsText: false
    };

    clickHandler = this.clickHandler.bind(this);

    getOptionLabel = this.getOptionLabel.bind(this);

    getIsColorLight(hex) {
        const color = (hex.charAt(0) === '#') ? hex.substring(1, 7) : hex;
        const r = parseInt(color.substring(0, 2), 16); // hexToR
        const g = parseInt(color.substring(2, 4), 16); // hexToG
        const b = parseInt(color.substring(4, 6), 16); // hexToB
        return ((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186;
    }

    getOptionLabel(value) {
        const { attribute: { attribute_options } } = this.props;

        if (attribute_options) {
            const optionValues = attribute_options[value];
            if (optionValues) {
                return optionValues;
            }
        }

        return {};
    }

    clickHandler(e) {
        const { onClick, attribute } = this.props;
        e.preventDefault();
        onClick(attribute);
    }

    renderTextAttribute() {
        const { attribute: { attribute_value } } = this.props;
        return this.renderStringValue(attribute_value);
    }

    renderBooleanAttribute() {
        const { attribute: { attribute_value } } = this.props;
        return this.renderStringValue(attribute_value ? __('Yes') : __('No'));
    }

    renderMultiSelectAttribute() {
        const { attribute: { attribute_value } } = this.props;

        const labelsArray = attribute_value.split(',').reduce((labels, value) => {
            const { label } = this.getOptionLabel(value);
            if (label) {
                labels.push(label);
            }

            return labels;
        }, []);

        return this.renderStringValue(labelsArray.length ? labelsArray.join(', ') : __('N/A'));
    }

    renderSelectAttribute() {
        const { attribute: { attribute_value } } = this.props;
        const attributeOption = this.getOptionLabel(attribute_value);
        const { label, swatch_data } = attributeOption;

        if (!swatch_data) {
            return this.renderStringValue(label || __('N/A'));
        }

        const { value, type } = swatch_data;

        switch (type) {
            case '0':
                return this.renderStringValue(value, label);
            case '1':
                return this.renderColorValue(value, label);
            case '2':
                return this.renderImageValue(value, label);
            default:
                return this.renderStringValue(label || __('N/A'));
        }
    }

    renderPlaceholder() {
        return (
            <div
                block="ProductAttributeValue"
                elem="Placeholder"
            />
        );
    }

    renderColorValue(color, label) {
        const { isFormattedAsText, isSelected } = this.props;
        const isLight = this.getIsColorLight(color);

        if (isFormattedAsText) {
            return label || __('N/A');
        }

        return (
            <data
                block="ProductAttributeValue"
                elem="Color"
                value={label}
                title={label}
                style={{
                    '--option-background-color': color,
                    '--option-border-color': isLight ? '#000' : color,
                    '--option-check-mark-background': isLight ? '#000' : '#fff',
                    '--option-is-selected': +isSelected
                }}
            />
        );
    }

    renderImageValue(img, label) {
        const { isFormattedAsText, isSelected, scaleableItems, productOrVariant, variants } = this.props;
        let current_prod = undefined;
        if (variants && variants.length>0) {
            current_prod = variants.find(x => x.attributes.color.attribute_options[Object.keys(x.attributes.color.attribute_options)[0]].swatch_data.value == img);
         }


        let isLow = true;
        if (isFormattedAsText) {
            return label || __('N/A');
        }
        if (scaleableItems) {
            let scaleableQuantity = undefined;
            if (current_prod)
                scaleableQuantity = scaleableItems.find(x => x.sku == current_prod.sku);

            if (scaleableQuantity) {
                this.setState({ scaleableQuantity: scaleableQuantity.salable })
                isLow = (parseInt(scaleableQuantity.salable) <= 10);

                return (
                    <>
                        <span block="ProductAttributeValue"
                            elem="AttributeStock-Image"
                            mods={{ isLow }}
                        >{`${scaleableQuantity.salable} Left`}</span>
                        <img
                            block="ProductAttributeValue"
                            elem="Image"
                            src={`/media/attribute/swatch${img}`}
                            alt={label}
                        />
                        <data
                            block="ProductAttributeValue"
                            elem="Image-Overlay"
                            value={label}
                            title={label}
                            style={{
                                '--option-is-selected': +isSelected
                            }}
                        />
                    </>
                );

            }
        }
        return (
            <>
                <span block="ProductAttributeValue"
                    elem="AttributeStock-Image"
                    mods={{ isLow }}
                >{`0 Left`}</span>
                <img
                    block="ProductAttributeValue"
                    elem="Image"
                    src={`/media/attribute/swatch${img}`}
                    alt={label}
                />
                <data
                    block="ProductAttributeValue"
                    elem="Image-Overlay"
                    value={label}
                    title={label}
                    style={{
                        '--option-is-selected': +isSelected
                    }}
                />
            </>
        );
    }

    renderDropdown(value) {
        const { isSelected } = this.props;

        return (
            <Field
                id={value}
                name={value}
                type="checkbox"
                label={value}
                value={value}
                mix={{
                    block: 'ProductAttributeValue',
                    elem: 'Text',
                    mods: { isSelected }
                }}
                checked={isSelected}
            />
        );
    }

    renderStringValue(value, label) {
        const { isFormattedAsText, isSelected } = this.props;
        const isSwatch = label;

        if (isFormattedAsText) {
            return label || value || __('N/A');
        }

        if (!isSwatch) {
            return this.renderDropdown(value);
        }

        return (
            <span
                block="ProductAttributeValue"
                elem="String"
                mods={{ isSelected }}
                title={label}
            >
                { value}
            </span>
        );
    }
    // getQuantity(id)
    // {

    // }
    renderAttributeStock(sku) {
        const { scaleableItems } = this.props;
        let isLow = true;
        if (scaleableItems) {
            let scaleableQuantity = scaleableItems.find(x => x.sku == sku);
            if (scaleableQuantity) {
                this.setState({ scaleableQuantity: scaleableQuantity.salable })
                isLow = (parseInt(scaleableQuantity.salable) <= 10);
                return (
                    <>
                        <span block="ProductAttributeValue"
                            elem="AttributeStock"
                            mods={{ isLow }}
                        >{`${scaleableQuantity.salable} Left`}</span>
                    </>)

            }
        }
        return (
            <>
                <span block="ProductAttributeValue"
                    elem="AttributeStock"
                    mods={{ isLow }}
                >{`0 Left`}</span>
            </>)
    }
    renderAttributeByType() {
        const { attribute: { attribute_type } } = this.props;
        switch (attribute_type) {
            case 'select':
                return this.renderSelectAttribute();
            case 'boolean':
                return this.renderBooleanAttribute();
            case 'text':
                return this.renderTextAttribute();
            case 'multiselect':
                return this.renderMultiSelectAttribute();
            default:
                return this.renderPlaceholder();
        }
    }

    render() {
        const {
            getLink,
            attribute,
            variants,
            isAvailable,
            attribute: { attribute_code, attribute_value },
            mix,
            isFormattedAsText,
        } = this.props;
        if (attribute_code && !attribute_value) {
            return null;
        }

        const href = getLink(attribute);
        // Invert to apply css rule without using not()
        const isNotAvailable = !isAvailable;

        const selectedAttributes = ['size', 'length', 'shoulder', 'chest', 'hip', 'waist', 'sleeves', 'collar'];
        const onClickHandler = this.clickHandler;
        const onRenderAttributeByType = this.renderAttributeByType();

        if (isFormattedAsText) {
            return (
                <div
                    block="ProductAttributeValue"
                    mix={mix}
                >
                    { this.renderAttributeByType()}
                </div>
            );
        }

        if (variants && attribute_code == 'size' && variants.length > 0) {
            return (
                <div block="SizeAttributes" elem="ValuesCon">
                    {variants.map(({ attributes, stock_item, sku }, i) => {
                        return <div key={i} block="SizeAttributes" elem="Values">
                            {Object.keys(attributes).map((key, index) => {
                                if (attribute_value == attributes['size'].attribute_value) {
                                    let pAttributes = attributes[key];
                                    if (selectedAttributes.indexOf(pAttributes.attribute_code) > -1) {
                                        if (pAttributes.attribute_code == 'size') {
                                            return (
                                                <>
                                                    <span block="Attribute" elem="Value" className="d_grid">
                                                        <a
                                                            href={href}
                                                            block="ProductAttributeValue"
                                                            mods={{ isNotAvailable }}
                                                            onClick={onClickHandler}
                                                            aria-hidden={isNotAvailable}
                                                            mix={mix}
                                                        >
                                                            {onRenderAttributeByType}
                                                        </a>
                                                        {/* {this.getQuantity(stock_item.id)} */}
                                                        {this.renderAttributeStock(sku)}
                                                    </span>

                                                </>
                                            )
                                        }
                                        else {
                                            let attOptions = pAttributes.attribute_options;
                                            let valLab = pAttributes.attribute_value;
                                            let optionLabel = '';
                                            if (attOptions && valLab) {
                                                for (var key in attOptions) {
                                                    if (attOptions.hasOwnProperty(key)) {
                                                        if (attOptions[key].value === valLab)
                                                            optionLabel = attOptions[key].label;
                                                    }
                                                }
                                            }

                                            return <span block="Attribute" elem="Value">{optionLabel}</span>
                                        }
                                    }
                                }
                            })}
                        </div>
                    })}
                </div>
            );
        }

        return (
            <a
                href={href}
                block="ProductAttributeValue"
                mods={{ isNotAvailable }}
                onClick={this.clickHandler}
                aria-hidden={isNotAvailable}
                mix={mix}
            >
                { this.renderAttributeByType()}
            </a>
        );
    }
}

export default ProductAttributeValue;
