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

import './MyStoreTabListItem.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { tabType } from 'Type/Account';

export class MyStoreTabListItem extends PureComponent {
    static propTypes = {
        tabEntry: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                tabType
            ])
        ).isRequired,
        isActive: PropTypes.bool,
        changeActiveTab: PropTypes.func.isRequired
    };

    static defaultProps = {
        isActive: false
    };

    changeActiveTab = () => {
        const { changeActiveTab, tabEntry: [key] } = this.props;
        console.log('in change Store List Item [key]', [key]);
        console.log("this.props in change Store List Item", this.props);
        changeActiveTab(key);
    };

    render() {
        const { tabEntry: [, { name }], isActive } = this.props;

        return (
            <li
              block="MyStoreTabListItem"
              mods={ { isActive } }
            >
                <button
                  block="MyStoreTabListItem"
                  elem="Button"
                  onClick={ this.changeActiveTab }
                  role="link"
                >
                    { name }
                </button>
            </li>
        );
    }
}

export default MyStoreTabListItem;
