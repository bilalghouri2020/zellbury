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
import {
    STORE_DETAIL_POPUP_ID,
    DETAIL_STORE
} from 'Component/StoreDetailPopup';
import { customerType } from 'Type/Account';
import { showPopup } from 'Store/Popup/Popup.action';
import MyStoresList from './MyStoresList.component';
import { _storesList } from 'Query/Complain.query';
import moment from 'moment';
import history from 'Util/History';

export const OrderDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Order/Order.dispatcher'
);

//  export const mapStateToProps = (state) => ({
//     customer: state.MyAccountReducer.customer
// });

export const mapDispatchToProps = (dispatch) => ({
    showPopup: (payload) => dispatch(showPopup(STORE_DETAIL_POPUP_ID, payload)),
});

export class MyStoresListContainer extends PureComponent {
    //  static propTypes = {
    //      getOrderList: PropTypes.func.isRequired
    //  };
    static propTypes = {
        showPopup: PropTypes.func.isRequired,
        customer: customerType.isRequired,
    };

    state = {
        storesList: null,
        isLoading: true
    }

    containerFunctions = {
        showDetailPopup: this.showDetailPopup.bind(this),
    };

    showDetailPopup() {
        const { showPopup } = this.props;
        showPopup();
    }

    getOrdersList = async () => {
        const { storesList } = this.state;
        const { data } = this.props;
        console.log("this.props;", this.props);
        console.log("complainData", data);
        // console.log("complainData1", this.props);
        // var dta = complainData
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            console.log("coords", coords);
            const customerData = JSON.parse(localStorage.getItem("customer"));
            // console.log("customerData in", customerData);
            const lat = coords.latitude;
            const lng = coords.longitude;
            let currentData = moment().format('DD-MM-YYYY HH:mm:ss');
            const res = await _storesList(customerData.data.city, currentData, lat, lng);
            const parse = JSON.parse(res);
            console.log("res", res);
            console.log("parse", parse);
            if (parse && parse.data.storeLocationList.length) {
                if (data) {
                    let isFactoryOutlet = data.myData.barcodeData.data.validateBarcode.product[0].factory_outlet;
                    let isDiscounted = data.myData.barcodeData.data.validateBarcode.product[0].discounted
                    let filteredData;
                    if (isFactoryOutlet == "Yes") {
                        filteredData = parse.data.storeLocationList.filter(item => item.is_fot == 1);
                    } else {
                        if (isDiscounted) {
                            let arr1 = parse.data.storeLocationList.filter(item => item.is_fot == 1);
                            let arr2 = parse.data.storeLocationList.filter(item => item.store_code == data.myData.barcodeData.data.validateBarcode.order[0].source_id);
                            filteredData = [...arr1, ...arr2]
                        } else {
                            filteredData = parse.data.storeLocationList.filter(item => item.is_fot == 0);
                        }
                    }
                    console.log("tyiooo", filteredData);
                    // this.setState({storeList: filteredData})
                    this.setState({ storesList: filteredData, isLoading: false })
                    // this.setState({ storesList: parse.data.storeLocationList, isLoading: false })
                }
                return
                // this.setState({ storesList: parse.data.storeLocationList, isLoading: false })
            } else {
                history.push('/ordercomplain/delivered-orders/pickup-credit');
                return
            }
            return
        });
        const customerData = JSON.parse(localStorage.getItem("customer"));
        let currentData = moment().format('DD-MM-YYYY HH:mm:ss');
        const res = await _storesList(customerData.data.city, currentData, "", "");
        const parse = JSON.parse(res);
        console.log("res", res);
        console.log("parse", parse);
        // alert('ok')
        if (parse && parse.data.storeLocationList.length) {
            if (data) {
                let isFactoryOutlet = data.myData.barcodeData.data.validateBarcode.product[0].factory_outlet;
                let isDiscounted = data.myData.barcodeData.data.validateBarcode.product[0].discounted
                let filteredData;
                if (isFactoryOutlet == "Yes") {
                    filteredData = parse.data.storeLocationList.filter(item => item.is_fot == 1);
                } else {
                    if (isDiscounted) {
                        let arr1 = parse.data.storeLocationList.filter(item => item.is_fot == 1);
                        let arr2 = parse.data.storeLocationList.filter(item => item.store_code == data.myData.barcodeData.data.validateBarcode.order[0].source_id);
                        filteredData = [...arr1, ...arr2]
                    } else {
                        filteredData = parse.data.storeLocationList.filter(item => item.is_fot == 0);
                    }
                }
                console.log("tyiooo", filteredData);
                // this.setState({storeList: filteredData})
                this.setState({ storesList: filteredData, isLoading: false })
                // this.setState({ storesList: parse.data.storeLocationList, isLoading: false })
            }
            return
            // this.setState({ storesList: parse.data.storeLocationList, isLoading: false })
        } else {
            history.push('/ordercomplain/delivered-orders/pickup-credit');
            return
        }
        // if (parse && parse.data.storeLocationList.length) {
        //     if (data) {
        //         let isFactoryOutlet = data.myData.barcodeData.data.validateBarcode.product[0].factory_outlet;
        //         let isDiscounted = data.myData.barcodeData.data.validateBarcode.product[0].discounted
        //         let filteredData;
        //         if (isFactoryOutlet == "Yes") {
        //             filteredData = parse.data.storeLocationList.filter(item => item.is_fot == 1);
        //         } else {
        //             if (isDiscounted) {
        //                 let arr1 = parse.data.storeLocationList.filter(item => item.is_fot == 1);
        //                 let arr2 = parse.data.storeLocationList.filter(item => item.store_code == data.myData.barcodeData.data.validateBarcode.order[0].source_id);
        //                 filteredData = [...arr1, ...arr2]
        //             } else {
        //                 filteredData = parse.data.storeLocationList.filter(item => item.is_fot == 0);
        //             }
        //         }
        //         console.log("tyiooo", filteredData);
        //         // this.setState({storeList: filteredData})
        //         this.setState({ storesList: filteredData, isLoading: false })
        //         // this.setState({ storesList: parse.data.storeLocationList, isLoading: false })
        //     }
        //     return
        //     // this.setState({ storesList: parse.data.storeLocationList, isLoading: false })
        // } else {
        //     history.push('/ordercomplain/delivered-orders/pickup-credit');
        //     return
        // }
        // this.props.updateLocation(coords)
        //     const lat = coords.latitude
        //     const lng = coords.longitude
        //     console.log('customerData', customerData);
        //     // console.log('latlng', latlng);
        // })
        // console.log('s', navigatorData)
        // const lat = coords.latitude
        //     const lng = coords.longitude
        // const res = await _storesList();
        // const parse = JSON.parse(res);
        // this.setState({ storesList: parse.data.storeLocationList })
    }

    componentDidMount() {
        console.log("showConfirmPopup")
        // let city = data.getOrderById.
        this.getOrdersList();
    }

    render() {
        return (
            <MyStoresList
                {...this.props}
                {... this.state}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(MyStoresListContainer);