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

import { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Html from 'Component/Html';
import { ProductType, AttributeType } from 'Type/ProductList';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import BrowserDatabase from 'Util/BrowserDatabase';

import './CustomerServiceInformation.style';

export default class CustomerServiceInformation extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        attributesWithValues: AttributeType.isRequired
    };

    renderAttribute = ([attributeLabel, valueLabel]) => (
        <Fragment key={ attributeLabel }>
            <dt block="ProductInformation" elem="AttributeLabel">
                { attributeLabel }
            </dt>
            <dd block="ProductInformation" elem="ValueLabel">
                <ProductAttributeValue
                  key={ attributeLabel }
                  attribute={ valueLabel }
                  isFormattedAsText
                />
            </dd>
        </Fragment>
    );

    renderDescription() {
        const { StaticBlocks } = BrowserDatabase.getItem('config') || {
            StaticBlocks: []
        };

        if (!StaticBlocks) {
            return null;
        }

        let customerHtml = '';
        StaticBlocks.map(({identifier, content}, i) => {
            if(identifier == 'footerx')
            {
                customerHtml = content;
            }
        })

        return (
            <div>
                <Html content={ customerHtml } />
            </div>
        );
    }

    renderContent() {
        return (
            <ExpandableContent
              heading={ __('Customer Service') }
              mix={ { block: 'CustomerServiceInformation', elem: 'Content' } }
            >
                { this.renderDescription() }
            </ExpandableContent>
        );
    }

    render() {
        const {
            areDetailsLoaded,
            product: {
                description: { html } = {}
            }
        } = this.props;

        if (!html && !areDetailsLoaded) {
            return null;
        }

        return (
            <ContentWrapper
              label="Customer Service"
              mix={ { block: 'CustomerServiceInformation' } }
              wrapperMix={ { block: 'CustomerServiceInformation', elem: 'Wrapper' } }
            >
                { this.renderContent() }
            </ContentWrapper>
        );
    }
}
