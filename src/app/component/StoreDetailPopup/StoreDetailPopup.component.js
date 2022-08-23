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

import './StoreDetailPopup.style';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import Popup from 'Component/Popup';
import { customerType } from 'Type/Account';
import CmsBlock from "Component/CmsBlock";

import { COMPLAIN_CONFIRM } from './StoreDetailPopup.config';

export class StoreDetailPopup extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        handlePopupConfirm: PropTypes.func.isRequired,
        payload: PropTypes.shape({
            action: PropTypes.oneOf([
                COMPLAIN_CONFIRM
            ]),
        }).isRequired
    };

    renderStoreContact() {
        const { detail } = this.props;
        return (
            <div className="supportSec">
                <div className="iconsSection">
                    <a target="_blank" class="anchorTag" href={`tel:+92${detail[0].store_phone}`}>
                        <img className="iconImg" src="https://zellbury.com/media/logo/Support/icons8-ringer-volume-48.png" alt="Zellbury Helpline Number" />
                        <span>Call Store</span>
                    </a>
                </div>
                <div className="iconsSection">
                    <a class="anchorTag" target="_blank" href={`http://www.google.com/maps/place/${detail[0].latitude},${detail[0].longitude}`}>
                        <img className="iconImg" src="https://dev.zellbury.com/media/logo/Support/direction.png" alt="Zellbury Direction" />
                        <span>Get Direction</span>
                    </a>
                </div>
            </div>
        )
        // return <CmsBlock identifier="store_details" />;
    }

    renderContent() {

        let days = [
            {
                open: 'mon_open',
                close: 'mon_close',
                name: 'Monday'
            },
            {
                open: 'tue_open',
                close: 'tue_close',
                name: 'Tuesday'
            },
            {
                open: 'wed_open',
                close: 'wed_close',
                name: 'Wednesday'
            },
            {
                open: 'thu_open',
                close: 'thu_close',
                name: 'Thursday'
            },
            {
                open: 'fri_open',
                close: 'fri_close',
                name: 'Friday'
            },
            {
                open: 'sat_open',
                close: 'sat_close',
                name: 'Saturday'
            },
            {
                open: 'sun_open',
                close: 'sun_close',
                name: 'Sunday'
            },
            {
                open: 'mon_open',
                close: 'mon_close',
                name: 'Monday'
            },
            {
                open: 'tue_open',
                close: 'tue_close',
                name: 'Tuesday'
            },
            {
                open: 'wed_open',
                close: 'wed_close',
                name: 'Wednesday'
            },
            {
                open: 'thu_open',
                close: 'thu_close',
                name: 'Thursday'
            },
            {
                open: 'fri_open',
                close: 'fri_close',
                name: 'Friday'
            },
            {
                open: 'sat_open',
                close: 'sat_close',
                name: 'Saturday'
            },
            {
                open: 'sun_open',
                close: 'sun_close',
                name: 'Sunday'
            }
        ]
        let afterValue = (days.findIndex(item => item.name === dayTomorrow))

        const { handlePopupConfirm, detail, dayToday, dayTomorrow } = this.props;
        let count = 0
        if (detail && detail.length) {
            return (
                <>
                    <h3>{detail[0].store_name}</h3>
                    {/* <p>Open until 10 PM </p> */}
                    <p>{detail[0].open_msg} </p>
                    <p>{detail[0].store_address} </p>
                    <div className="storeDetailHeadSection">
                        <p className='storeDetailHeadSectionPara'>Store Hours </p>
                    </div>


                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>Today</span>
                            <span>{detail[0][(days.filter(item => item.name === dayToday))[0].open]} - {detail[0][(days.filter(item => item.name === dayToday))[0].close]}</span>
                        </div>
                    </div>
                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>Tomorrow</span>
                            <span>{detail[0][(days.filter(item => item.name === dayTomorrow))[0].open]} - {detail[0][(days.filter(item => item.name === dayTomorrow))[0].close]}</span>
                        </div>
                    </div>

                    {days.map((item, index) => {
                        if (index > days.findIndex(item => item.name === dayTomorrow)) {
                            if (count >= 5) {
                                return
                            } else {
                                count++
                                return (
                                    <div className="hoursSection">
                                        <div className="hoursListing">
                                            <span>{item.name}</span>
                                            {item.open === 'sun_open' ? <span>{detail[0][item.open]}</span> : <span>{detail[0][item.open]} - {detail[0][item.close]}</span>}
                                        </div>
                                    </div>
                                )
                            }
                        }
                    })}

                    {/* <div className="hoursSection">
                        <div className="hoursListing">
                            <span>{dayToday == 'Monday' ? 'Today' : dayTomorrow == 'Monday' ? 'Tomorrow' : 'Monday'}</span>
                            <span>{detail[0].mon_open} - {detail[0].mon_close}</span>
                        </div>
                    </div>
                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>{dayToday == 'Tuesday' ? 'Today' : dayTomorrow == 'Tuesday' ? 'Tomorrow' : 'Tuesday'}</span>
                            <span>{detail[0].tue_open} - {detail[0].tue_close}</span>
                        </div>
                    </div>
                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>{dayToday == 'Wednesday' ? 'Today' : dayTomorrow == 'Wednesday' ? 'Tomorrow' : 'Wednesday'}</span>
                            <span>{detail[0].wed_open} - {detail[0].wed_close}</span>
                        </div>
                    </div>
                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>{dayToday == 'Thursday' ? 'Today' : dayTomorrow == 'Thursday' ? 'Tomorrow' : 'Thursday'}</span>
                            <span>{detail[0].thu_open} - {detail[0].thu_close}</span>
                        </div>
                    </div>
                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>{dayToday == 'Friday' ? 'Today' : dayTomorrow == 'Friday' ? 'Tomorrow' : 'Friday'}</span>
                            <span>{detail[0].fri_open} - {detail[0].fri_close}</span>
                        </div>
                    </div>
                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>{dayToday == 'Saturday' ? 'Today' : dayTomorrow == 'Saturday' ? 'Tomorrow' : 'Saturday'}</span>
                            <span>{detail[0].sat_open} - {detail[0].sat_close}</span>
                        </div>
                    </div>
                    <div className="hoursSection">
                        <div className="hoursListing">
                            <span>{dayToday == 'Sunday' ? 'Today' : dayTomorrow == 'Sunday' ? 'Tomorrow' : 'Sunday'}</span>
                            <span>{detail[0].sun_close}</span>
                        </div>
                    </div> */}
                    {this.renderStoreContact()}

                </>
            )
        }

    }

    render() {
        const { isLoading } = this.props;

        return (
            <Popup
                clickOutside={false}
                mix={{ block: 'StoreDetailPopup' }}
            >
                {/* <Loader isLoading={ isLoading } /> */}
                {this.renderContent()}
            </Popup>
        );
    }
}

export default StoreDetailPopup;
