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

 import './GetConvenienceVoucher.style';
 import ContentWrapper from 'Component/ContentWrapper';
 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 import Loader from 'Component/Loader';
 import { customerType } from 'Type/Account';
 import history from 'Util/History';
 

 export class GetConvenienceVoucher extends PureComponent {
     static propTypes = {
         showConfirmPopup: PropTypes.func.isRequired,
         customer: customerType.isRequired
     };

     handlePopupConfirm = () => {
        //  const { hidePopup } = this.props;
        // hidePopup();
        history.push('/ordercomplain/orderslist');
     }

    //  renderConfirmPopup = () => {
    //     return <ExchangeFromStorePopup handlePopupConfirm={this.handlePopupConfirm} />
    //  }
     
     renderContent = () => {
        const { isLoading, showConfirmPopup } = this.props;
        return (
            <ContentWrapper>
               <div className="confirmation-wrapper">
                    <div className="mistake-help">
                        <p className="howwehelpHead">Get a convenience Voucher for your hassle</p>
                        <p className="howwehelp">If you are willing to keep the item as it is we will credit your zellbury account with loyalty credits.</p>
                        <p className="varycontent">Convenience voucher may vary between 6-10%.</p>
                    </div>
                    <div className="pickUpBtnSec">
                        <button type="text" onClick={() => this.handlePopupConfirm()}>Close</button>
                    </div>
                    {/* <div className="orSec"><p>OR</p></div>
                    <div className="btn-mistake">
                        <button className="button">Get convenience vouchers</button>
                    </div> */}
                </div>
           </ContentWrapper>
        );
     }

     render() {
        
         return (
            <div>
                { this.renderContent() }
                {/* { this.renderConfirmPopup() } */}
            </div>
         )
         
     }
 }
 
 export default GetConvenienceVoucher;