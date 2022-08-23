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

 import './MyStoresList.style';

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 import StoreDetailPopup from 'Component/StoreDetailPopup';
 import Loader from 'Component/Loader';
 import { customerType } from 'Type/Account';
 import ContentWrapper from 'Component/ContentWrapper';
 import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
 import { _storeByID } from 'Query/Complain.query';

 export class MyStoresList extends PureComponent {
    static propTypes = {
        showDetailPopup: PropTypes.func.isRequired,
    };

    state = {
        detail: null
    }

    renderDetailPopup = () => {
        const { detail } = this.state;
        return <StoreDetailPopup detail={detail}/>
    }

    getStoreDetail = async (e, item) => {
        const { showDetailPopup } = this.props;
        const { detail } = this.state;
        console.log("item", item)
        const res = await _storeByID(item.store_code);
        const parse = JSON.parse(res);
        let parsedDetail = parse.data.storeLocationDetails.location_details;
        parsedDetail[0]['open_msg'] = item.message;
        console.log("parsedDetail", parsedDetail);
        
        showDetailPopup();
        this.setState({detail:parsedDetail})
    }
     
     renderContent = () => {
        const { isLoading, showDetailPopup, storesList, data } = this.props;
        console.log("storesList", storesList);
        // if(storesList && storesList.length){
            return (
                <div>
                   <div className="headSection">
                       <p>Store Details</p>
                   </div>
                    <ul className="contentSec">
                        {
                            storesList && storesList.length ? storesList.map(item => {
                                return(
                                    <li className={"storeListLi","bgClass"} block="MyStoresList" elem="StoresItem">
                                        <button onClick={(e) => this.getStoreDetail(e,item)} className="storeListBtn">
                                            <div className="listingSection">
                                                <div className="leftSection">
                                                    <h4>{item.store_name}</h4>
                                                    <p>{item.store_distance} away - {item.message}</p>
                                                </div>
                                                <div className="iconSection">
                                                    <ArrowForwardIosIcon />
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                )
                            }) :
                            <li className={"storeListLi","bgClass"} block="MyStoresList" elem="StoresItem">
                                <button onClick={showDetailPopup} className="storeListBtn">
                                    <div className="listingSection">
                                        <div className="leftSection">
                                            <h4>No List Found</h4>
                                        </div>
                                    </div>
                                </button>
                            </li>
                            // <li className={"storeListLi","bgClass"} block="MyStoresList" elem="StoresItem">
                            //     <button onClick={showDetailPopup} className="storeListBtn">
                            //         <div className="listingSection">
                            //             <div className="leftSection">
                            //                 <h4>Shaheed-e-Millat</h4>
                            //                 <p>3.9 km away - Open untill 10 PM</p>
                            //             </div>
                            //             <div className="iconSection">
                            //                 <ArrowForwardIosIcon />
                            //             </div>
                            //         </div>
                            //     </button>
                            // </li>
                        }
                        {/* <li className={"storeListLi","bgClass"} block="MyStoresList" elem="StoresItem">
                            <button onClick={showDetailPopup} className="storeListBtn">
                                <div className="listingSection">
                                    <div className="leftSection">
                                        <h4>Shaheed-e-Millat</h4>
                                        <p>3.9 km away - Open untill 10 PM</p>
                                    </div>
                                    <div className="iconSection">
                                        <ArrowForwardIosIcon />
                                    </div>
                                </div>
                            </button>
                        </li>
                        <li className="storeListLi" block="MyStoresList" elem="StoresItem">
                            <button onClick={showDetailPopup} className="storeListBtn">
                                <div className="listingSection">
                                    <div className="leftSection">
                                        <h4>Shaheed-e-Millat</h4>
                                        <p>3.9 km away - Open untill 10 PM</p>
                                    </div>
                                    <div className="iconSection">
                                        <ArrowForwardIosIcon />
                                    </div>
                                </div>
                            </button>
                        </li>
                        <li className={"storeListLi","bgClass"} block="MyStoresList" elem="StoresItem">
                            <button onClick={showDetailPopup} className="storeListBtn">
                                <div className="listingSection">
                                    <div className="leftSection">
                                        <h4>Shaheed-e-Millat</h4>
                                        <p>3.9 km away - Open untill 10 PM</p>
                                    </div>
                                    <div className="iconSection">
                                        <ArrowForwardIosIcon />
                                    </div>
                                </div>
                            </button>
                        </li> */}
                    </ul>
                </div>
            );
        // }
        // else{
        //     return(
        //         <div>
        //            <ul className="contentSec">
        //             <li className={"storeListLi","bgClass"} block="MyStoresList" elem="StoresItem">
        //                     <button onClick={showDetailPopup} className="storeListBtn">
        //                         <div className="listingSection">
        //                             <div className="leftSection">
        //                                 <h4>No List Found</h4>
        //                             </div>
        //                         </div>
        //                     </button>
        //                 </li>
        //            </ul>
        //         </div>
        //     )
        // }
        
     }

     render() {
        const { isLoading } = this.props;
         return (
             <>
                <Loader isLoading={ isLoading } />
                <div>
                    { this.renderContent() }
                    { this.renderDetailPopup() }
                </div>
            </>
         )
         
     }
 }
 
 export default MyStoresList;