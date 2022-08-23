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

// import { ParcelStatus } from 'Route/ParcelStatus';
// import { PureComponent } from 'react';
import './OrdersListing.style';
import MyOrdersListing from 'Component/MyOrdersListing';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ContentWrapper from 'Component/ContentWrapper';
import OrderOptions from 'Component/ComplainOrders/OrderOptions';
import OrderDetails from 'Route/MyOrderComplainPage/OrderDetails';
import CancelOrderOptions from 'Component/ComplainOrders/CancelOrderOptions';
import DeliveredOrderOptions from 'Component/ComplainOrders/DeliveredOrderOptions';
import { Component } from 'react';
import history from 'Util/History';
import { _customerOrders, _orderDetailById } from 'Query/Complain.query';
import { DateFormatter, getExpectedDate } from 'Util/Order';
import DateFormat from 'Util/Date';
import { isSignedIn } from 'Util/Auth';
import isMobile from 'Util/Mobile';
import Loader from 'Component/Loader';
import { appendWithStoreCode } from 'Util/Url';
import moment from 'moment';
import jQuery from 'jquery';
// import OrderQuery from 'Query/Order.query';
// import { fetchQuery } from 'Util/Request';

export class OrdersListing extends Component {

    state = {
        value: 0,
        showDetails: false,
        activeTabData: {
            orderId: null,
            orderOption: null,
            subOption: null,
        },
        detailOptionData: {
            title: null,
            subTitle: null,
            secondarySubTitle: null,
            content: null,
            detailsTracking: false,
            textArea: false,
            textAreaHeading: null,
            submitBtnLabel: null,
            content3: null,
            noteHeading: null,
            content4: null,
            noteHeadingSecondary: null,
            orderSubmissionType: null,
        },
        activeOrdersOptions: [{ label: "Order not received", value: "orderNotReceived" }, { label: "Cancel my order", value: "cancelMyOrder" }, { label: "Change my order", value: "changeMyOrder" }],
        deliveredOrdersOptions: [{ label: "I recieved wrong product", value: "wrongProduct" }, { label: "I have received incomplete order", value: "incompleteOrder" }, { label: "I didn't received the order", value: "deliveredOrderNotReceived" }, { label: "I have been overcharged", value: "orderOvercharged" }, { label: "Don't see your question here", value: "questionNotAvailable" }],
        cancelOrderOptions: [{ label: "I entered the wrong delivery address", value: "wrongOrderAddress" }, { label: "I need the item faster", value: "itemFaster" }, { label: "I mistakenly placed an order", value: "mistakenlyPlacedOrder" }, { label: "I found the same design much cheaper in market", value: "cheaperOrder" }, { label: "I am not sure about the quality of fabric", value: "fabricQuality" }],
        incompleteOrderOptions: [{ label: "Complete item is missing", value: "Complete item is missing" }, { label: "Shirt missing", value: "Shirt missing" }, { label: "Duppata missing", value: "Dupatta missing" }, { label: "Shalwar missing", value: "Shalwar missing" }],
        deliveredTabData: {
            orderId: null,
            orderOption: null,
        },
        orderDetailById: null,
        deliveredOrders: [],
        activeOrders: [],
    }

    componentDidMount() {
        const { showNotification, setHeaderState } = this.props;
        setHeaderState({ name: 'order-complain', title: 'Complain form', onBackClick: () => history.goBack() });
        // console.log("hsd", isSignedIn())
        if (!isSignedIn()) {
            console.log('check one ...................');
            history.push({
                pathname: appendWithStoreCode('/')
            });
            showNotification('info', __('Please sign-in to place order complain!'));
            // jQuery(document).ready(function ($) {
            //     $('.Header-Button_type_account').click();
            // });
            return;
        }

        if (isMobile.any() && !isSignedIn()) { // for all mobile devices, simply switch route
            console.log('check two ...................');
            history.push({ pathname: appendWithStoreCode('/my-account') });
            return;
        }
        this.getCustomerOrders();
    }

    getCustomerOrders = async () => {
        const res = await _customerOrders();
        // console.log('ert', res);
        const parse = JSON.parse(res);
        console.log("parse", parse);
        let itemOrders = parse.data.customerPlacedOrder.items;
        let dateToday = moment().format('YYYY-MM-DD');
        console.log("dateToday", dateToday);
        // console.log("rt", dateToday.diff('2021-11-04'), 'days');
        let ft = itemOrders.filter((item) => moment(item.created_at).format('YYYY-MM-DD'))

        if (itemOrders.length) {
            // let active = itemOrders.filter(item => item.status_label =="Shipped" && item.status_label =="Packed" && item.status_label =="confirmed" && item.status_label =="Picking");
            // let delivered = itemOrders.filter(item => item.status_label =="delivered" && item.status_label =="complete" && item.status_label == "closed");
            let datetoday = moment().format("YYYY-MM-DD");
            let start = moment(datetoday, "YYYY-MM-DD");

            let active = itemOrders.filter(item => item.status_label.toLowerCase() != "canceled_inventory_mismatch" && item.status_label.toLowerCase() != "rts" && item.status_label != "delivered" && item.status_label != "complete" && (item.status_label.split('_'))[0] != "closed" && item.status_label != "canceled" && item.status_label != "canceled_reordered" && item.status_label.toLowerCase() != "undelivered" );
            let delivered = itemOrders.filter(item => item.status_label.toLowerCase() != "canceled_inventory_mismatch" && item.status_label.toLowerCase() != "packed" && item.status_label.toLowerCase() != "pending" && item.status_label.toLowerCase() != "processing" && item.status_label != "Shipped" && item.status_label != "confirmed" && item.status_label != "canceled" && item.status_label != "canceled_reordered" && item.status_label.toLowerCase() != "undelivered" && item.status_label.toLowerCase() !== 'oos');
            active = active.filter(item => {
                if (item.status_label.toLowerCase() === 'oos') {
                    return item.status_label = 'picking'
                }
                return item
            })
            let filteredByMonth = delivered.filter((item) => (moment
                .duration(
                    start.diff(
                        moment(item.created_at).format("YYYY-MM-DD"), "YYYY-MM-DD")
                )
            )
                .asDays() <= 30);
            this.setState({ deliveredOrders: filteredByMonth, activeOrders: active });
            // this.setState({deliveredOrders: delivered, activeOrders: active});
        }

        // console.log("fado", parse.data);

    }

    handleChange = (event, newValue) => {
        console.log('new value of tabs........', newValue);
        this.setState({ value: newValue });
    }

    handleChangeOrder = (orderData) => {
        // console.log('handleChangeOrder', orderData);
        // history.push('/ordercomplain/order-options', orderData);
        const { value, activeTabData, deliveredTabData } = this.state;
        if (value === 0) {
            let obj = activeTabData;
            obj['orderData'] = orderData;
            obj.orderId = orderData.id;
            this.setState({ activeTabData: obj });
        } else {
            let obj = deliveredTabData;
            obj['orderData'] = orderData;
            obj.orderId = orderData.id;
            this.setState({ deliveredTabData: obj });
        }
    }


    handleOrderOptionSelect = async (event) => {
        const { value, activeTabData, detailOptionData, deliveredTabData, deliveredOrdersOptions } = this.state;
        const { updateComplain, setHeaderState } = this.props;
        let targetValue = event.target.value;
        let detailData = {};

        if (value === 0) {
            let obj = activeTabData;
            obj.orderOption = targetValue;
            const orderDetailRes = await _orderDetailById(obj.orderId);
            const detailParse = JSON.parse(orderDetailRes);
            let orderDetailData = detailParse.data.getOrderById.base_order_info;
            obj.orderData.status_label = orderDetailData.status_label.toLowerCase();
            if (targetValue === "cancelMyOrder" || targetValue === "changeMyOrder") {
                obj['subOption'] = "";
                this.setState({ activeTabData: obj, orderDetailById: detailParse });
            } else {
                let estimated_delivery = obj.orderData.estimated_delivery;
                let estimatedDeliveryTimeline = ""
                if (estimated_delivery === "No ETA") {
                    estimatedDeliveryTimeline = "No ETA"
                } else if (DateFormat(new Date) === estimated_delivery) {
                    estimatedDeliveryTimeline = "12 - 36 hours"
                } else {
                    estimatedDeliveryTimeline = getExpectedDate(estimated_delivery)
                }

                let period = "";
                // let estDt = parseInt(moment(obj.orderData.estimated_delivery).format('D'));
                // let date_today = parseInt(moment().format('D'));
                // let increased = parseInt(moment(obj.orderData.estimated_delivery).add(2, 'days').format('D'));
                let beforeEstDate = moment().isBefore(obj.orderData.estimated_delivery);
                // let date_today = parseInt(moment().format('D'));
                let date_today = moment().format('DD-MMM-YYYY');
                let dateWith2Days = moment(obj.orderData.estimated_delivery).add(2, 'days').format('DD-MMM-YYYY');
                let increased = moment(obj.orderData.estimated_delivery).add(2, 'days').isBefore(date_today);
                let dateBetween = moment(moment().format('DD-MMM-YYYY')).isBetween(obj.orderData.estimated_delivery, dateWith2Days);
                // let estDt = moment(obj.orderData.estimated_delivery);
                let isSame = moment(moment().format('DD-MMM-YYYY')).isSame(obj.orderData.estimated_delivery);
                let isSameWith2Days = moment(moment().format('DD-MMM-YYYY')).isSame(dateWith2Days);
                // let isBeforeIncreased = moment(moment().format('DD-MMM-YYYY')).isBefore(dateWith2Days);
                // let isAfterEST = moment(moment().format('DD-MMM-YYYY')).isAfter(dateWith2Days);
                // let dateBetween = moment().isBetween(obj.orderData.estimated_delivery, dateWith2Days);
                // console.log("obj.orderData.status_label", obj.orderData);
                // console.log('before', beforeEstDate);
                // console.log("isSame", isSame);
                // // console.log("isBeforeIncreased", isBeforeIncreased);
                // // console.log("isAfterEST", isAfterEST);
                // console.log("increased", increased);
                // console.log("dateWith2Days", dateWith2Days);
                // console.log("dateBetween", dateBetween);

                // if(date_today < estDt){
                //     period = "beforeEst";
                // }else if(date_today == estDt){
                //     period = "afterEst";
                // }else if(date_today <= increased && date_today >= estDt){
                //     period = "afterEst";
                // }else if(date_today > increased){
                //     period = "grace";
                // }

                obj["customer_info"] = detailParse.data.getOrderById.shipping_info;

                // console.log("obj.orderData.status_label", obj.orderData);
                // console.log('increased', increased);
                // console.log("date_today", date_today);
                // console.log("estDt", estDt);
                // console.log("period", period);

                if (beforeEstDate) {
                    detailData["title"] = `Your order is ${obj.orderData.status_label}`;
                    detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} your order is on time and will be delivered between ${estimatedDeliveryTimeline}`;
                    detailData["msg"] = "You can see the detailed tracking below";

                } else if (dateBetween || isSame || isSameWith2Days) {
                    detailData["title"] = `Your order is ${obj.orderData.status_label}`;
                    detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} your order is on time and will be delivered between ${estimatedDeliveryTimeline}`;
                    detailData["msg"] = "You can see the detailed tracking below";
                    // detailData["supportBtn"] = false;
                } else if (increased) {
                    detailData["title"] = `Your order is ${obj.orderData.status_label}`;
                    detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} your order is delayed. Our team is already in touch with the courier partner ${obj.customer_info.shipping_description.split('-')[0]} to ensure you get your order.`;
                    detailData["msg"] = "We apologize for the inconvenience.\n You can see the detailed tracking below.";
                    detailData["supportBtn"] = true;
                } else if (obj.orderData.status_label.toLowerCase() === 'shipped' || obj.orderData.status_label.toLowerCase() === 'packed') {
                    detailData["title"] = `Your order is ${obj.orderData.status_label}`;
                    detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} your order is delayed. Our team is already in touch with the courier partner ${obj.customer_info.shipping_description.split('-')[0]} to ensure you get your order.`;
                    detailData["msg"] = "We apologize for the inconvenience.\n You can see the detailed tracking below.";
                    detailData["supportBtn"] = true;
                }

                // if(period == "beforeEst"){
                //     detailData["title"] = `Your Order is ${obj.orderData.status_label}`;
                //     detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname} your order is on time and will be delivered between ${estimatedDeliveryTimeline}`;
                //     detailData["msg"] = "You can see the detailed tracking below";
                // }else if(period == "afterEst"){
                //     detailData["title"] = `Your Order is ${obj.orderData.status_label}`;
                //     detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname} your order is on time and will be delivered between ${estimatedDeliveryTimeline}`;
                //     detailData["msg"] = "You can see the detailed tracking below";
                //     detailData["supportBtn"] = true;
                // }else if(period == "grace"){
                //     detailData["title"] = `Your Order is ${obj.orderData.status_label}`;
                //     detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname} your order is delayed. Our teams are ready in touch with the courier partner ${obj.customer_info.shipping_description.split('-')[0]} to ensure you get your order.`;
                //     detailData["msg"] = "We apologize for the inconvenience.\n You can see the detailed tracking below.";
                //     detailData["supportBtn"] = true;
                // }

                // detailData.detailsTracking = true;

                if (period === "" && activeTabData.orderData.status_label != 'confirmed') {
                    detailData.submitBtnLabel = "CANCEL MY ORDER";
                    detailData.orderSubmissionType = "cancel";
                }

                // if(activeTabData.orderData.status_label != 'confirmed'){
                //     detailData.submitBtnLabel = "CANCEL MY ORDER";
                //     detailData.orderSubmissionType = "cancel";
                // }


                let dataObj = {
                    orderData: obj,
                    detailOptData: detailData,
                    getOrderById: detailParse.data.getOrderById,
                    section: "OrderNotReceived"
                }
                updateComplain(dataObj);
                history.push('/ordercomplain/active-orders/order-detail', dataObj);
            }

            // console.log('activeTabData', activeTabData);
            // let showDetailForm = false;
            // let detailData;
            if (activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "orderNotReceived") {
                detailData = detailOptionData;
                showDetailForm = true;
                detailData.title = 'Your order is pending';
                detailData.content = "Fahad your order is on time will be delivered between 20/20/2021";
                detailData.detailsTracking = true;
                detailData.submitBtnLabel = "CONTACT SUPPORT"
            }

        } else {
            let obj = deliveredTabData;
            // console.log('obj', obj);
            obj.orderOption = targetValue;
            const orderDetailRes = await _orderDetailById(obj.orderId);
            const detailParse = JSON.parse(orderDetailRes);
            if (targetValue === "deliveredOrderNotReceived") {
                detailData['title'] = " We have received your complaint. Our Customer service team will get in touch with you within 24 hours. \n\n\nThank you for patience."

                let dataObj = {
                    orderData: obj,
                    detailOptData: detailData,
                    getOrderById: detailParse.data.getOrderById,
                    section: "DeliveredOrderNotReceived"
                }
                updateComplain(dataObj);
                history.push('/ordercomplain/active-orders/order-detail');

            }
            else if (targetValue == 'orderOvercharged') {
                let dataObj = {
                    orderData: obj,
                    getOrderById: detailParse.data.getOrderById,
                };

                updateComplain(dataObj);
                history.push('/ordercomplain/delivered-orders/overcharged-issue');
            }
            else if (targetValue === "incompleteOrder") {
                obj['subOption'] = "";
                this.setState({ deliveredTabData: obj, orderDetailById: detailParse });
            } else if (targetValue === "questionNotAvailable") {
                let dataObj = {
                    orderData: obj,
                    getOrderById: detailParse.data.getOrderById,
                };

                updateComplain(dataObj);
                history.push('/ordercomplain/questions-not-found');
            } else {
                let dataObj = {
                    orderData: obj,
                    getOrderById: detailParse.data.getOrderById,
                };
                // setHeaderState({name: 'complain-order-scan'})
                setHeaderState({ name: 'complain-order-scan', title: 'Scan the Price tag', onBackClick: () => history.goBack() });
                updateComplain(dataObj);
                console.log(dataObj, 'objdata');
                history.push('/ordercomplain/qrcode', dataObj);
                // history.go(0)
            }

            // console.log('dataObj',dataObj);
            // history.push('/ordercomplain/delivered-orders/exchange-order');
            // let obj = deliveredOrdersOptions;
            // obj.orderOption = targetValue;
            // let showDetailForm = false;
            // let detailData;
            // if(deliveredOrdersOptions.orderId && activeTabData.orderOption && activeTabData.orderOption === "orderNotReceived"){
            //     detailData  = detailOptionData;
            //     showDetailForm = true;
            //     detailData.title = 'Your order is pending';
            //     detailData.content = "Fahad your order is on time will be delivered between 20/20/2021";
            //     detailData.detailsTracking = true;
            //     detailData.submitBtnLabel = "CONTACT SUPPORT"
            //  }

            // this.setState({ activeTabData: obj, showDetails: showDetailForm });
        }
    }

    handleSubOptionChange = (event) => {
        let targetVal = event.target.value;
        const { value, activeTabData, deliveredTabData, detailOptionData, showDetailForm, orderDetailById } = this.state;
        console.log("value", value);
        const { updateComplain } = this.props;
        let obj;
        let detailData = {};
        if (value === 0) {
            // let showDetailForm = false;
            obj = activeTabData;
            console.log('obj', obj);
            if (activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "cancelMyOrder" && targetVal || activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "changeMyOrder" && targetVal) {
                // showDetailForm = true;
                obj.subOption = targetVal;
                // detailData  = detailOptionData;
                obj["customer_info"] = orderDetailById.data.getOrderById.shipping_info;
                let estimatedTimeCheck
                let estimated_delivery = obj.orderData.estimated_delivery;
                let estimatedDeliveryTimeline = ""
                if (estimated_delivery === "No ETA") {
                    estimatedDeliveryTimeline = "No ETA"
                } else if (DateFormat(new Date) === estimated_delivery) {
                    estimatedDeliveryTimeline = "12 - 36 hours"
                    estimatedTimeCheck = true
                } else {
                    estimatedDeliveryTimeline = getExpectedDate(estimated_delivery)
                }
                let date_today = moment().format('DD-MMM-YYYY');
                let increased = moment(obj.orderData.estimated_delivery).add(2, 'days').isBefore(date_today);

                if (targetVal === "wrongOrderAddress") {

                    if (obj.orderData.status_label === "pending" || obj.orderData.status_label === "confirmed" || obj.orderData.status_label === "picking" || obj.orderData.status_label === "processing") {
                        detailData["title"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                        detailData["deliveryDetail"] = 'We will change your delivery address';
                        detailData["msg"] = "Please update the correct delivery address";
                        detailData["showSpacer"] = true;
                        detailData["showInput"] = true;
                        if (estimatedTimeCheck === false) {
                            detailData["submit"] = true
                        }
                    } else if (obj.orderData.status_label.toLowerCase() === "packed" || obj.orderData.status_label.toLowerCase() === "shipped") {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        // detailData["subTitle"] = `That's not Possible, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                        detailData["deliveryDetail"] = `I'm afraid it's a little too late to cancel your order now as it is already ${obj.orderData.status_label.toLowerCase()} by our courier. Expect to receive your order at your doorstep at (${estimatedDeliveryTimeline}).`;
                        detailData["deliveryDetail2"] = `Any order cancellations at this point will not be refunded if it's online paid or in the case of COD you might be prevented from using COD in future.`;

                        detailData["showNoteSec"] = true;
                        detailData["noteMsg"] = "Beware of the replica / counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website."
                        // detailData["submit"] = true;

                    } else {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        detailData["deliveryDetail"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your desired address`;
                        // detailData["msg"] = "Please update the correct delivery address";
                        detailData["showInput"] = true;
                        detailData["submit"] = true;
                    }

                    // detailData.subTitle = "We will change your delivery address";
                    // detailData.textAreaHeading = "Please update the correct delivery address";
                    // detailData.submitBtnLabel = "Submit";
                    // detailData.textArea = true;
                }
                if (targetVal === "itemFaster") {

                    if (obj.orderData.status_label.toLowerCase() === "packed" || obj.orderData.status_label.toLowerCase() === "shipped") {
                        if (increased) {
                            detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                            // detailData["deliveryDetail"] = `I'm afraid it's a little too late to cancel your order now as it is already ${obj.orderData.status_label.toLowerCase()} by our courier. Expect to receive your order at your doorstep at (${estimatedDeliveryTimeline}).`;
                            // detailData["deliveryDetail2"] = `Any order cancellations at this point will not be refunded if it's online paid or in the case of COD you might be prevented from using COD in future.`;
                            detailData["deliveryDetail"] = `your order will be delivered between ${obj?.orderData?.estimated_delivery}`;
                            detailData["msg"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your order faster`;
                            detailData["msg2"] = "You can see the detailed tracking below";
                            detailData["detailTracking"] = true;
                            // detailData["msg"] = "Once your account is blocked you will not be able to use COD option in future.";
                            // detailData["showNote"] = true;
                            detailData["submit"] = true;
                            detailData["status"] = 2;
                            detailData["group"] = 82000632682;
                        } else {
                            detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                            // detailData["deliveryDetail"] = `I'm afraid it's a little too late to cancel your order now as it is already ${obj.orderData.status_label.toLowerCase()} by our courier. Expect to receive your order at your doorstep at (${estimatedDeliveryTimeline}).`;
                            // detailData["deliveryDetail2"] = `Any order cancellations at this point will not be refunded if it's online paid or in the case of COD you might be prevented from using COD in future.`;
                            detailData["deliveryDetail"] = `your order will be delivered between ${obj?.orderData?.estimated_delivery}`;
                            detailData["msg"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your order faster`;
                            detailData["msg2"] = "You can see the detailed tracking below";
                            detailData["detailTracking"] = true;
                            // detailData["msg"] = "Once your account is blocked you will not be able to use COD option in future.";
                            // detailData["showNote"] = true;
                            // detailData["submit"] = true;

                        }
                    } else {
                        if (increased) {
                            // detailData["title"] = `Your order is ${obj.orderData.status_label}`;
                            detailData["title"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                            // detailData["subTitle"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                            // detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} Your order is delayed. Our teams are already in touch with the courier partner ${obj?.customer_info?.shipping_description} to ensure you get your order`;
                            // detailData["deliveryDetail2"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your order faster`;
                            // detailData["courierMsg"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your order faster`;
                            // detailData["detailTracking"] = true;
                            // detailData["submit"] = true;
                            // detailData["title"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} your order is delayed. Our teams are already in touch with the courier partner Leoperd to ensure you get your order.`;
                            // detailData["courierMsg"] = `We apologize for inconvenience you can see the detailed tracking below.`;
                            // detailData["msg"] = "We apologize for inconvenience you can see the detailed tracking below.";
                            detailData["deliveryDetail"] = `your order will be delivered between ${obj?.orderData?.estimated_delivery}`;
                            detailData["msg"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your order faster`;
                            detailData["msg2"] = "You can see the detailed tracking below";
                            detailData["detailTracking"] = true;
                            detailData["increase_data"] = true;
                            detailData["submit"] = true;
                            detailData["status"] = 2;

                        } else {
                            // detailData["title"] = `Your order is ${obj.orderData.status_label}`;
                            detailData["title"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                            // detailData["subTitle"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                            // detailData["deliveryDetail"] = `Your order will be delivered between ${estimatedDeliveryTimeline} `;
                            // detailData["deliveryDetail"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} Your order is on time and will be delivered between ${estimatedDeliveryTimeline}`;
                            detailData["deliveryDetail"] = `your order will be delivered between ${obj?.orderData?.estimated_delivery}`;
                            detailData["msg"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your order faster`;
                            detailData["msg2"] = "You can see the detailed tracking below";
                            // detailData["courierMsg"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your order faster`;
                            // detailData["detailTracking"] = true;
                            // detailData["submit"] = true;
                            // detailData["title"] = `${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()} your order is delayed. Our teams are already in touch with the courier partner Leoperd to ensure you get your order.`;
                            // detailData["courierMsg"] = `We apologize for inconvenience you can see the detailed tracking below.`;
                            // detailData["msg"] = `We will contact our courier partner ${obj?.customer_info?.shipping_description} to deliver your order faster`;
                            // detailData["msg2"] = "You can see the detailed tracking below";
                            detailData["detailTracking"] = true;
                            // detailData["submit"] = true;

                        }
                    }
                }
                if (targetVal === "mistakenlyPlacedOrder") {
                    if (obj.orderData.status_label === "pending" || obj.orderData.status_label === "confirmed" || obj.orderData.status_label === "picking" || obj.orderData.status_label === "processing") {
                        detailData["title"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                        detailData["deliveryDetail"] = "Frequent cancellations may occur in blocking of your account";
                        detailData["msg"] = "Once your account is blocked you will not be able to use COD option in future.";
                        detailData["submit"] = true;
                    } else if (obj.orderData.status_label.toLowerCase() === "packed" || obj.orderData.status_label.toLowerCase() === "shipped") {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        detailData["deliveryDetail"] = `I'm afraid it's a little too late to cancel your order now as it is already ${obj.orderData.status_label.toLowerCase()} by our courier. Expect to receive your order at your doorstep at (${estimatedDeliveryTimeline}).`;
                        detailData["deliveryDetail2"] = `Any order cancellations at this point will not be refunded if it's online paid or in the case of COD you might be prevented from using COD in future.`;
                        detailData["msg"] = "Frequent cancellations may occur in blocking of your account.";
                        detailData["msg2"] = "Once your account is blocked you will not be able to use COD option in future.";
                        detailData["showNote"] = true;
                    } else {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        detailData["deliveryDetail"] = "Frequent cancellations may occur in blocking of your account";
                        detailData["msg"] = "Once your account is blocked you will not be able to use COD option in future.";
                        detailData["showNote"] = true;
                    }
                }
                if (targetVal === "cheaperOrder") {
                    if (obj.orderData.status_label === "pending" || obj.orderData.status_label === "confirmed" || obj.orderData.status_label === "picking" || obj.orderData.status_label === "processing") {
                        detailData["title"] = `That's not Possible, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                        detailData["deliveryDetail"] = "Our prices are uniform across all our sales channels";
                        detailData["msg"] = "Please note we will only provide after sales services for customers who have purchased directly from one of our stores or our websites.";
                        detailData["showNoteSec"] = true;
                        detailData["noteMsg"] = "Beware of the replica / counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website."
                        detailData["submit"] = true;
                    } else if (obj.orderData.status_label.toLowerCase() === "packed" || obj.orderData.status_label.toLowerCase() === "shipped") {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        detailData["deliveryDetail"] = `I'm afraid it's a little too late to cancel your order now as it is already ${obj.orderData.status_label.toLowerCase()} by our courier. Expect to receive your order at your doorstep at (${estimatedDeliveryTimeline}).`;
                        detailData["deliveryDetail2"] = `Any order cancellations at this point will not be refunded if it's online paid or in the case of COD you might be prevented from using COD in future.`;
                        // detailData["msg"] = "Please note we will only provide after sales services for customers who have purchased directly from one of our stores or our websites.";
                        detailData["showNoteSec"] = true;
                        detailData["noteMsg"] = "Beware of the replica / counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website."
                        // detailData["noteMsg2"] = "Frequent cancellations may occur in blocking of your account";
                        // detailData["noteMsg3"] = "Once your account is blocked you will not be able to use COD option in future.";
                        detailData["submit"] = false;
                    } else {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        detailData["deliveryDetail"] = "If you wish to not receive this order you can refuse it to our courier at doorstep.";
                        detailData["showNoteSec"] = true;
                        detailData["noteMsg"] = "Beware of the replica / counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website."

                    }
                }
                if (targetVal === "fabricQuality") {
                    if (obj.orderData.status_label === "pending" || obj.orderData.status_label === "confirmed" || obj.orderData.status_label === "picking" || obj.orderData.status_label === "processing") {
                        detailData["title"] = `Not to Worry, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                        detailData["deliveryDetail"] = "Zellbury aim to sell original products and focus on quality fabric to fullfil the customer requirement. Our designs are unique & our fabric is carefully crafted to last hot & humid weather.";
                        detailData["showNoteSec"] = true;
                        detailData["noteMsg"] = "Beware of the replica / counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website."
                        detailData["submit"] = true;

                    } else if (obj.orderData.status_label.toLowerCase() === "packed" || obj.orderData.status_label.toLowerCase() === "shipped") {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        detailData["deliveryDetail"] = `I'm afraid it's a little too late to cancel your order now as it is already ${obj.orderData.status_label.toLowerCase()} by our courier. Expect to receive your order at your doorstep at (${estimatedDeliveryTimeline}).`;
                        detailData["deliveryDetail2"] = `Any order cancellations at this point will not be refunded if it's online paid or in the case of COD you might be prevented from using COD in future.`;
                        detailData["showNoteSec"] = true;
                        detailData["noteMsg"] = "Beware of the replica / counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website."
                        // detailData["noteMsg2"] = "Frequent cancellations may occur in blocking of your account";
                        // detailData["noteMsg3"] = "Once your account is blocked you will not be able to use COD option in future.";
                        detailData["submit"] = false;

                    } else {
                        detailData["title"] = `Your order is already ${obj.orderData.status_label}`;
                        detailData["deliveryDetail"] = "If you wish to not receive this order you can refuse it to our courier at doorstep.";
                        detailData["showNoteSec"] = true;
                        detailData["noteMsg"] = "Beware of the replica / counterfelt items sold in the market under our brands name. If you wish to purchase original Zellbury products, please purchase at from one of our stores or our website."
                    }
                }

                // console.log('obj', obj);
                let dataObj = {
                    orderData: obj,
                    detailOptData: detailData,
                    getOrderById: orderDetailById.data.getOrderById,
                    section: "CancelOrder"
                }
                updateComplain(dataObj);
                history.push('/ordercomplain/active-orders/order-detail', dataObj);
                //    this.setState({ activeTabData: obj, showDetails: showDetailForm, detailOptionData: detailData });
            }


        } else {
            obj = deliveredTabData;
            if (deliveredTabData.orderId && deliveredTabData.orderOption && deliveredTabData.orderOption === "incompleteOrder" && targetVal) {
                obj.subOption = targetVal;
                obj["customer_info"] = orderDetailById.data.getOrderById.shipping_info;
                if (targetVal === "Complete item is missing") {

                    // if(obj.orderData.status_label ==="pending" || obj.orderData.status_label ==="confirmed" || obj.orderData.status_label ==="picking" || obj.orderData.status_label ==="processing"){
                    detailData["title"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                    detailData["deliveryDetail"] = 'We will look into it';
                    detailData["showSpacer"] = true;
                    detailData["msg"] = "Please add comments below";
                    detailData["showQuantity"] = true;
                    detailData["showInput"] = true;
                    detailData["submit"] = true;
                    // }else{
                    //     detailData["title"] = `Your Order is already ${obj.orderData.status_label}`;
                    //     detailData["deliveryDetail"] = `We will contact our courier partner ${obj.customer_info.shipping_description.split('-')[0]} to deliver your order at your desired address`;
                    //     detailData["msg"] = "Please update the correct delivery address";
                    //     detailData["showInput"] = true;
                    //     detailData["submit"] = true;
                    // }
                } else if (targetVal === "Shirt missing" || targetVal === "Dupatta missing" || targetVal === "Shalwar missing") {
                    detailData["title"] = `No Worries, ${obj.customer_info.shipping_address.firstname.split(' ')[0].trim()}`;
                    detailData["deliveryDetail"] = 'We will look into it';
                    detailData["showSpacer"] = true;
                    detailData["msg"] = "Please add comments below";
                    detailData["showQuantity"] = false;
                    detailData["showInput"] = true;
                    detailData["submit"] = true;
                }
                let dataObj = {
                    orderData: obj,
                    detailOptData: detailData,
                    getOrderById: orderDetailById.data.getOrderById,
                    section: "incompleteOrder"
                }
                updateComplain(dataObj);
                history.push('/ordercomplain/active-orders/order-detail');
            }
        }
    }

    handleBackRoute = () => {
        const { value, activeTabData, detailOptionData, showDetails } = this.state;
        if (value === 0) {
            let obj = activeTabData;
            let showDetailsData = showDetails;
            showDetailsData = false;
            if (obj.subOption) {
                obj.subOption = null;

            } else if (obj.orderOption) {
                obj.orderOption = null;
            } else if (obj.orderId) {
                obj.orderId = null;
            }

            this.setState({ activeTabData: obj, showDetails: showDetailsData })
        }
    }

    renderContent() {
        const { deliveredOrders, cancelOrderOptions, activeOrders, value, incompleteOrderOptions, showDetails, activeTabData, activeOrdersOptions, deliveredOrdersOptions, deliveredTabData, detailOptionData } = this.state;

        // console.log('activeTabData', activeTabData);
        // console.log('detialOptionData', showDetails);
        return (
            <div className="orderListingSection">
                {/* <div className="customHeader">
                    <button onClick={this.handleBackRoute}>
                        <ArrowBackIcon />
                    </button>
                </div> */}
                <ContentWrapper
                    label={__('My Order Complain Page')}
                    wrapperMix={{ block: 'MyOrderListing', elem: 'Wrapper' }}
                >
                    {!activeTabData.orderOption && (
                        <Tabs indicatorColor="white" inkBarStyle={{ backgroundColor: '#e77600' }} value={value} onChange={this.handleChange} aria-label="ordersTab">
                            <Tab className="complainTabs" label="Active Orders" />
                            <Tab className="complainTabs" label="Delivered Orders" />
                        </Tabs>
                    )}

                    {value === 0 && (
                        <div value={value} index={0}>
                            {showDetails ? <OrderDetails detailData={detailOptionData} />
                                : activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "cancelMyOrder"
                                    || activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "changeMyOrder"
                                    ? <CancelOrderOptions handleSubOptionChange={this.handleSubOptionChange} cancelOrdersOptions={cancelOrderOptions} />
                                    : activeTabData.orderId && !activeTabData.orderOption
                                        ? <OrderOptions ordersOptions={activeOrdersOptions} handleOrderOptionSelect={this.handleOrderOptionSelect} />
                                        : <MyOrdersListing ordersList={activeOrders} handleChangeOrder={this.handleChangeOrder} />}
                            {/* // { activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "orderNotReceived" ? <OrderDetails />  : 
                            // activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "cancelMyOrder" || activeTabData.orderId && activeTabData.orderOption && activeTabData.orderOption === "changeMyOrder" ? 
                            // <CancelOrderOptions handleSubOptionChange={handleSubOptionChange} cancelOrdersOptions={cancelOrderOptions}/>  : activeTabData.orderId && !activeTabData.orderOption ? <OrderOptions ordersOptions={activeOrdersOptions} handleOrderOptionSelect={ this.handleOrderOptionSelect } /> : <MyOrdersListing handleChangeOrder={ this.handleChangeOrder }/>} */}
                        </div>
                    )}
                    {value === 1 && (
                        // <div value={value} index={1}>
                        //     <CancelOrderOptions cancelOrdersOptions={cancelOrderOptions}/>
                        // </div>
                        <div value={value} index={1}>
                            {/* deliveredTabData.orderId && deliveredTabData.orderOption && deliveredTabData.orderOption === "deliveredOrderNotReceived" ||  */}
                            {deliveredTabData.orderId && deliveredTabData.orderOption && deliveredTabData.orderOption === "incompleteOrder"
                                ?
                                <DeliveredOrderOptions handleSubOptionChange={this.handleSubOptionChange} deliveredOrderOptions={incompleteOrderOptions} />
                                :
                                deliveredTabData.orderId && !deliveredTabData.orderOption
                                    ?
                                    <OrderOptions ordersOptions={deliveredOrdersOptions} handleOrderOptionSelect={this.handleOrderOptionSelect} />
                                    :
                                    <MyOrdersListing ordersList={deliveredOrders} handleChangeOrder={this.handleChangeOrder} />}
                        </div>
                    )}
                </ContentWrapper>
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div>
                <Loader isLoading={false} />
                {/* { this.renderVideoSection() } */}
                {this.renderContent()}
            </div>
        );
    }
}

export default OrdersListing;
