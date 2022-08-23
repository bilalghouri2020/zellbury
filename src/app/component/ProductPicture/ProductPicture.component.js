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

import './ProductPicture.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Loader from 'Component/Loader';
import { customerType } from 'Type/Account';
import history from 'Util/History';
import LocalSeeIcon from '@material-ui/icons/LocalSee';
import FlipCameraIosTwoTone from '@material-ui/icons/FlipCameraIosTwoTone';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOffOutlined from '@material-ui/icons/HighlightOffOutlined';
import FlashOn from '@material-ui/icons/FlashOn';
import FlashOff from '@material-ui/icons/FlashOff';
import ZoomInOutlined from '@material-ui/icons/ZoomInOutlined';
import ZoomOutOutlined from '@material-ui/icons/ZoomOutOutlined';
import Webcam from "react-webcam";
import isMobile from 'Util/Mobile';
import ExchangeFromStorePopup from 'Component/ExchangeFromStorePopup';
let countForTicket = 0
export class ProductPicture extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired
    };


    state = {
        imageUrl: "",
        cameraOption: { exact: "environment" },
        mobileView: true,
        torchOn: false,
        zoomVal: 1
    }

    webcamRef = React.createRef();

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

        //Old Code
        //write the ArrayBuffer to a blob, and you're done
        //var bb = new BlobBuilder();
        //bb.append(ab);
        //return bb.getBlob(mimeString);

        //New Code
        return new Blob([ab], { type: mimeString });


    }
    capture = () => {
        if (countForTicket === 0) {
            countForTicket++
            // const { updateComplain, complainData } = this.props;

            // console.log('pro', productOption);
            // console.log('pro1', this.props);
            // let obj = {
            //     complainData: complainData,
            //     barcodeMatchedData: productOption
            // }
            // updateComplain(obj);
            const { complainData, showNotification, productOption } = this.props;
            console.log("complainData", complainData);
            console.log("ds", productOption);
            let customer = JSON.parse(localStorage.getItem('customer'));
            const imageSrc = this.webcamRef.current.getScreenshot();
            console.log("imageSrc", imageSrc);


            // return;
            var imageForRMA = imageSrc
            var blob = this.dataURItoBlob(imageSrc);
            let imgFile = new File([blob], "image.jpg")

            
            const promise1 = new Promise((resolve, reject) => {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Basic aGhsYXNxR1NZZDdSVVJzV2p4dWU6eGE=");
                myHeaders.append("Cookie", "_x_w=2");
                var formdata = new FormData();
                formdata.append("attachments[]", imgFile);
                formdata.append("cc_emails[]", ['waqas.pervez@zellbury.com']);
                formdata.append("email", `${customer.data.email}`);
                formdata.append("subject", `${productOption.mainOption} ${productOption.subOption} `);
                formdata.append("description", `Customer has decided to exchange the ${productOption.mainOption} from ${productOption.subOption}`);
                formdata.append("status", "2");
                formdata.append("priority", "1");
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
                            showNotification('error', __("Invalid Data"));
                            reject('error')
                        } else {
                            resolve('ok')
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
                formdata.append("status", 5);
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
                history.push('/ordercomplain/delivered-orders/exchange-order');
                countForTicket--
            }).catch(errors => {
                console.log('error from catch...........', errors);
                showNotification('error', __("Invalid Data"));
                history.push('/ordercomplain/delivered-orders/exchange-order');
                countForTicket--
            })
            // var data = JSON.stringify({
            //     "cc_emails": [
            //       "waqas.pervez@zellbury.com"
            //     ],
            //     "email_config_id": null,
            //     "group_id": null,
            //     "priority": 1,
            //     "email": customer.data.email,
            //     "responder_id": null,
            //     "source": 2,
            //     "status": 2,
            //     "subject": subject,
            //     "type": "Product Related",
            //     "product_id": null,
            //     "description": `${addressVar}`,
            //     "tags": []
            //   });

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
            //     console.log(JSON.stringify(response.data));
            //     showNotification('success', __('Ticket Submitted Successfully'));
            //     history.push('/ordercomplain/orderslist');
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        }
    }

    componentDidMount() {
        window.addEventListener("load", function () {
            setTimeout(function () {
                // This hides the address bar:
                window.scrollTo(0, 1);
            }, 0);
        });

        if (!isMobile.any()) {
            this.setState({ mobileView: false })
        }
    }

    zoomOutCam = () => {
        const { zoomVal } = this.state;
        let stream = this.webcamRef.current.stream;
        const track = stream.getTracks()[0];
        let zoomInVal = zoomVal - 1;
        track.applyConstraints({
            advanced: [{ zoom: zoomInVal }]
        });

        this.setState({ zoomVal: zoomInVal });
    }

    zoomInCam = () => {
        const { zoomVal } = this.state;
        let stream = this.webcamRef.current.stream;
        const track = stream.getTracks()[0];
        console.log(track);
        let zoomInVal = zoomVal + 1;
        let settings = track.getSettings();
        track.applyConstraints({
            advanced: [{ zoom: zoomInVal }]
        });

        this.setState({ zoomVal: zoomInVal });
    }


    openTorch = (e) => {
        const { torchOn } = this.state;

        let stream = this.webcamRef.current.stream;

        console.log('stream', stream);
        console.log('torch', torchOn);
        let flashLightObj;
        if (!torchOn) {
            flashLightObj = {
                torch: true
            }
        } else {
            flashLightObj = {
                torch: false
            }
        }
        const track = stream.getTracks()[0];
        track.applyConstraints({
            advanced: [flashLightObj]
        });
        this.setState({ torchOn: !torchOn })
    }

    setImage = () => {
        const imageSrc = this.webcamRef.current.getScreenshot();
        this.setState({ imageUrl: imageSrc })
    }

    retake = () => {
        this.setState({ imageUrl: '' })
    }

    changeCamera = () => {
        const { cameraOption } = this.state;
        if (cameraOption && cameraOption == "user") {
            this.setState({ cameraOption: { exact: "environment" } })
        } else {
            this.setState({ cameraOption: "user" })
        }
    }

    renderContent = () => {
        const { imageUrl, cameraOption, mobileView, torchOn, zoomVal } = this.state;
        const { showConfirmPopup } = this.props;
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: cameraOption,
            // advanced: [{torch: true}]
        };
        // facingMode: ['user', 'environment'],
        return (
            <div className="camSec">
                {mobileView && <div className="captureZoomButtonSec">
                    {!imageUrl && zoomVal > 1 && <div className="camIconSec">
                        <ZoomOutOutlined onClick={this.zoomOutCam} />
                    </div>
                    }
                    {!imageUrl && zoomVal <= 5 && <div className="camIconSec">
                        <ZoomInOutlined onClick={this.zoomInCam} />
                    </div>
                    }
                </div>
                }
                {!imageUrl && <Webcam
                    className="cameraSection"
                    audio={false}
                    height={320}
                    ref={this.webcamRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    videoConstraints={videoConstraints}
                />}
                {imageUrl && <img src={imageUrl} className="camPicture" />}

                {mobileView && <div className="captureButtonSec">
                    <button
                        className="optionsBtnCam"
                        type="text"
                        onClick={this.setImage}
                        block={"Capture"}
                        elem="Button"
                        mix={{ block: 'Button' }}
                    >
                        {__(`Capture photo`)}
                    </button>

                    <div className="camIconSec">
                        {!imageUrl && <FlipCameraIosTwoTone onClick={this.changeCamera} />}
                        {/* {cameraOption == "user" && <CameraswitchIcon onClick={this.changeCamera} />}
                        {cameraOption.exact == "environment" && <CameraRearIcon onClick={this.changeCamera} />} */}
                    </div>
                    {!imageUrl && <div className="camIconSec">
                        <LocalSeeIcon onClick={this.setImage} />
                    </div>
                    }
                    {!imageUrl && !torchOn && <div className="camIconSec">
                        <FlashOn onClick={this.openTorch} />
                    </div>
                    }
                    {!imageUrl && torchOn && <div className="camIconSec">
                        <FlashOff onClick={this.openTorch} />
                    </div>
                    }
                    {imageUrl && <div className="camIconSec">
                        <HighlightOffOutlined onClick={this.retake} />
                    </div>
                    }
                    {imageUrl && <div className="camIconSec">
                        <CheckCircleOutline onClick={showConfirmPopup} />
                    </div>
                    }
                </div>
                }

                {(!mobileView && !imageUrl) && <div className="captureButtonSec">
                    <button
                        className="optionsBtnCam"
                        type="text"
                        onClick={this.setImage}
                        block={"Capture"}
                        elem="Button"
                        mix={{ block: 'Button' }}
                    >
                        {__(`Capture photo`)}
                    </button>
                </div>
                }
                {(!mobileView && imageUrl) && <div className="retakeButtonSec">
                    <button
                        className="optionsBtnRetake"
                        type="text"
                        onClick={this.retake}
                        block={"Retake"}
                        elem="Button"
                        mix={{ block: 'Button' }}
                    >
                        {__(`Retake`)}
                    </button>
                    <button
                        className="optionsBtnSubmit"
                        type="text"
                        onClick={this.capture}
                        block={"Send"}
                        elem="Button"
                        mix={{ block: 'Button' }}
                    >
                        {__(`Send`)}
                    </button>
                </div>
                }
            </div>
        )
    }

    handlePopupConfirm = () => {
        const { hidePopup, complainData, updateComplain, productOption, setHeaderState } = this.props;
        const { imageUrl } = this.state;
        hidePopup();
        console.log("complainData1", complainData);
        // const imageSrc = this.webcamRef.current.getScreenshot();
        setHeaderState({ name: 'exchange-option' });
        let data = {
            barcodeData: complainData.barcodeData,
            locationData: complainData.locationData,
            barcode: complainData.barcode,
            dataImg: imageUrl,
            productOption: productOption
        }
        updateComplain(data);
        history.push('/ordercomplain/delivered-orders/exchange-order')
    }

    renderConfirmPopup = () => {
        return <ExchangeFromStorePopup title="Are you sure you want to submit?" handlePopupConfirm={this.handlePopupConfirm} />
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

export default ProductPicture;