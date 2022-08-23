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

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 import { connect } from 'react-redux';
 
 import MyStoreTabList from './MyStoreTabList.component';
 
 export const MyAccountDispatcher = import(
     /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
     'Store/MyAccount/MyAccount.dispatcher'
 );
 
 export const mapDispatchToProps = (dispatch) => ({
     logout: () => MyAccountDispatcher.then(({ default: dispatcher }) => dispatcher.logout(null, dispatch))
 });
 
 export class MyStoreTabListContainer extends PureComponent {
     static propTypes = {
         onSignOut: PropTypes.func,
         logout: PropTypes.func.isRequired
     };
 
     static defaultProps = {
         onSignOut: () => { }
     };
 
     containerFunctions = {
         handleLogout: this.handleLogout.bind(this)
     };
 
     handleLogout() {
         const { onSignOut, logout } = this.props;
         logout().then(z => {
             this.setState({ state: "signIn", isOverlayVisible: true, isSignedIn: false }, () => {
             });
         });
          
     }
 
     render() {
         return (
             <MyStoreTabList
                 {...this.props}
                 {...this.containerFunctions}
             />
         );
     }
 }
 
 export default connect(null, mapDispatchToProps)(MyStoreTabListContainer);
 