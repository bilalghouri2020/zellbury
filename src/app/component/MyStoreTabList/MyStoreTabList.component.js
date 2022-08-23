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

 import './MyStoreTabList.style';

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 
 import ExpandableContent from 'Component/ExpandableContent';
 import MyStoreTabListItem from 'Component/MyStoreTabListItem';
 import { activeComplainTabType, tabMapType } from 'Type/Account';
 
 export class MyStoreTabList extends PureComponent {
     static propTypes = {
         tabMap: tabMapType.isRequired,
         activeTab: activeComplainTabType.isRequired,
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
             <MyStoreTabListItem
               key={ key }
               isActive={ activeTab === key }
               changeActiveTab={ this.onTabClick }
               tabEntry={ tabEntry }
             />
         );
     };
 
     renderLogoutTab() {
         const { handleLogout } = this.props;
 
         return (
             <li
               key="logout"
               block="MyStoreTabListItem"
             >
                 <button
                   block="MyStoreTabListItem"
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
        
         console.log('props', this.props);

         const tabs = [
             ...Object.entries(tabMap).map(this.renderTabListItem)
         ];
 
         return (
             <ExpandableContent
               heading={ name }
               isContentExpanded={ isContentExpanded }
               onClick={ this.toggleExpandableContent }
               mix={ { block: 'MyStoreTabList' } }
             >
                 <ul>
                     { tabs }
                 </ul>
             </ExpandableContent>
         );
     }
 }
 
 export default MyStoreTabList;
 