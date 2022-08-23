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

import './PickupAndCredit.style';
import ContentWrapper from 'Component/ContentWrapper';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Loader from 'Component/Loader';
import { customerType } from 'Type/Account';
import history from 'Util/History';
import axios from 'axios';
let countForTicket = 0;
export class PickupAndCredit extends PureComponent {
    static propTypes = {
        showConfirmPopup: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        customer: customerType.isRequired
    };

    handleVoucherRoute = () => {
        history.push('/ordercomplain/delivered-orders/convenience-voucher');
    }

    //  renderConfirmPopup = () => {
    //     return <ExchangeFromStorePopup handlePopupConfirm={this.handlePopupConfirm} />
    //  }
  
    handleSubmit = () => {
        if (countForTicket === 0) {
            countForTicket++
            const { location, showNotification, complainData } = this.props;
            let orderDetail = complainData.myData.myData.locationData;
            let customer = JSON.parse(localStorage.getItem('customer'));
            let description = "";
            let subject = "";
            if (orderDetail.orderData.orderOption && orderDetail.orderData.orderOption == "wrongProduct") {
                subject = 'I recieved Wrong Product';
                description = 'I recieved Wrong Product';
            }
            if (orderDetail.orderData.orderOption && orderDetail.orderData.orderOption == "incompleteOrder") {
                subject = 'I have received Incomplete';
                description = "I have received Incomplete"
            }
            if (orderDetail.orderData.orderOption && orderDetail.orderData.orderOption == "orderOvercharged") {
                subject = 'I have been overcharged';
                description = "I have been overcharged"
            }

            const promise1 = new Promise((resolve, reject) => {
                var data = JSON.stringify({
                    "cc_emails": [
                        "waqas.pervez@zellbury.com"
                    ],
                    "email_config_id": null,
                    "group_id": null,
                    "priority": 1,
                    "email": customer.data.email,
                    "responder_id": null,
                    "source": 2,
                    "status": 2,
                    "subject": subject,
                    "type": "Product Related",
                    "product_id": null,
                    "description": `${description}`,
                    "tags": []
                });

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
                        showNotification('success', __('Ticket Submitted Successfully'));
                        history.push('/ordercomplain/orderslist');
                        resolve('ok')
                    })
                    .catch(function (error) {
                        console.log(error);
                        reject('error')
                    });
            })


            const promise2 = new Promise((resolve, reject) => {
                let customer = JSON.parse(localStorage.getItem('customer'));
                let phoneNum = customer.data.email.split('@')[0];

                var myHeaders = new Headers();

                myHeaders.append("Cookie", "PHPSESSID=be96asun6001nkudanb2dl1rto; mage-messages=%5B%7B%22type%22%3A%22error%22%2C%22text%22%3A%22Invalid+Form+Key.+Please+refresh+the+page.%22%7D%5D; private_content_version=f987fe585bbce372dfbc085506aef231");

                var formdata = new FormData();
                formdata.append("email", `${customer.data.email}`);
                formdata.append("subject", subject);
                formdata.append("group_id", 82000622276);
                formdata.append("type", "Product Related");
                formdata.append("priority", 1);
                formdata.append("status", 2);
                formdata.append("description", `${description}`);
                formdata.append("phone_no", `${phoneNum}`);
                // formdata.append("attachments", imgFile);
                // formdata.append("cf_barcode", complainData.barcode);
                // formdata.append("cf_resolution", resolution);
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
                        showNotification('success', __("Ticket Submitted Successfully..........second api"));
                        resolve('ok')
                    })
                    .catch(error => {
                        console.log('error', error)
                        showNotification('error', __("Invalid Data through promise all"));
                        reject('error')
                    });
            })

            Promise.all([promise1, promise2]).then(values => {
                console.log('promise all response...........', values);
                showNotification('success', __("Ticket Submitted Successfully through promise all this message is for testing"));
                history.push('/ordercomplain/delivered-orders/store-list');
                countForTicket--
            }).catch(errors => {
                showNotification('error', __("Invalid Data through promise all"));
                countForTicket--
            })
        }
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

    submitTicketWithImage = () => {
        if (countForTicket === 0) {
            countForTicket++

            const { complainData, showNotification } = this.props;
            console.log("complainData12......with image", complainData.myData.barcodeData.data.validateBarcode.order[0].order_id);
            let description;
            let productOption = complainData.myData.productOption;
            let customer = JSON.parse(localStorage.getItem('customer'));
            var blob = this.dataURItoBlob(complainData.myData.dataImg);
            var imageForRMA = complainData.myData.dataImg
            let imgFile = new File([blob], "image.jpg")
            var myHeaders = new Headers();
            let resolution;
            let phoneNum = customer.data.email.split('@')[0];
            console.log(customer);

            description = `Customer wants to generate reverse pickup for ${complainData.myData.locationData.getOrderById.order_products[0].sku} ${complainData.myData.barcode} \n\n\n Reverse pickup is created Estimated time for crediting refund is 10-12 days.\n\n\n Customer already informed about TATs at the time of submitting the complaint, pls handle customer accordingly.`
            resolution = "Pick-up & Credit Refund";

            let subject;
            if (productOption.subOption) {
                subject = `${productOption.mainOption} - ${productOption.subOption} - ${complainData.myData.locationData.getOrderById.base_order_info.increment_id}`;
            } else {
                subject = `${productOption.mainOption} - ${complainData.myData.locationData.getOrderById.base_order_info.increment_id}`;
            }

            console.log('check data ', complainData);


            const promise1 = new Promise((resolve, reject) => {
                let tagsArr = ["101", `${complainData?.myData?.barcodeData?.data?.validateBarcode?.order[0]?.source_name}`, `${complainData?.myData?.barcodeData?.data?.validateBarcode?.order[0]?.city}`]
                myHeaders.append("Authorization", "Basic aGY2MWJqQkdOU1lsNndRZzA5Uzp4");
                myHeaders.append("Cookie", "_x_w=2");
                var formdata = new FormData();
                formdata.append("attachments[]", imgFile);
                formdata.append("cc_emails[]", ['waqas.pervez@zellbury.com']);
                formdata.append("email", `${customer.data.email}`);
                formdata.append("subject", `${subject}`);
                formdata.append("description", `${description}`);
                formdata.append("status", 2);
                formdata.append("priority", 1);
                for (var i = 0; i < tagsArr.length; i++) {
                    formdata.append("tags[]", tagsArr[i]);
                }
                formdata.append("group_id", 82000622276);

                formdata.append("unique_external_id", `"${customer.data.email}"`);
                formdata.append("source", 101);
                formdata.append("custom_fields[cf_resolution]", resolution);
                formdata.append("custom_fields[cf_barcode]", complainData.myData.barcode);
                formdata.append("name", `${customer.data.firstname}`);
                formdata.append("phone", `${phoneNum}`);
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
                            // history.push('/ordercomplain/orderslist');

                            reject('error')
                        } else {
                            // showNotification('success', __("Ticket Submitted Successfully"));
                            resolve('ok')
                            // history.push('/ordercomplain/orderslist');
                        }

                    })
                    .catch(error => {
                        console.log('error', error)
                        showNotification('error', __("Image Upload Error"));
                        reject('error')
                        // history.push('/ordercomplain/orderslist');
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
                formdata.append("status", 2);
                formdata.append("description", `${description}`);
                formdata.append("phone_no", `${phoneNum}`);
                formdata.append("attachments", (imageForRMA.split(','))[1]);
                formdata.append("cf_barcode", complainData?.myData?.barcode);
                formdata.append("cf_resolution", resolution);
                formdata.append("order_id", complainData?.myData?.barcodeData?.data?.validateBarcode?.order[0]?.order_id);
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
                console.log('promise 3....1');
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Cookie", "PHPSESSID=5382a5r1ihsjjtgit3ob6kgdq5; private_content_version=f85cf59eeec8dd114413330c8c8b1562");

                var graphql = JSON.stringify({
                    query: `{\r\n  returnShipment(orderId:\"${complainData.myData.barcodeData.data.validateBarcode.order[0].order_id}\") {\r\n    response{\r\n        msg\r\n        status\r\n    }\r\n  }\r\n}\r\n `,
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

            })

            Promise.all([promise1, promise2, promise3]).then(values => {
                showNotification('success', __("Ticket Submitted Successfully"));
                history.push('/ordercomplain/orderslist');
                countForTicket--
            }).catch(errors => {
                history.push('/ordercomplain/orderslist');
                showNotification('error', __("Invalid Data"));
                countForTicket--
            })
        }
    }

    submitTicketWithoutImage = () => {
        if (countForTicket === 0) {
            countForTicket++
            const { complainData, showNotification } = this.props;
            console.log("complainData12..........without image", complainData);
            let orderSubOpt = complainData.myData.locationData.orderData.subOption;
            let orderMainOpt = complainData.myData.locationData.orderData.orderOption;
            let customer = JSON.parse(localStorage.getItem('customer'));
            let phoneNum = customer.data.email.split('@')[0];
            let resolution;
            let description;
            let dataObj = {};

            description = `Customer wants to generate reverse pickup for ${complainData.myData.locationData.getOrderById.order_products[0].sku} ${complainData.myData.barcode} \n\n\n Reverse pickup is created Estimated time for crediting refund is 10-12 days.`
            resolution = "Pick-up & Credit Refund";

            const promise1 = new Promise((resolve, reject) => {
                if (orderMainOpt) {
                    if (orderMainOpt === "wrongProduct") {
                        let custom_fields_data = {
                            cf_resolution: resolution,
                            cf_barcode: complainData.myData.barcode,
                        }
                        dataObj = {};
                        dataObj['email'] = `${customer.data.email}`;
                        dataObj['subject'] = `I recieved wrong product - ${complainData.myData.locationData.orderData.orderData.increment_id} `;
                        dataObj["custom_fields"] = custom_fields_data;
                        dataObj['group_id'] = 82000622276;
                        dataObj['type'] = 'Product Related';
                        dataObj['priority'] = 1;
                        dataObj['status'] = 2;
                        dataObj["unique_external_id"] = `${customer.data.email}`;
                        dataObj["source"] = 101;
                        dataObj["name"] = `${customer.data.firstname}`;
                        dataObj["email"] = `${customer.data.email}`;
                        dataObj["phone"] = `${phoneNum}`;
                        dataObj["tags"] = ["101", `${complainData?.myData?.barcodeData?.data?.validateBarcode?.order[0]?.source_name}`, `${complainData?.myData?.barcodeData?.data?.validateBarcode?.order[0]?.city}`];
                        // dataObj['description'] = `${complainData.locationData.orderData.orderData.increment_id}`;
                        dataObj['description'] = `${description}`;
                    }
                }
                let data = JSON.stringify(dataObj)
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
                        // showNotification('success', __("Ticket Submitted Successfully"));
                        // // history.push('/ordercomplain/orderslist');
                        // setHeaderState({ name: 'stores-list' });
                        // const data = {
                        //     myData: complainData,
                        // }
                        // updateComplain(data);
                        // history.push('/ordercomplain/delivered-orders/store-list');
                        resolve('ok')
                        // history.push('/ordercomplain/orderslist');
                    })
                    .catch(function (error) {
                        console.log('error', error)
                        showNotification('error', __("Image Upload Error"));
                        // history.push('/ordercomplain/delivered-orders/store-list');
                        reject('error')

                    });

            })


            const promise2 = new Promise((resolve, reject) => {
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "PHPSESSID=be96asun6001nkudanb2dl1rto; mage-messages=%5B%7B%22type%22%3A%22error%22%2C%22text%22%3A%22Invalid+Form+Key.+Please+refresh+the+page.%22%7D%5D; private_content_version=f987fe585bbce372dfbc085506aef231");

                var formdata = new FormData();
                formdata.append("email", `${customer.data.email}`);
                formdata.append("subject", `I recieved wrong product - ${complainData.myData.locationData.orderData.orderData.increment_id} `);
                formdata.append("group_id", 82000622276);
                formdata.append("type", "Product Related");
                formdata.append("priority", 1);
                formdata.append("status",2);
                formdata.append("description", `${description}`);
                formdata.append("phone_no", `${phoneNum}`);
                // formdata.append("attachments", (imageForRMA.split(','))[1]);
                formdata.append("cf_barcode", complainData.myData.barcode);
                formdata.append("cf_resolution", resolution);
                formdata.append("order_id", complainData?.myData?.barcodeData?.data?.validateBarcode?.order[0]?.order_id);
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

                    })
                    .catch(error => {
                        console.log('error', error)

                        reject('error')
                    });
            })

            const promise3 = new Promise((resolve, reject) => {
                console.log('promise 3');
                var myHeaders = new Headers();
                console.log('promise 3 1');
                myHeaders.append("Content-Type", "application/json");
                console.log('promise 3 2');
                // myHeaders.append("Cookie", "PHPSESSID=5382a5r1ihsjjtgit3ob6kgdq5; private_content_version=f85cf59eeec8dd114413330c8c8b1562");
                console.log('promise 3 3');

                var graphql = JSON.stringify({
                    query: `{\r\n  returnShipment(orderId:\"${complainData.myData.barcodeData.data.validateBarcode.order[0].order_id}\") {\r\n    response{\r\n        msg\r\n        status\r\n    }\r\n  }\r\n}\r\n `,
                    variables: {}
                })
                console.log('promise 3 4', graphql);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: graphql,
                    redirect: 'follow'
                };
                console.log('promise 3 4', requestOptions);

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

            })

            Promise.all([promise1, promise2, promise3]).then(values => {
                showNotification('success', __("Ticket Submitted Successfully"));
                history.push('/ordercomplain/orderslist');
                countForTicket--
            }).catch(errors => {
                showNotification('error', __("Invalid Data"));
                history.push('/ordercomplain/orderslist');
                countForTicket--
            })
        }
    }

    componentDidMount() {
        console.log('this.props.....', this.props);
        const { setHeaderState } = this.props
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
    }

    renderContent = () => {
        const { isLoading, showConfirmPopup, complainData } = this.props;
        console.log('complainData.myData', complainData);
        return (
            <ContentWrapper>
                <div className="confirmation-wrapper-pickup">
                    <div>
                        <p className="pleaseconfirm"> Please confirm so we can align pickup of the item from your
                            location
                        </p>
                    </div>
                    <div className="pickUpBtnSec">
                        {complainData?.myData?.dataImg ? (
                            <button onClick={() => this.submitTicketWithImage()} >CONFIRM</button>
                        ) : (
                            <button onClick={() => this.submitTicketWithoutImage()} >CONFIRM</button>
                        )}
                    </div>
                    <div className="mistake-help">
                        <p className="noteHead">NOTE</p>
                        <p className="howwehelp">It can take approx 10 to 12 days to complete the return & credit the process 4-5 working days for pickup 5-7 days to deliver to us.</p>
                    </div>
                    {/* <div className="orSec"><p>OR</p></div>
                    <div className="btn-mistake" >
                        <button onClick={this.handleVoucherRoute} className="button">Get convenience vouchers</button>
                    </div> */}
                </div>
            </ContentWrapper>
        );
    }

    render() {

        return (
            <div>
                {this.renderContent()}
                {/* { this.renderConfirmPopup() } */}
            </div>
        )

    }
}

export default PickupAndCredit;