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

import './OrderDetails.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import { fetchQuery } from 'Util/Request';
import OrderQuery from 'Query/Order.query';
import { orderType } from 'Type/Account';
import BrowserDatabase from 'Util/BrowserDatabase';
import { _cancelOrder, _orderDetailById } from 'Query/Complain.query';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
import OrderStatusStepper from "Component/OrderStatusStepper"
import { DateFormatter } from 'Util/Order';
import history from 'Util/History';
import axios from 'axios';
import Field from 'Component/Field';
import { mapStateToProps } from 'Component/Link/Link.container';

export class OrderDetails extends PureComponent {

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        showNotification: PropTypes.func.isRequired,
        order: orderType.isRequired,
        complainData: PropTypes.object.isRequired,
        showConfirmPopup: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
    };
    state = {
        address: null,
        fieldValid: true,
        errorMsg: "",
        quantity: 1,
    }

    componentDidMount() {
        // try{
        //     const divHeight = document.getElementsByClassName("centered")[0].clientHeight
        //     const screenHeight = screen.height;
        //     if(divHeight < screenHeight){
        //         this.customeHeight = screenHeight
        //     }
        // }catch(error)   {
        //     console.log(error);
        // }

        const { complainData } = this.props;
        if (!complainData) {
            console.log('hello world again.......');
            history.push("/ordercomplain/orderslist");
            return
        }
    }


    submitFreshDeskTicket = (data) => {
        const { showNotification, complainData } = this.props;
        let orderMainOpt = complainData.orderData.orderOption;

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
                if (orderMainOpt === "deliveredOrderNotReceived") {

                } else {
                    console.log('hello world again 2 ..............');
                    history.push('/ordercomplain/delivered-orders/missingitem', data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    handleFormSubmission = async (status, group) => {
        // console.log('tttt', this.props);
        const { location, complainData, showNotification } = this.props;
        console.log("complainData", complainData);
        const { address, fieldValid, errorMsg, quantity } = this.state;
        let orderSubOpt = complainData.orderData.subOption;
        let orderMainOpt = complainData.orderData.orderOption;
        let customer = JSON.parse(localStorage.getItem('customer'));
        let subject = "";
        let descVal = "";
        let dataObj = {}

        if (orderMainOpt) {
            if (orderMainOpt === "orderNotReceived") {
                dataObj = {};
                dataObj['email'] = `${customer.data.email}`;
                dataObj['subject'] = `Didn’t receive the order, ${complainData.orderData.orderData.increment_id} `;
                dataObj['group_id'] = 82000622276;
                // dataObj['type'] = 'Order not received';
                dataObj['type'] = 'Didn’t receive the order';
                dataObj['priority'] = 3;
                dataObj["tags"] = ["101", `${complainData?.getOrderById?.shipping_info?.shipping_address?.city}`];
                dataObj['status'] = 2;
                dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                let data = JSON.stringify(dataObj)
                this.submitFreshDeskTicket(data);
                return
            }

            if (orderMainOpt === "cancelMyOrder" || orderMainOpt === "changeMyOrder") {
                dataObj = {};
                if (orderSubOpt === "wrongOrderAddress") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Wrong Delivery Address, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = orderMainOpt === "cancelMyOrder" ? 'Order Cancellation' : 'Order Modification';
                    dataObj['priority'] = 3;
                    dataObj['status'] = 2;
                    dataObj["tags"] = ["101", `${complainData?.getOrderById?.shipping_info?.shipping_address?.city}`];
                    dataObj['description'] = `${complainData.orderData.orderData.increment_id} - Updated Address: ${address}`;
                    if (address) {
                        let add = address.split(' ');
                        // if (add && add.length < 4) {
                        //     this.setState({ address: '', fieldValid: false, errorMsg: "Please enter complete address." })
                        //     return;
                        // }
                    }
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
                if (orderSubOpt === "itemFaster") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `I Need the Item Faster, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = group || 82000622276;
                    dataObj['type'] = orderMainOpt === "cancelMyOrder" ? 'Order Cancellation' : 'Order Modification';
                    dataObj['priority'] = 3;
                    dataObj['status'] = status;
                    dataObj["tags"] = ["101", `${complainData?.getOrderById?.shipping_info?.shipping_address?.city}`];
                    dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
                if (orderSubOpt === "mistakenlyPlacedOrder") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Mistakenly Placed Order, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = orderMainOpt === "cancelMyOrder" ? 'Order Cancellation' : 'Order Modification';
                    dataObj['priority'] = 3;
                    dataObj["tags"] = ["101", `${complainData?.getOrderById?.shipping_info?.shipping_address?.city}`];
                    dataObj['status'] = orderMainOpt === "cancelMyOrder" ? 5 : 2;;
                    if (address) {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id} - Updated Address: ${address}`;
                    } else {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    }
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
                if (orderSubOpt === "cheaperOrder") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Cheaper Order, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = orderMainOpt === "cancelMyOrder" ? 'Order Cancellation' : 'Order Modification';
                    dataObj['priority'] = 3;
                    dataObj['status'] = orderMainOpt === "cancelMyOrder" ? 5 : 2;;
                    dataObj["tags"] = ["101", `${complainData?.getOrderById?.shipping_info?.shipping_address?.city}`];
                    if (address) {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id} - Updated Address: ${address}`;
                    } else {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    }
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
                if (orderSubOpt === "fabricQuality") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Fabric Quality, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = orderMainOpt === "cancelMyOrder" ? 'Order Cancellation' : 'Order Modification';
                    // dataObj['tags'] = ;
                    dataObj["tags"] = ["101", `${complainData?.getOrderById?.shipping_info?.shipping_address?.city}`];
                    dataObj['priority'] = 3;
                    dataObj['status'] = orderMainOpt === "cancelMyOrder" ? 5 : 2;;
                    if (address) {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id} - Updated Address: ${address}`;
                    } else {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    }
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
            }

            if (orderMainOpt === "incompleteOrder") {
                dataObj = {};
                // 82000632682
                if (orderSubOpt === "Complete item is missing") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Complete missing item, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = 'Missing Item';
                    dataObj['priority'] = 3;
                    dataObj['status'] = 2;
                    if (address) {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}
                        - Quantity: ${quantity}
                        - Comments: ${address}`;
                    } else {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    }
                    if (address) {
                        console.log(add, 'add before');
                        let add = address.split(' ');
                        console.log(add, 'add end');
                        // if (add && add.length < 4) {
                        //     console.log(add, 'in if condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please Enter at least 4 words." })
                        //     return;
                        // } else if (add[0] === '' || add[1] === '' || add[2] === '' || add[3] === '') {
                        //     console.log(add, 'second condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please not contain only space in this comment box." })
                        //     return;
                        // }
                    } else {
                        this.setState({ fieldValid: false, errorMsg: "Please enter comments ." })
                        return;
                    }
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
                if (orderSubOpt === "Shirt missing") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Shirt missing, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = 'Missing Item';
                    
                    dataObj['priority'] = 3;
                    dataObj['status'] = 2;
                    if (address) {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id} - Comments: ${address}`;
                    } else {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    }
                    if (address) {
                        console.log(add, 'add before');
                        let add = address.split(' ');
                        console.log(add, 'add end');
                        // if (add && add.length < 4) {
                        //     console.log(add, 'in if condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please Enter at least 4 words." })
                        //     return;
                        // } else if (add[0] === '' || add[1] === '' || add[2] === '' || add[3] === '') {
                        //     console.log(add, 'second condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please not contain only space in this comment box." })
                        //     return;
                        // }
                    } else {
                        this.setState({ fieldValid: false, errorMsg: "Please enter comments ." })
                        return;
                    }
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
                if (orderSubOpt === "Dupatta missing") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Dupatta missing, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = 'Missing Item';
                    dataObj['priority'] = 3;
                    dataObj['status'] = 2;
                    if (address) {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id} - Comments: ${address}`;
                    } else {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    }
                    if (address) {
                        console.log(add, 'add before');
                        let add = address.split(' ');
                        console.log(add, 'add end');
                        // if (add && add.length < 4) {
                        //     console.log(add, 'in if condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please Enter at least 4 words." })
                        //     return;
                        // } else if (add[0] === '' || add[1] === '' || add[2] === '' || add[3] === '') {
                        //     console.log(add, 'second condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please not contain only space in this comment box." })
                        //     return;
                        // }
                    } else {
                        this.setState({ fieldValid: false, errorMsg: "Please enter comments ." })
                        return;
                    }
                    let data = JSON.stringify(dataObj)
                    this.submitFreshDeskTicket(data);
                    return
                }
                if (orderSubOpt === "Shalwar missing") {
                    dataObj['email'] = `${customer.data.email}`;
                    dataObj['subject'] = `Shalwar missing, ${complainData.orderData.orderData.increment_id} `;
                    dataObj['group_id'] = 82000622276;
                    dataObj['type'] = 'Missing Item';
                    dataObj['priority'] = 3;
                    dataObj['status'] = 2;
                    if (address) {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id} - Comments: ${address}`;
                    } else {
                        dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                    }
                    if (address) {
                        console.log(add, 'add before');
                        let add = address.split(' ');
                        console.log(add, 'add end');
                        // if (add && add.length < 4) {
                        //     console.log(add, 'in if condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please Enter at least 4 words." })
                        //     return;
                        // } else if (add[0] === '' || add[1] === '' || add[2] === '' || add[3] === '') {
                        //     console.log(add, 'second condition');
                        //     this.setState({ fieldValid: false, errorMsg: "Please not contain only space in this comment box." })
                        //     return;
                        // }
                        let data = JSON.stringify(dataObj)
                        this.submitFreshDeskTicket(data);
                        return
                    } else {
                        this.setState({ fieldValid: false, errorMsg: "Please enter comments ." })
                        return;
                    }
                }
            }

            if (orderMainOpt === "deliveredOrderNotReceived") {
                dataObj = {};
                dataObj['email'] = `${customer.data.email}`;
                dataObj['subject'] = `Didn’t receive the order, ${complainData.orderData.orderData.increment_id} `;
                dataObj['group_id'] = 82000622276;
                dataObj['type'] = `Didn’t receive the order`;
                dataObj['priority'] = 3;
                dataObj['status'] = 2;
                dataObj['description'] = `${complainData.orderData.orderData.increment_id}`;
                let data = JSON.stringify(dataObj)
                this.submitFreshDeskTicket(data);
                return
            }
        }

        // if(orderSubOpt){
        //     if(orderSubOpt === "wrongOrderAddress"){
        //         descVal = "I entered the wrong delivery address";
        //         if(address){
        //             let add = address.split(' ');
        //             if(add && add.length < 4 ){
        //                 this.setState({address: '', fieldValid: false, errorMsg: "Please enter complete address."})
        //                 return;
        //             }
        //         }
        //     }
        //     if(orderSubOpt === "itemFaster"){
        //         descVal = "I need the item faster";
        //     }
        //     if(orderSubOpt === "mistakenlyPlacedOrder"){
        //         descVal = "I mistakenly placed an order";
        //     }
        //     if(orderSubOpt === "cheaperOrder"){
        //         descVal = "I found the same design much cheaper in market";
        //     }
        //     if(orderSubOpt === "fabricQuality"){
        //         descVal = "I am not sure about the quality of fabric";
        //     }
        //     if(orderSubOpt === "Complete item is missing"){
        //         descVal = "Complete item is missing";
        //     }
        // }

        // else{
        //     let orderMainOpt = complainData.orderData.orderOption;
        //     if(orderMainOpt){
        //         if(orderMainOpt === "orderNotReceived"){
        //             subject = "Order Not Received";
        //         }
        //     }
        // }

        // let addressVar = "";
        // if(address){
        //     addressVar = `${descVal} \n Please update my address: ${address}`;
        // }else{
        //     if(orderSubOpt){
        //         addressVar = `${descVal}`
        //     }else{
        //         addressVar = `${subject}`
        //     }

        // }

        // let data = JSON.stringify(dataObj)
        // this.submitFreshDeskTicket(data);
        // if(orderMainOpt != "incompleteOrder"){
        //     var data = JSON.stringify({
        //         "cc_emails": [
        //           "waqas.pervez@zellbury.com"
        //         ],
        //         "email_config_id": null,
        //         "group_id": null,
        //         "priority": 1,
        //         "email": customer.data.email,
        //         "responder_id": null,
        //         "source": 2,
        //         "status": 2,
        //         "subject": subject,
        //         "type": "Product Related",
        //         "product_id": null,
        //         "description": `${addressVar}`,
        //         "tags": []
        //       });
        //       this.submitFreshDeskTicket(data);
        // }


        //   var config = {
        //     method: 'post',
        //     url: 'https://newaccount1631100479992.freshdesk.com/api/v2/tickets',
        //     headers: { 
        //       'Authorization': 'Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eA==', 
        //       'Content-Type': 'application/json', 
        //       'Cookie': '_x_w=2'
        //     },
        //     data : data
        //   };

        //   axios(config)
        //   .then(function (response) {
        //     showNotification('success', __('Ticket Submitted Successfully'));
        //     history.push('/ordercomplain/orderslist');
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });

        // let data = new FormData();
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", "Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eA==");

        // 
        // 
        // 

        // myHeaders.append("Cookie", "_x_w=2");
        // let fileInput = [];
        // var data = new FormData();
        // // data.append('attachments[]', '');
        // data.append('email', customer.data.email);
        // data.append('subject', "Wrong Order Address");
        // data.append('description', 'Test Submit');
        // data.append('status', '2');
        // data.append('priority', '1');
        // data.append('type', 'Order Related');

        // var requestOptions = {
        // method: 'POST',
        // headers: {
        //     'accept': 'application/json',
        //     "Authorization": "Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eA==",
        //     'Content-Type': 'multipart/form-data',
        //   },
        // body: data,
        // redirect: 'follow'
        // };

        // fetch("https://newaccount1631100479992.freshdesk.com/api/v2/tickets", requestOptions)
        // .then(response => response.text())
        // .then(result => console.log("dsda",result))
        // .catch(error => console.log('error', error));
        // data.append('attachments[]', '');
        // data.append('email', customer.data.email);
        // data.append('subject', subject);
        // data.append('description', 'Test Submit');
        // data.append('status', '2');
        // data.append('priority', '1');
        // data.append('type', 'Order Related');

        // const config = {
        //     method: 'post',
        //     url: 'https://newaccount1631100479992.freshdesk.com/api/v2/tickets',
        //     headers: { 
        //       'Authorization': 'Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eA==', 
        //       'Cookie': '_x_w=2'
        //     },
        //     data : data
        //   };
        //     axios(config)
        //     .then(function (response) {
        //         console.log("hello", JSON.stringify(response.data));
        //     })
        //     .catch(function (error) {
        //         console.log("error", error);
        //     });
        // console.log('storeLocationList', customer);
        // const { location } = this.props;
        // let submissionType = complainData.detailOptData;
        // let orderData = complainData.orderData;
        // if(submissionType && submissionType.orderSubmissionType === "cancel"){
        //     const res = await _cancelOrder(orderData.orderId);
        //     const parse = JSON.parse(res);
        //     // const orderDetailRes = await _orderDetailById(orderData.orderId);
        //     // const detailParse = JSON.parse(orderDetailRes);
        //     // console.log("detailParse", detailParse);
        //     // let itemOrders = parse.data.customerPlacedOrder.items;
        // }
    }

    // renderOrderSummaryTable(data) {
    //     const { order: { base_order_info: { redeempoints, cashback, apistatus } }, cashbackpercent } = this.props;
    //     return (
    //         <div block="CheckoutOrderSummary" elem="OrderTotals">
    //             <h3
    //                 block="CheckoutOrderSummary"
    //                 elem="Header"
    //                 mix={{ block: 'CheckoutPage', elem: 'Heading', mods: { hasDivider: true } }}
    //             >
    //                 <span>{__('Order Summary')}</span>
    //             </h3>
    //             <hr />
    //             <ul>
    //                 <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem">
    //                     <span block="CheckoutOrderSummary" elem="Text">
    //                         Subtotal
    //                     </span>
    //                     <span block="CheckoutOrderSummary" elem="Text">
    //                         {numberWithCommas(data.sub_total)}
    //                     </span>
    //                 </li>
    //                 {apistatus && <li block="CheckoutOrderSummary" elem="SummaryItem" >
    //                     <span block="CheckoutOrderSummary" elem="Text">
    //                         Loyalty Redeemed
    //                     </span>
    //                     <span style={{ color: "#DC6D6D", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
    //                         - Rs {numberWithCommas(redeempoints.split(".")[0])}
    //                     </span>
    //                 </li>}
    //                 <li style={{ paddingBottom: "15px", borderBottom: "1px solid #f0f0f0" }} block="CheckoutOrderSummary" elem="SummaryItem" >
    //                     <span block="CheckoutOrderSummary" elem="Text">
    //                         Tax
    //                     </span>
    //                     <span block="CheckoutOrderSummary" elem="Text">
    //                         Rs 0
    //                     </span>
    //                 </li>

    //                 <li style={{ marginTop: "8px" }} block="CheckoutOrderSummary" elem="SummaryItem" >
    //                     <span block="CheckoutOrderSummary" elem="Text">
    //                         Grand total
    //                     </span>
    //                     <span block="CheckoutOrderSummary" elem="Text">
    //                         {numberWithCommas(data.grand_total)}
    //                     </span>
    //                 </li>

    //                 <li block="CheckoutOrderSummary" elem="SummaryItem" >
    //                     <span style={{ textAlign: "left" }} block="CheckoutOrderSummary" elem="Text">
    //                         <p>Loyalty Credit {cashbackpercent}%</p>
    //                         <span>*Loyalty points earned accumalate once the order is delivered</span>
    //                     </span>
    //                     <span style={{ color: "#03a685", fontWeight: "bold" }} block="CheckoutOrderSummary" elem="Text">
    //                         Rs {numberWithCommas(cashback)}
    //                     </span>
    //                 </li>
    //             </ul>
    //         </div>
    //     )
    // }

    cancelMyOrder = async () => {
        const { location, complainData, showNotification } = this.props;
        let submissionType = complainData.detailOptData;
        let orderData = complainData.orderData;
        const res = await _cancelOrder(orderData.orderId);
        const parse = JSON.parse(res);
        this.handleFormSubmission();
        // showNotification('success', __('Order Cancelled Successfully'));
        // history.push('/ordercomplain/orderslist');
    }

    RenderLeopardsTraking(TrackingDetail) {
        {/* <Moment date={new Date(status.Activity_datetime)} format="dddd, D MMM" />&nbsp;
            <Moment date={new Date(status.Activity_datetime)} format="LT" /> */}
        return (
            <>
                <div >
                    {<Stepper activeStep={0} orientation="vertical" connector={<ColorlibConnector />}>
                        {TrackingDetail.map((status, i) => (
                            <Step key={status.Status}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>
                                    {status.Status}<br />
                                    {status.Activity_datetime && <label>
                                        {DateFormatter.formatDate((new Date(status.Activity_datetime.replace(/ /g, "T"))), 'DDDD, DD MMM hh:mm A')}
                                    </label>}
                                </StepLabel>

                            </Step>
                        ))}
                    </Stepper>}
                </div>
            </>
        )
    }

    renderOrderNotReceivedSection(detailData) {
        const { location, complainData, TrackingDetail, packet_list } = this.props;
        const oorderId = complainData.orderData.orderId;

        return (
            <div class="detail-section" style={{ height: document?.getElementsByClassName("centered")[0]?.clientHeight < screen.height ? screen.height : '' }}>
                <h3 className="pageTitle">{detailData.title}</h3>
                <h4 className="orderDeliverySec">{detailData.deliveryDetail}</h4>
                {detailData.deliveryDetail2 && <h4 className="orderDeliverySec">{detailData.deliveryDetail2}</h4>}
                {/* <p className="secMsg">{detailData.msg}</p> */}
                <h4 className="orderDeliverySec">{detailData.msg}</h4>
                {/* <div className="detaileTrackingHeading">Tracking Details</div> */}
                <div className="detaileTrackingHeading">Tracking Details</div>
                <OrderStatusStepper
                    TrackingDetail={TrackingDetail}
                    orderid={oorderId}
                    order={complainData.getOrderById}
                    packet_list={packet_list}
                />
                {detailData.supportBtn && <button type="text" onClick={this.handleFormSubmission} className="submitBtnDetail">Contact Support</button>}
            </div>
        )

    }

    handleInputVal = (event) => {
        this.setState({ address: event, errorMsg: '', fieldValid: true });
    }

    renderCancelOrderSection(detailData) {

        const { location, TrackingDetail, packet_list, complainData, showConfirmPopup } = this.props;
        console.log("this.props;", this.props);
        const { address, fieldValid, errorMsg } = this.state;
        // const oorderId =  location.state.orderData.orderId;
        const oorderId = complainData.orderData.orderId;
        // console.log('complainData.orderData.subOption', complainData);
        if (complainData.orderData.subOption && complainData.orderData.subOption === "itemFaster" || complainData.orderData.subOption && complainData.orderData.subOption === "wrongOrderAddress") {
            return (
                <div class="detail-section" style={{ height: document?.getElementsByClassName("centered")[0]?.clientHeight < screen.height ? screen.height : '' }}>
                    <h3 className="pageTitle">{detailData.title}</h3>
                    {detailData?.subTitle && <h4 className="pageSubTitle" style={{fontSize: '20px'}}>{detailData.subTitle}</h4>}
                    <h4 className="orderDeliverySec">{detailData.deliveryDetail}</h4>
                    {/* {!detailData.courierMsg && <div className="spacer"></div>} */}
                    {/* {detailData.courierMsg && <h4 className="orderDeliverySec">{detailData.courierMsg}</h4>} */}
                    {/* {!detailData.courierMsg && <div className="spacer"></div>} */}
                    {/* <h4 className="orderDeliverySec">{detailData.msg}</p> */}
                    {detailData.msg && <h4 className="orderDeliverySec">{detailData.msg}</h4>}
                    {detailData?.msg2 && <h4 className="orderDeliverySec">{detailData?.msg2}</h4>}
                    
                    {detailData.detailTracking && <div className="detaileTrackingHeading">Tracking Details</div>}
                    {detailData.detailTracking && <OrderStatusStepper
                        TrackingDetail={TrackingDetail}
                        orderid={oorderId}
                        order={complainData.getOrderById}
                        packet_list={packet_list}
                    />}
                    {/* {detailData.showInput && <div><textarea onChange={this.handleInputVal} className="textAreaSec"></textarea></div>} */}
                    {detailData.showInput &&
                        <>
                            <Field
                                type="textarea"
                                className="textAreaSec"
                                id="complainAdd"
                                name="complainAdd"
                                value={address}
                                validation={['notEmpty']}
                                onChange={this.handleInputVal}
                            />
                            {!fieldValid && <div><p className="errorMsg">{errorMsg}</p></div>}
                        </>
                    }
                    {detailData.submit === true && <button type="text" onClick={() => this.handleFormSubmission(detailData.status === 2 ? 2 : 5, detailData?.group)} className="submitBtnDetail">Submit</button>}
                </div>
            )
        }
        if (complainData.orderData.subOption && complainData.orderData.subOption === "mistakenlyPlacedOrder") {

            console.log("detailssssssssssssssssssssssssssssssData.......................", detailData);
            return (
                <div class="detail-section" style={{ height: document?.getElementsByClassName("centered")[0]?.clientHeight < screen.height ? screen.height : '' }}>
                    <h3 className="pageTitle">{detailData.title}</h3>
                    <h4 className="orderDeliverySec mgBt10">{detailData.deliveryDetail}</h4>
                    {!detailData.subMsg && <div className="spacer10"></div>}
                    {detailData.subMsg && <h4 className="orderDeliverySec mgBt10">{detailData.subMsg}</h4>}
                    {/* {detailData.subMsg && <p className="subMsg">{detailData.subMsg}</p>} */}
                    {detailData.showNote && <p className="detaileTrackingHeading">NOTE</p>}
                    <h4 className="orderDeliverySec mgBt10">{detailData?.msg}</h4>
                    {detailData?.msg2 && <h4 className="orderDeliverySec mgBt10">{detailData?.msg2}</h4>}
                    {/* <h4 className="secMsg">{detailData.msg}</h4> */}
                    <div className="spacer10"></div>
                    {detailData.submit && <button type="text" onClick={showConfirmPopup} className="submitBtnDetail">Cancel My Order</button>}
                </div>
            )
        }
        // check 1
        if (complainData.orderData.subOption && complainData.orderData.subOption === "cheaperOrder") {
            return (
                <div class="detail-section" style={{ height: document?.getElementsByClassName("centered")[0]?.clientHeight < screen.height ? screen.height : '' }}>
                    <h3 className="pageTitle">{detailData.title}</h3>
                    {!detailData.submit && <div className="spacer"></div>}
                    {detailData.submit && <div className="spacer10"></div>}
                    <h4 className="orderDeliverySec">{detailData.deliveryDetail}</h4>
                    {/* {!detailData.submit && <div className="spacer"></div>} */}
                    {/* {detailData.msg && <p className="secMsg">{detailData.msg}</p>} */}
                    {detailData.msg && <h4 className="orderDeliverySec">{detailData.msg}</h4>}
                    {detailData.showNoteSec && <div className="detaileTrackingHeading">Note</div>}
                    {/* {detailData.showNoteSec && <p className="noteContent">{detailData.noteMsg}</p>} */}
                    {/* {detailData.showNoteSec && <p className="secMsg">{detailData.noteMsg}</p>} */}
                    {detailData.showNoteSec && <h4 className="orderDeliverySec">{detailData.noteMsg}</h4>}
                    {detailData?.noteMsg2 && <h4 className="orderDeliverySec">{detailData?.noteMsg2}</h4>}
                    {detailData?.noteMsg3 && <h4 className="orderDeliverySec">{detailData?.noteMsg3}</h4>}
                    {detailData.submit && <button type="text" onClick={showConfirmPopup} className="submitBtnDetail">Cancel My Order</button>}
                </div>
            )
        }

        if (complainData.orderData.subOption && complainData.orderData.subOption === "fabricQuality") {
            return (
                <div class="detail-section" style={{ height: document?.getElementsByClassName("centered")[0]?.clientHeight < screen.height ? screen.height : '' }}>
                    <h3 className="pageTitle">{detailData.title}</h3>
                    {!detailData.submit && <div className="spacer"></div>}
                    {detailData.submit && <div className="spacer10"></div>}
                    <h4 className="orderDeliverySec mgBt10">{detailData.deliveryDetail}</h4>
                    {/* {!detailData.submit && <div className="spacer"></div>} */}
                    {detailData.showNoteSec && <div className="detaileTrackingHeading">Note</div>}
                    {/* {detailData.showNoteSec && <p className="noteContent">{detailData.noteMsg}</p>} */}
                    {detailData.showNoteSec && <h4 className="orderDeliverySec">{detailData.noteMsg}</h4>}
                    {detailData?.noteMsg2 && <h4 className="orderDeliverySec">{detailData?.noteMsg2}</h4>}
                    {detailData?.noteMsg3 && <h4 className="orderDeliverySec">{detailData?.noteMsg3}</h4>}
                    {
                        detailData.submit &&
                        <button type="text" onClick={showConfirmPopup} className="submitBtnDetail">Cancel My Order</button>

                    }
                </div>
            )
        }

    }

    changeQuantity = (event) => {
        this.setState({ quantity: event })
    }

    renderIncompleteOrderSection(detailData) {
        const { location, TrackingDetail, packet_list, complainData } = this.props;
        const { address, fieldValid, errorMsg, quantity } = this.state;
        // const oorderId =  location.state.orderData.orderId;
        const oorderId = complainData.orderData.orderId;
        // console.log('complainData.orderData.subOption', complainData);
        // if(complainData.orderData.subOption && complainData.orderData.subOption === "Complete item is missing"){
        return (
            <div class="detail-section" style={{ height: document?.getElementsByClassName("centered")[0]?.clientHeight < screen.height ? screen.height : '' }}>
                <h3 className="pageTitle">{detailData.title}</h3>
                <h4 className="orderDeliverySec">{detailData.deliveryDetail}</h4>
                {!detailData.courierMsg && <div className="spacer"></div>}
                {complainData.orderData.subOption && complainData.orderData.subOption == "Complete item is missing" && <p className='secMsg'>Please add missing quantity.</p>}
                {complainData.orderData.subOption && complainData.orderData.subOption == "Complete item is missing" && <Field
                    customePlusStyle={{ position: "static", paddingLeft: "35px", fontSize: '2em' }}
                    customeMinusStyle={{ paddingRight: '35px', fontSize: '2em' }}
                    id="complain_item_qty"
                    name="item_qty"
                    type="number"
                    min={1}
                    value={quantity}
                    mix={{ block: 'ComplainItem', elem: 'Quantity' }}
                    onChange={this.changeQuantity}
                />}
                <br />
                <br />
                <br />
                <p className="secMsg">{detailData.msg}.</p>
                {detailData.showInput &&
                    <>
                        <Field
                            type="textarea"
                            className="textAreaSec"
                            id="complainAdd"
                            name="complainAdd"
                            value={address}
                            validation={['notEmpty']}
                            onChange={this.handleInputVal}
                        />
                        {!fieldValid && <div><p className="errorMsg">{errorMsg}</p></div>}
                    </>
                }
                {detailData.submit && <button type="text" onClick={this.handleFormSubmission} className="submitBtnDetail">Submit</button>}
            </div>
        )
        // }        
    }

    renderTicketGenerate() {
        console.log('hello world 3 again.............................');
        history.push('/ordercomplain/orderslist');

    }

    renderSuccessContent(detailData) {

        // this.handleFormSubmission();

        return (
            <div class="detail-section" style={{ height: document?.getElementsByClassName("centered")[0]?.clientHeight < screen.height ? screen.height : '' }}>
                <h4 className="successMsg">{detailData.title}</h4>
                <button type="text" onClick={() => this.renderTicketGenerate()} className="submitBtnDetail">Close</button>
            </div>
        )
    }

    Count = 1
    renderContent() {
        const { location, complainData } = this.props;
        const { success } = this.state;
        // let detailData = location.state.detailOptData;
        if (complainData) {
            // console.log("complainData1", complainData);
            let detailData = complainData.detailOptData;
            console.log('let detailData = complainData.detailOptData; from orderDetails.......875', detailData);
            if (success || complainData.section === "DeliveredOrderNotReceived") {

                if (complainData.section === "DeliveredOrderNotReceived") {
                    if (this.Count === 1) {

                        this.handleFormSubmission();
                        this.Count++
                        // console.log('ok hai chal gaya ');
                    }
                    // complainData.section = '';
                }
                return this.renderSuccessContent(detailData)
            } else {
                if (complainData.section === "OrderNotReceived") {
                    return this.renderOrderNotReceivedSection(detailData);
                }
                if (complainData.section === "CancelOrder") {
                    return this.renderCancelOrderSection(detailData);
                }
                if (complainData.section === "incompleteOrder") {
                    return this.renderIncompleteOrderSection(detailData);
                }
            }
        }
    }
    handlePopupConfirm = () => {
        const { hidePopup, setHeaderState } = this.props;
        hidePopup();
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
        this.cancelMyOrder()
    }

    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="Are you sure?" handlePopupConfirm={this.handlePopupConfirm} />
    }
    // customeHeight = null
    // componentDidUpdate = () => {
    //     try {
    //         const divHeight = document.getElementsByClassName("centered")[0]?.clientHeight
    //         const screenHeight = screen.height;
    //         if(divHeight < screenHeight){
    //             this.customeHeight = screenHeight
    //         }

    //     } catch (error) {
    //         console.log('from componentDidUpdate', error);
    //     }
    // }


    render() {
        //  const { isLoading, location, complainData, TrackingDetail, packet_list } = this.props;

        //  console.log('this.props in detailsPage', this.props);

        //  const sec = complainData ? complainData.section : complainData;
        // try {
        //     const divHeight = document.getElementsByClassName("centered")[0]?.clientHeight
        //     const screenHeight = screen.height;
        //     if(divHeight < screenHeight){
        //         this.customeHeight = screenHeight
        //     }
        // } catch (error) {
        //     console.log("error ....... from order details",error);
        //     this.customeHeight = ''
        // }
        console.log('Rerander ....... from order details');
        return (
            <>
                <div className="centered" style={{ height: screen.height }}>
                    {/* {this.changeHeightHandler()} */}
                    {this.renderContent()}
                    {this.renderConfirmPopup()}
                    {/* {detailData.title && <h3 className="pageTitle">{detailData.title}</h3>}
                    
                    {detailData.secondarySubTitle && <h4 className="orderDeliverySec">{detailData.secondarySubTitle}</h4>}
                    
                    {detailData.subTitle && <h4 className="orderDeliverySec">{detailData.subTitle}</h4>}

                    {detailData.content && <p className="content">{detailData.content}</p>}
                    {detailData.detailsTracking && <p className="subContent">You can see the detailed tracking below</p>}
                    {detailData.textAreaHeading && <p className="inputHeading">{detailData.textAreaHeading}</p>}
                    {detailData.textArea && <div><textarea className="textAreaSec"></textarea></div>}
                    {detailData.detailsTracking && <div className="detaileTrackingHeading">{DateFormatter.formatDate((new Date(complainData.orderData.orderData.estimated_delivery.replace(/ /g,"T"))),'DDDD, DD MMM hh:mm A')} Tracking Details</div>}
                    {detailData.detailsTracking && <OrderStatusStepper
                            TrackingDetail={TrackingDetail}
                            orderid={oorderId}
                            order={complainData.getOrderById}
                            packet_list={packet_list}
                        />}
                    {detailData.noteHeading && <p className="noteHead">Note</p>}
                    {detailData.content3 && <p>{detailData.content3}</p>}
                    {detailData.content4 && <p>{detailData.content4}</p>}
                    {detailData.noteHeadingSecondary && <div className="detaileTrackingHeading">Note</div> }
                    {detailData.noteHeadingSecondary && <p className="noteContent">Beware of the replica/counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website</p> }
                    {detailData.submitBtnLabel && <div><button type="text" onClick={this.handleFormSubmission} className="submitBtnDetail">{detailData.submitBtnLabel}</button></div>} */}
                </div>

            </>
        );
    }
}


export default OrderDetails;