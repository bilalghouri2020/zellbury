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

import './MyAccountTabList.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ExpandableContent from 'Component/ExpandableContent';
import MyAccountTabListItem from 'Component/MyAccountTabListItem';
import { activeTabType, tabMapType } from 'Type/Account';

export class MyAccountTabList extends PureComponent {
    static propTypes = {
        tabMap: tabMapType.isRequired,
        activeTab: activeTabType.isRequired,
        handleLogout: PropTypes.func.isRequired,
        changeActiveTab: PropTypes.func.isRequired
    };

    state = {
        isContentExpanded: false
    };

    toggleExpandableContent = () => {
        this.setState(({ isContentExpanded }) => ({ isContentExpanded: !isContentExpanded }));
    };

    onTabClick = (key) => {
        const { changeActiveTab } = this.props;
        this.toggleExpandableContent();
        changeActiveTab(key);
    };

    renderTabListItem = (tabEntry) => {
        const { activeTab } = this.props;
        const [key] = tabEntry;

        return (
            <MyAccountTabListItem
              key={ key }
              isActive={ activeTab === key }
              changeActiveTab={ this.onTabClick }
              tabEntry={ tabEntry }
            />
        );
    };

    renderComplainTab() {
        const { handleComplain } = this.props;

        return (
            <li
              key="my_complain"
              block="MyAccountTabListItem"
            >
                <button
                  block="MyAccountTabListItem"
                  elem="Button"
                  onClick={ handleComplain }
                  role="link"
                >
                    { __('My Complain') }
                </button>
            </li>
        );
    }

    renderLogoutTab() {
        const { handleLogout } = this.props;

        return (
            <li
              key="logout"
              block="MyAccountTabListItem"
            >
                <button
                  block="MyAccountTabListItem"
                  elem="Button"
                  onClick={ handleLogout }
                  role="link"
                >
                    { __('Logout') }
                </button>
            </li>
        );
    }

    render() {
        const { tabMap, activeTab } = this.props;
        const { isContentExpanded } = this.state;
        const { name } = tabMap[activeTab];

        const tabs = [
            ...Object.entries(tabMap).map(this.renderTabListItem),
            this.renderComplainTab(),
            this.renderLogoutTab()
        ];

        return (
            <ExpandableContent
              heading={ name }
              isContentExpanded={ isContentExpanded }
              onClick={ this.toggleExpandableContent }
              mix={ { block: 'MyAccountTabList' } }
            >
                <ul>
                    { tabs }
                </ul>
            </ExpandableContent>
        );
    }
}

export default MyAccountTabList;
