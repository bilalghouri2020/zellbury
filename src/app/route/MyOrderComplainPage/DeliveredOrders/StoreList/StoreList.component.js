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

import './StoreList.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
import Loader from 'Component/Loader';
import { customerType } from 'Type/Account';
import ContentWrapper from 'Component/ContentWrapper';
import MyStoresList from 'Component/MyStoresList';
import history from 'Util/History';

export class StoreList extends PureComponent {



    //  renderConfirmPopup = () => {
    //     return <ExchangeFromStorePopup handlePopupConfirm={this.handlePopupConfirm} />
    //  }

    componentDidMount() {
        const { setHeaderState } = this.props
        setHeaderState({ name: 'stores-list', title: 'Stores List', onBackClick: () => history.push('/') });
    }
    renderContent = () => {
        const { isLoading, showConfirmPopup, location, complainData, storeList } = this.props;
        console.log('vshdbsd25', complainData);
        if (complainData) {
            let orderCity = complainData.myData.locationData.getOrderById.shipping_info.shipping_address.city ? complainData.myData.locationData.getOrderById.shipping_info.shipping_address.city : 'Karachi';
            return (
                <ContentWrapper
                    label="StoreSection"
                    mix={{ block: 'StoreSection', elem: 'Wrapper' }}
                    wrapperMix={{ block: 'StoreSection', elem: 'ContentWrapper' }}
                >
                    <div className="storesSecHead">
                        <h3>That was Easy!</h3>
                        <p>We have shared your details with our store managemnet in {orderCity}</p>
                        <p>You can visit any of the following stores to exchange your item</p>
                    </div>
                    <MyStoresList data={complainData} />
                </ContentWrapper>
            );
        }
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div>
                {this.renderContent()}
                {/* { this.renderConfirmPopup() } */}
            </div>
        )

    }
}

export default StoreList;