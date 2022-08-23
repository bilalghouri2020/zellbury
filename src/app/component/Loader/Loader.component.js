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

import './Loader.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

/**
 * Loader component
 * Loaders overlay to identify loading
 * @class Loader
 */
export class Loader extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired
    };

    renderMain() {
        return (
            <div block="Loader" elem="FlexUnit">
                <div block="Loader" elem="FlexHeart">
                    <span block="Loader" elem="FlexHeartPiece-0" />
                    <span block="Loader" elem="FlexHeartPiece-1" />
                    <span block="Loader" elem="FlexHeartPiece-2" />
                    <span block="Loader" elem="FlexHeartPiece-3" />
                    <span block="Loader" elem="FlexHeartPiece-4" />
                    <span block="Loader" elem="FlexHeartPiece-5" />
                    <span block="Loader" elem="FlexHeartPiece-6" />
                    <span block="Loader" elem="FlexHeartPiece-7" />
                    <span block="Loader" elem="FlexHeartPiece-8" />
                </div>
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;

        if (!isLoading) {
            return null;
        }

        return (
            <div block="Loader" elem="LoaderWrapper">
                <div block="Loader" elem="FlexContainer">
                    { this.renderMain() }
                </div>
            </div>
        );
    }
}

export default Loader;
