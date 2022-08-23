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

import './ExchangeOptions.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
import Loader from 'Component/Loader';
import { customerType } from 'Type/Account';
import history from 'Util/History';
import axios from 'axios';

let countForTicket = 0
export class ExchangeOptions extends PureComponent {
    static propTypes = {
        showConfirmPopup: PropTypes.func.isRequired,
        customer: customerType.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };

    componentDidMount() {
        console.log("this.props", this.props);
        const { setHeaderState } = this.props
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
    }

    getOrdersList = async () => {
        // const { storesList } = this.state;
        const res = await _storesList();
        const parse = JSON.parse(res);
        this.setState({ storesList: parse.data.storeLocationList })
    }

    dataURItoBlob = (dataURI) => {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    submitTicketWithImage = (ticketType) => {
        if (countForTicket === 0) {
            countForTicket++
            const { complainData, showNotification } = this.props;
            console.log("complainData12", complainData);
            let description;
            let productOption = complainData.productOption;
            let customer = JSON.parse(localStorage.getItem('customer'));
            var blob = this.dataURItoBlob(complainData.dataImg);
            var imageForRMA = complainData.dataImg
            let imgFile = new File([blob], "image.jpg")
            var myHeaders = new Headers();
            let resolution;
            let phoneNum = customer.data.email.split('@')[0];
            if (ticketType == "Exchange from store") {
                description = `Customer has decided to exchange the ${complainData.locationData.getOrderById.order_products[0].sku} ${complainData.barcode} from ${customer.data.city} \n\n\n Details have been shared with Store management for exchange.`
                resolution = "Exchange from Store";
            } else {
                description = `Customer wants to generate reverse pickup for ${complainData.locationData.getOrderById.order_products[0].sku} ${complainData.barcode} \n\n\n Reverse pickup is created Estimated time for crediting refund is 10-12 days.\n\n\n Customer already informed about TATs at the time of submitting the complaint, pls handle customer accordingly.`
                resolution = "Pick-up & Credit Refund";

            }

            let subject;
            if (productOption.subOption) {
                subject = `I recieved wrong product - ${productOption?.mainOption} - ${productOption.subOption} - ${complainData.locationData.getOrderById.base_order_info.increment_id}`;
            } else {
                subject = `I recieved wrong product - ${productOption?.mainOption} - ${complainData.locationData.getOrderById.base_order_info.increment_id}`;
            }

            console.log("order id .........................", complainData.barcodeData.data.validateBarcode.order[0].order_id);
            console.log("complainData .........................", complainData);
            console.log("imgFile .........................", imgFile);

            const promise1 = new Promise((resolve, reject) => {
                let tagsArr = [`${complainData?.barcodeData?.data?.validateBarcode?.order[0]?.source_name}`, `${complainData?.barcodeData?.data?.validateBarcode?.order[0]?.city}`]
                let arr = JSON.stringify(`${tagsArr}`)
                console.log("json array of tags.....", arr, tagsArr);
                // myHeaders.append("Authorization", "Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eGE=");
                myHeaders.append("Authorization", "Basic aGY2MWJqQkdOU1lsNndRZzA5Uzp4");
                myHeaders.append("Cookie", "_x_w=2");
                var formdata = new FormData();
                formdata.append("attachments[]", imgFile);
                formdata.append("cc_emails[]", ['waqas.pervez@zellbury.com']);
                formdata.append("email", `${customer.data.email}`);
                formdata.append("subject", `${subject}`);
                formdata.append("description", `${description}`);
                formdata.append("status", ticketType === 'Exchange from store' ? 5 : 2);
                formdata.append("priority", 1);
                for (var i = 0; i < tagsArr.length; i++) {
                    formdata.append("tags[]", tagsArr[i]);
                }
                formdata.append("group_id", 82000622276),
                    formdata.append("unique_external_id", `"${customer.data.email}"`),
                    formdata.append("source", 101),
                    formdata.append("custom_fields[cf_resolution]", resolution)
                formdata.append("custom_fields[cf_barcode]", complainData.barcode),
                    formdata.append("name", `${customer.data.firstname}`),
                    formdata.append("phone", `${phoneNum}`),
                    formdata.append("type", "Product Related");

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };

                fetch("https://newaccount1631100479992.freshdesk.com/api/v2/tickets", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log("result", result);
                        if (result.errors && result.errors.length) {
                            // showNotification('error', __("Invalid Data"));
                            reject('error')
                        } else {
                            // showNotification('success', __("Ticket Submitted Successfully.........."));
                            resolve('success')
                        }

                    })
                    .catch(error => {
                        console.log('error', error)
                        showNotification('error', __("Image Upload Error"));
                        reject('error')
                    });
            })
            const promise2 = new Promise((resolve, reject) => {
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "PHPSESSID=be96asun6001nkudanb2dl1rto; mage-messages=%5B%7B%22type%22%3A%22error%22%2C%22text%22%3A%22Invalid+Form+Key.+Please+refresh+the+page.%22%7D%5D; private_content_version=f987fe585bbce372dfbc085506aef231");

                var formdata = new FormData();
                formdata.append("email", `${customer.data.email}`);
                formdata.append("subject", `${subject}`);
                formdata.append("group_id", 82000622276);
                formdata.append("type", "Product Related");
                formdata.append("priority", 1);
                formdata.append("status", ticketType === 'Exchange from store' ? 5 : 2);
                formdata.append("description", `${description}`);
                formdata.append("phone_no", `${phoneNum}`);
                formdata.append("attachments", (imageForRMA.split(','))[1]);
                formdata.append("cf_barcode", complainData.barcode);
                formdata.append("cf_resolution", resolution);
                formdata.append("order_id", complainData?.barcodeData?.data?.validateBarcode?.order[0]?.order_id);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };


                fetch("https://zellbury.com/posttickets/index", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        console.log(result)
                        resolve('ok')
                        // showNotification('success', __("Ticket Submitted Successfully..........second api"));
                    })
                    .catch(error => {
                        console.log('error', error)
                        // showNotification('error', __("Invalid Data through promise all"));
                        reject('error')
                    });
            })

            const promise3 = new Promise((resolve, reject) => {
                console.log("resolution....", resolution);
                if (resolution === 'Pick-up & Credit Refund') {
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Cookie", "PHPSESSID=5382a5r1ihsjjtgit3ob6kgdq5; private_content_version=f85cf59eeec8dd114413330c8c8b1562");
                    console.log("if condition true", complainData.barcodeData.data.validateBarcode.order[0].order_id);
                    var graphql = JSON.stringify({
                        query: `{\r\n  returnShipment(orderId:\"${complainData.barcodeData.data.validateBarcode.order[0].order_id}\") {\r\n    response{\r\n        msg\r\n        status\r\n    }\r\n  }\r\n}\r\n `,
                        variables: {}
                    })
                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: graphql,
                        redirect: 'follow'
                    };

                    fetch("https://dev.zellbury.com/graphql", requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(result)
                            showNotification('success', __('Your shipment created successfuly. ' + result?.data?.returnShipment?.response[0]?.msg));
                            resolve('ok')
                        })
                        .catch(error => {
                            console.log('error', error)
                            reject('error')
                        });
                } else {
                    resolve('ok')
                }

            })

            Promise.all([promise1, promise2, promise3]).then(values => {
                showNotification('success', __("Ticket Submitted Successfully"));
                countForTicket--
            }).catch(errors => {
                showNotification('error', __("Invalid Data"));
                countForTicket--
            })
        }

    }

    submitTicketWithoutImage = (ticketType) => {
        if (countForTicket === 0) {
            countForTicket++
            const { complainData, showNotification, setHeaderState, updateComplain } = this.props;
            console.log("complainData12", complainData);
            let orderSubOpt = complainData.locationData.orderData.subOption;
            let orderMainOpt = complainData.locationData.orderData.orderOption;
            let customer = JSON.parse(localStorage.getItem('customer'));
            let phoneNum = customer.data.email.split('@')[0];
            let resolution;
            let description;
            let dataObj = {};
            if (ticketType == "Exchange from store" || ticketType == 'exchangeFromStore') {
                resolution = "Exchange from Store";
                if (orderMainOpt === "wrongProduct") {
                    description = `Customer complained for Wrong product/size. After checking customer has decided to exchange the ${complainData.locationData.getOrderById.order_products[0].sku} ${complainData.barcode} from ${customer.data.city} \n\n\n Please facilate customer as per policy.`
                }
            } else {
                if (orderMainOpt === "wrongProduct") {
                    description = `Customer wants to generate reverse pickup for ${complainData.locationData.getOrderById.order_products[0].sku} ${complainData.barcode} \n\n\n Reverse pickup is created Estimated time for crediting refund is 10-12 days.`
                }
                resolution = "Pick-up & Credit Refund";
            }
            console.log("order id .........................", complainData);
            console.log("complainData .........................", complainData.barcodeData.data.validateBarcode.order[0].order_id);
            // console.log("imgFile .........................", imgFile );

            if (orderMainOpt) {
                if (orderMainOpt === "wrongProduct") {
                    let custom_fields_data = {
                        cf_resolution: resolution,
                        cf_barcode: complainData.barcode,
                    }
                    dataObj = {};
                    dataObj['email'] = `${customer.data.email}`;
                    {
                        complainData?.productOption?.mainOption
                            ? dataObj["subject"] = `I recieved wrong product - ${complainData?.productOption?.mainOption} - ${complainData.locationData.orderData.orderData.increment_id} `
                            : dataObj["subject"] = `I recieved wrong product - ${complainData.locationData.orderData.orderData.increment_id} `
                    }
                    dataObj["custom_fields"] = custom_fields_data;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = 'Product Related';
                    dataObj['priority'] = 1;
                    dataObj['status'] = ticketType == "Exchange from store" || ticketType == 'exchangeFromStore' ? 5 : 2;
                    dataObj["unique_external_id"] = `${customer.data.email}`;
                    dataObj["source"] = 101;
                    dataObj["tags"] = [`${complainData?.barcodeData?.data?.validateBarcode?.order[0]?.source_name}`, `${complainData?.barcodeData?.data?.validateBarcode?.order[0]?.city}`];
                    // formdata.append("tags[]", `["101", "${complainData?.barcodeData?.data?.validateBarcode?.order[0]?.source_name}", "${complainData?.barcodeData?.data?.validateBarcode?.order[0]?.city}"]`);

                    dataObj["name"] = `${customer.data.firstname} `;
                    dataObj["email"] = `${customer.data.email} `;
                    dataObj["phone"] = `${phoneNum} `;
                    // dataObj['description'] = `${ complainData.locationData.orderData.orderData.increment_id } `;
                    dataObj['description'] = `${description} `;
                }
            }


            let data = JSON.stringify(dataObj)
            const promise1 = new Promise((resolve, reject) => {
                var config = {
                    method: 'post',
                    url: 'https://newaccount1631100479992.freshdesk.com/api/v2/tickets',
                    headers: {
                        'Authorization': 'Basic aGY2MWJqQkdOU1lsNndRZzA5Uzp4',
                        'Content-Type': 'application/json',
                        'Cookie': '_x_w=2'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        // showNotification('success', __('Ticket Submitted Successfully'));
                        // history.push('/ordercomplain/orderslist');
                        const data = {
                            myData: complainData,
                        }
                        updateComplain(data);
                        setHeaderState({ name: 'stores-list', title: 'Stores List', onBackClick: () => history.goBack() });
                        resolve('ok')

                    })
                    .catch(function (error) {
                        console.log("error https://newaccount1631100479992.freshdesk.com/api/v2/tickets ...",error);
                        reject(error)
                    });

            })
            const promise2 = new Promise((resolve, reject) => {
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "PHPSESSID=be96asun6001nkudanb2dl1rto; mage-messages=%5B%7B%22type%22%3A%22error%22%2C%22text%22%3A%22Invalid+Form+Key.+Please+refresh+the+page.%22%7D%5D; private_content_version=f987fe585bbce372dfbc085506aef231");

                var formdata = new FormData();
                formdata.append("email", `${customer.data.email} `);
                {
                    complainData?.productOption?.mainOption
                        ? formdata.append("subject", `I recieved wrong product - ${complainData?.productOption?.mainOption} - ${complainData.locationData.orderData.orderData.increment_id} `)
                        : formdata.append("subject", `I recieved wrong product - ${complainData.locationData.orderData.orderData.increment_id} `)
                }
                formdata.append("group_id", 82000622276);
                formdata.append("type", "Product Related");
                formdata.append("priority", 1);
                formdata.append("status", 5);
                formdata.append("description", `${description} `);
                formdata.append("phone_no", `${phoneNum} `);
                // formdata.append("attachments", imgFile);
                formdata.append("cf_barcode", complainData.barcode);
                formdata.append("cf_resolution", resolution);
                formdata.append("order_id", complainData?.barcodeData?.data?.validateBarcode?.order[0]?.order_id);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };
                
                fetch("https://zellbury.com/posttickets/index", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        console.log(result)
                        resolve('ok')
                        // showNotification('success', __("Ticket Submitted Successfully..........second api"));
                    })
                    .catch(error => {
                        console.log('error https://zellbury.com/posttickets/index', error)
                        // showNotification('error', __("Invalid Data through promise all"));
                        reject(error)
                    });
            })

            const promise3 = new Promise((resolve, reject) => {
                console.log("resolution", resolution);
                if (resolution === 'Pick-up & Credit Refund') {
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Cookie", "PHPSESSID=5382a5r1ihsjjtgit3ob6kgdq5; private_content_version=f85cf59eeec8dd114413330c8c8b1562");

                    console.log("if condition true", complainData.barcodeData.data.validateBarcode.order[0].order_id);
                    var graphql = JSON.stringify({
                        query: `{
                \r\n  returnShipment(orderId: \"${complainData.barcodeData.data.validateBarcode.order[0].order_id}\") {\r\n    response{\r\n        msg\r\n        status\r\n    }\r\n  }\r\n}\r\n `,
                        variables: {}
                    })
                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: graphql,
                        redirect: 'follow'
                    };

                    fetch("https://dev.zellbury.com/graphql", requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(result)
                            showNotification('success', __('Your shipment created successfuly. ' + result?.data?.returnShipment?.response[0]?.msg));
                            resolve('ok')
                        })
                        .catch(error => {
                            console.log('error https://dev.zellbury.com/graphql', error)
                            reject(error)
                        });
                } else {
                    resolve('ok')
                }

            })

            Promise.all([promise1, promise2, promise3]).then(values => {
                console.log('promise all response...........', values);
                showNotification('success', __('Ticket Submitted Successfully'));
                history.push('/ordercomplain/delivered-orders/store-list');
                countForTicket--
            }).catch(errors => {
                console.log('error from submiting ticket......', errors);
                showNotification('error', __("Invalid Data through promise all"));
                countForTicket--
            })
        }
    }

    handlePopupConfirm = () => {
        const { hidePopup, location, complainData, updateComplain, setHeaderState } = this.props;
        hidePopup();
        if (complainData && complainData.dataImg) {
            this.submitTicketWithImage('Exchange from store');
        }
        else {
            this.submitTicketWithoutImage('exchangeFromStore');
        }
        setHeaderState({ name: 'stores-list', title: 'Stores List', onBackClick: () => history.goBack() });
        const data = {
            myData: complainData,
        }
        updateComplain(data);
        history.push('/ordercomplain/delivered-orders/store-list');
    }


    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="Please confirm so we can share your details with our Store Mangement" handlePopupConfirm={this.handlePopupConfirm} />
    }

    handlePickupCredit = async () => {
        const { location, complainData, updateComplain, setHeaderState } = this.props;
        const data = {
            myData: complainData,
        }
        if (complainData && complainData.dataImg) {
            // this.submitTicketWithImage('Pickup');
        }
        // setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
        updateComplain(data);
        history.push('/ordercomplain/delivered-orders/pickup-credit', data);
        // history.push('/ordercomplain/delivered-orders/store-list');
    }

    renderContent = () => {
        const { isLoading, showConfirmPopup, complainData, showExchangeOption, customerName } = this.props;
        console.log("showExchangeOption", showExchangeOption);
        console.log("complainData", complainData?.productOption?.mainOption);
        return (
            <>
                <h3 className="headingTitle">Your order is {complainData?.locationData?.getOrderById?.base_order_info?.status_label}</h3>
                {/* <h3 className="headingTitle">What would you like help with</h3> */}
                <div className="orderOptCenteredSec">
                    <h4 className="exchangeSubHeading">{customerName}, {complainData?.productOption?.mainOption === 'Fabric is very light'
                        || complainData?.productOption?.mainOption === 'Fabric is too thick'
                        ? 'How you would like us to help.'
                        : 'It seems we made a mistake! How you would like us to help.'}</h4>
                    {showExchangeOption &&
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="exhangefromstore"
                                onClick={showConfirmPopup}
                                // block={"Exchange From Store"}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Exchange from store')}
                            </button>
                        </div>
                    }
                    {!showExchangeOption &&
                        <div className="buttonsSec" block="OrderStatusComplain" elem="Buttons">
                            <button
                                className="optionsBtn"
                                type="text"
                                value="pickupandcredit"
                                onClick={this.handlePickupCredit}
                                // block={"Exchange From Store"}
                                elem="Button"
                                mix={{ block: 'Button' }}
                            >
                                {__('Pick-up & Credit')}
                            </button>
                        </div>
                    }
                </div>
            </>
        );
    }

    render() {
        return (
            <div>
                {this.renderContent()}
                {this.renderConfirmPopup()}
            </div>
        )

    }
}

export default ExchangeOptions;