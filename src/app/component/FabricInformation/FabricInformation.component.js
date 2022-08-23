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

import './FabricInformation.style';

export default class FabricInformation extends PureComponent {
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

        let fabricHtml = '';
        StaticBlocks.map(({identifier, content}, i) => {
            if(identifier == 'fabric-care-instructions-block')
            {
                fabricHtml = content;
            }
        })

        return (
            <div>
                <Html content={ fabricHtml } />
            </div>
        );
    }

    renderContent() {
        return (
            <ExpandableContent
              heading={ __('Fabric information') }
              mix={ { block: 'FabricInformation', elem: 'Content' } }
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
              label="Fabric information"
              mix={ { block: 'FabricInformation' } }
              wrapperMix={ { block: 'FabricInformation', elem: 'Wrapper' } }
            >
                { this.renderContent() }
            </ContentWrapper>
        );
    }
}
