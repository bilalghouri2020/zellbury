/* eslint-disable react/no-array-index-key */
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

import './SlickWidget.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Link from 'Component/Link';
import Image from 'Component/Image';
import Html from 'Component/Html';

import SlickSlider from "react-slick";
//import Ripples from 'react-ripples'

/**
 * Homepage slider
 * @class SlickWidget
 */
export class SlickWidget extends PureComponent {
    static propTypes = {
        slider: PropTypes.shape({
            slides: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    slide_image: PropTypes.string,
                    description: PropTypes.string,
                    cat_link: PropTypes.string,
                    isPlaceholder: PropTypes.bool
                })
            )
        })
    };

    static defaultProps = {
        slider: [{}]
    };

    getSlideImage(slide) {
        const {
            slide_image
        } = slide;

        if (!slide_image) {
            return '';
        }

        return `/${slide_image}`;
    }

    renderSlide = (slide, i) => {
        const {
            description,
            name,
            cat_link,
            title: block,
            isPlaceholder
        } = slide;

        return (
            <Link
            block="SlickCard"
            elem="Link"
            to={ cat_link || '' }
            >
            <div
              block="SlickWidget"
              elem="Figure"
              key={ i }
            >
                <Image
                  mix={ { block: 'SlickWidget', elem: 'FigureImage' } }
                  ratio="custom"
                  src={ this.getSlideImage(slide) }
                isPlaceholder={ isPlaceholder }
                alt={ name }
                />
                <div
                  block="SlickWidget"
                  elem="Figcaption"
                  mix={ { block } }
                >
                    <span><Html content={ name || '' } /></span>
                    <span><Html content={ description || '' } /></span>
                </div>
            </div>
            </Link>
        );
    };

    render() {
        const { slider: { slides } } = this.props;
        var settings = {
            dots: false,
            infinite: false,
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        arrows: false,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        arrows: false,
                        slidesToShow: 1.15
                    }
                }
            ]
        };

        return (
            <SlickSlider {...settings}>
                { slides.map(this.renderSlide) }
            </SlickSlider>
        );
    }
}

export default SlickWidget;
