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

import './QuestionNotFound.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import { orderType } from 'Type/Account';
import { _cancelOrder, _orderDetailById } from 'Query/Complain.query';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
import ReportRounded from '@material-ui/icons/ReportRounded';
import { styled } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import history from 'Util/History';
import axios from 'axios';
import Field from 'Component/Field';
import ContentWrapper from 'Component/ContentWrapper';

const Input = styled('input')({
    display: 'none',
});
let countForTicket = 0
export class QuestionNotFound extends PureComponent {
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
        detailMsg: "",
        errorMsg: "",
        quantity: 1,
        imgSrc: "https://zellbury.com/media/logo/Support/insert-picture-icon.png"
    }

    // submitFreshDeskTicket = (data) => {
    //     var config = {
    //         method: 'post',
    //         url: 'https://newaccount1631100479992.freshdesk.com/api/v2/tickets',
    //         headers: {
    //             'Authorization': 'Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eA==',
    //             'Content-Type': 'application/json',
    //             'Cookie': '_x_w=2'
    //         },
    //         data: data
    //     };

    //     axios(config)
    //         .then(function (response) {
    //             showNotification('success', __('Ticket Submitted Successfully'));
    //             history.push('/ordercomplain/orderslist');
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }

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
            const { imgSrc, detailMsg } = this.state
            console.log("complainData12", complainData);
            // return;
            let customer = JSON.parse(localStorage.getItem('customer'));
            console.log(customer);
            var blob = this.dataURItoBlob(imgSrc);
            var imageForRMA = imgSrc
            let imgFile = new File([blob], "image.jpg")

            var myHeaders = new Headers();
            let phoneNum = customer.data.email.split('@')[0];
            console.log("complainData from questionNotFound.component.js ..............", complainData);
            const promise1 = new Promise((resolve, reject) => {
                // myHeaders.append("Authorization", "Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eGE=");
                myHeaders.append("Authorization", "Basic aGY2MWJqQkdOU1lsNndRZzA5Uzp4");
                myHeaders.append("Cookie", "_x_w=2");
                var formdata = new FormData();
                formdata.append("attachments[]", imgFile);
                formdata.append("cc_emails[]", ['waqas.pervez@zellbury.com']);
                formdata.append("email", `${customer.data.email}`);
                formdata.append("subject", `Question not found, ${complainData.orderData.orderData.increment_id}`);
                formdata.append("description", `${complainData.orderData.orderData.increment_id} - comment: ${detailMsg}`);
                formdata.append("status", 2)
                formdata.append("priority", 1);
                formdata.append("group_id", 82000622276),
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
                            // showNotification('success', __("Ticket Submitted Successfully"));
                            resolve('ok')
                            // history.push('/ordercomplain/orderslist');
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
                formdata.append("subject", `Question not found, ${complainData.orderData.orderData.increment_id}`);
                formdata.append("group_id", 82000622276);
                formdata.append("type", "Product Related");
                formdata.append("priority", 1);
                formdata.append("status", 2);
                formdata.append("description", `${complainData.orderData.orderData.increment_id} - comment: ${detailMsg}`);
                formdata.append("phone_no", `${phoneNum}`);
                formdata.append("attachments", (imageForRMA.split(','))[1]);
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
                        resolve('ok')

                    })
                    .catch(error => {
                        console.log('error', error)
                        // showNotification('error', __("Invalid Data through promise all"));
                        reject('error')
                    });
            })

            Promise.all([promise1, promise2]).then(values => {
                showNotification('success', __("Ticket Submitted Successfully"));
                history.push('/ordercomplain/orderslist');
                countForTicket--
            }).catch(errors => {
                console.log('error from catch...........', errors);
                showNotification('error', __("Invalid Data"));
                history.push('/ordercomplain/orderslist');
                countForTicket--
            })
        }
    }

    uploadImg = (e) => {
        console.log("e", e.target.files);
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        // console.log('url', url)
        var self = this
        reader.onload = function (e) {
            console.log(e.target)
            self.setState({
                imgSrc: e.target.result
            })
        }

        // reader.onloadend = function (e) {
        //     this.setState({
        //         imgSrc: url
        //     })
        //   }.bind(this);
        //     reader.addEventListener("load", () => {
        //         this.setState({imgSrc : e.target.files[0]});
        //     });
        //   let rd = reader.readAsDataURL(e.target.files[0]);
        //   console.log("Sd", rd);
    }



    renderContent() {
        const { complainData } = this.props;
        const { detailMsg, imgSrc } = this.state;
        return (
            <div>
                <h3 className="pageTitle">Please write details here</h3>
                <div className="subHeading">We are always here to help. Share your question or issue and we'll do the rest.</div>
                {/* <h4 style={{textAlign: 'left', marginLeft: '20px'}}>Comment</h4> */}
                <Field
                    type="textarea"
                    className="textAreaSec"
                    id="item_details"
                    name="item_details"
                    placeholder="Please write details here"
                    value={detailMsg}
                    validation={['notEmpty']}
                    // style={{width: '100%'}}
                    onChange={(e) => this.setState({ ...this.state, detailMsg: e })}
                // mix={{ block: 'ItemDetails', elem: 'Details' }}
                />
                {/* <Field
                    type="text"
                    className="detailsInputField"
                    id="item_details"
                    name="item_details"
                    placeholder="Please write details here"
                    value={detailMsg}
                    onChange={(e) => this.setState({...this.state, detailMsg: e})}
                    mix={{ block: 'ItemDetails', elem: 'Details' }}
                // onChange={ this.changeQuantity }
                /> */}
                <div className="uploadImageSection">
                    <div className="uploadImage">
                        <div className="uploadImageInnerSec">
                            <img src={imgSrc} alt="" />
                        </div>
                    </div>
                    <div className="questionButtonSec">
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={this.uploadImg} />
                            <Button variant="outlined" component="span" className="uploadRaisedButton">
                                Upload an image
                            </Button>
                        </label>
                    </div>
                </div>
                <div className="makeSureSec">
                    <ReportRounded />
                    <p>Make sure no personal information like ID's, phone numbers, emails - or other sensitive information is in this photo before sending</p>
                </div>
                <div><button type="text" className="submitBtn" onClick={this.submitTicketWithImage}>Send</button></div>
            </div>
        )
    }

    handlePopupConfirm = () => {
        const { hidePopup } = this.props;
        hidePopup();
    }

    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="Please confirm so we can share your details with our Store Mangement" handlePopupConfirm={this.handlePopupConfirm} />
    }

    render() {
        return (
            <>
                <div className="centered">
                    <ContentWrapper
                        mix={{ block: 'QuestionsSec', elem: 'Wrapper' }}
                        wrapperMix={{ block: 'QuestionsSec', elem: 'ContentWrapper' }}
                    >
                        {this.renderContent()}
                        {this.renderConfirmPopup()}
                    </ContentWrapper>
                </div>


            </>
        );
    }
}


export default QuestionNotFound;