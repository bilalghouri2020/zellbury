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

import jQuery from 'jquery';
import Html from 'Component/Html';
import { ProductType, AttributeType } from 'Type/ProductList';
import ContentWrapper from 'Component/ContentWrapper';
import ExpandableContent from 'Component/ExpandableContent';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import BrowserDatabase from 'Util/BrowserDatabase';

import './DeliveryInformation.style';

export default class DeliveryInformation extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        attributesWithValues: AttributeType.isRequired
    };

    componentDidUpdate() {
        jQuery(document).ready(function($){
            $('#btnPakistan').click(function(){
                if(!$(this).hasClass('active')){ //this is the start of our condition
                    $('.tablinks.active').removeClass('active');
                    $('.tabcontent.active').removeClass('active');

                    $(this).addClass('active');
                    $('#Pakistan').addClass('active');
                }
            });
            $('#btnInternational').click(function(){
                if(!$(this).hasClass('active')){ //this is the start of our condition
                    $('.tablinks.active').removeClass('active');
                    $('.tabcontent.active').removeClass('active');

                    $(this).addClass('active');
                    $('#International').addClass('active');
                }
            });
        });
    }

    renderDescription() {
        const { StaticBlocks } = BrowserDatabase.getItem('config') || {
            StaticBlocks: []
        };

        if (!StaticBlocks) {
            return null;
        }

        let deliveryHtml = '';
        StaticBlocks.map(({identifier, content}, i) => {
            if(identifier == 'delivery-returns-block')
            {
                deliveryHtml = content;
            }
        })

        return (
            <div>
                <Html content={ deliveryHtml } />
            </div>
        );
    }

    renderContent() {
        return (
            <ExpandableContent
              heading={ __('Delivery information') }
              mix={ { block: 'DeliveryInformation', elem: 'Content' } }
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
              label="Delivery information"
              mix={ { block: 'DeliveryInformation' } }
              wrapperMix={ { block: 'DeliveryInformation', elem: 'Wrapper' } }
            >
                { this.renderContent() }
            </ContentWrapper>
        );
    }
}
