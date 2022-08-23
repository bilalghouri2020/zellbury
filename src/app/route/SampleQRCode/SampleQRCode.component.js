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
import { PureComponent } from 'react';
import './SampleQRCode.style';
import ScanditBarcodeScanner from "scandit-sdk-react";
import { _validateBarcode } from 'Query/QRSCAN.query';
import {
    Barcode,
    BarcodePicker,
    Camera,
    CameraAccess,
    CameraSettings,
    ScanSettings,
    SingleImageModeSettings,
} from "scandit-sdk";
import history from 'Util/History';
import PropTypes from 'prop-types';
import { CodeSharp } from '@material-ui/icons';
// const licenseKey = "AWjQFD/+H1suKd4clyAclO0HPe0zPEMNcBJ44v1nIQrgC4c48lOs6GlceRicAZ1hfCL/kMNLaa0UTMgwNQrs/z14pvNmT7vtpGwiyaNGLWMkVlrsQ2ltZUo1SvXfFP/3XkMPfR1EfSw03PqfjREbq5IeAKoANMRRNLSQ1SY7i4DC6TM7ijP1Qtuep4aY9oCPJ7UaHd33FKZv72k+efkrWXyi1uZt7AyA2Q8YQ8cFCc94D1Kd0R5uD8oc1yDpf61Jr71BcmliJ9n1hFHIxPin1Y9nvzOOtNv/IwCfh9xGBn6/ujXttd41x3E2D44nmQ+GfX16bwXLkbGUHcjMWbcotXhKZ2AduMz4qsp6PY2iU5XiuZd9Lp0ra2BswiJGfnzjhhbsx3J6lj+i+pFycdt8Z3rshT8D3LDvm2rcKQ4XlSJstdofu5syd8Bin9ql7FzUI9+Q9iLX1K+zX0A0meDke8JMPqXwJR96TigLX2CcJalSdkpQk2+Zcj3BEBolNyMN7ME5GOU4XIHx6ihZZT5v6MDSecACPIJSoKqhmf6Lu7p/152i8b+bNYMtSSAuNscnI8FM5e42/XSUUYsLqpnCeFcPbBLtdDgt5XiYVMuqsXN7NUoD4j1meIJ0UWHnkGJnCRe2C+7euHei2qKSnE2KfiRmyIlByx/Ixcr5XkdTKcZ7f6pPc3WmU0E64glx8x8Yj/vCneiXl9nFDPzKDaucw6ab3HhHN/Fqcy4xNxb2D//qOwSBCkduxhre7kHS+jbjZ2ky2/nbp//f9CAB20g9WsT4KVZlV1kXS+aaVCk0z9G/r2ZCzGcZEQ=="
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const licenseKey = "AYqxPgpPKG35QHlNdxQsLkcVl6ukGtQDdRsMbVU2bB38Wu5EamnIjEtkoLOEeNw5OQRlIgdHEXDqMSX6hUJIt612TgIpRxSO42Kq20hizy7HQ4R9E2K4fHlmLy6mY8ZkbzwQ/UUhGD45KLkfDhHekLcIFgLKJzSwYhPzWgstUFveUVyupbJmFt5vv9TVY2SKAQ+0LOCSWmy1Il94RbdrgKEGtoeXbZ3uXVpujgSwwOeKhShGgE7Y53yt7gqS4e3z4iDSNTseNecqRGKPY2z82L+o5jNTl3P89RloPhq/Yw6O0niItzjJ0JrinSAXQrOamwEyhHzBXm+UMtQs9Ui9CLIfBi8vmlVkApNzy47oNIiw4i3uUs0RLIqKa5fFOfgdSxW6vSM9q7x5FRdZ8sP/MtPYT0XF0COfOlahkS9RlHWGQpqrT8jgVT57bDkttG85eWrNJEWlYSmRYRWO9gQvPWTpMhxGDJ4Mwk4prOmRWcdkkcCdrAFpKu/2FKpB0ZOhQ6gFpwmhlg51rauYz/TbVIuyObo3RE0pEbVtNsNnp+zmKVEWV/2SLYCFRRmdSvR3bUmyFpo7HdxCj5W647LPjqUc+h2O4c+AferUmVvdHJxoXav2fJE2QXZgN6bjzwPz739LRjTKI84Om2r9+PTFrdOnvngG/DmicdTugYYZqDVOWEpzfsbcqW+EWJyCEjN72nV2v0mmjetbSnv1QT98tPejzseqafkpq//S4iUh6IXshm++pZ7BKPUQSdCvDM3lRfCfS5rk/Cn/26a0SfqjKGYOo7FzQZbNWar4Nw7pB6C393NiZYb6lkiAzl+PG546c0HB9YrR"

export class SampleQRCode extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
    };

    state = {
        barcodeNumber: null, validateBarcode: null, isOpen: false
    }

    barcodeValidate = async (barcode, id) => {
        const { location, complainData, showNotification, updateComplain } = this.props;
        const res = await _validateBarcode(barcode, id);
        const parse = JSON.parse(res);
        console.log("parse", parse);
        if (parse && parse?.data?.validateBarcode) {
            if (parse?.data?.validateBarcode?.items?.length && parse?.data?.validateBarcode?.items[0]?.status == 200) {
                // let itemMsg = parse.data.validateBarcode.items[0].message;
                // let orderBarcode = parse.data.validateBarcode.product[0].order_barcode;
                // let scannedBarcode = parse.data.validateBarcode.user[0].scanned_barcode;
                let data = {
                    barcodeData: parse,
                    locationData: complainData,
                    barcode: barcode
                }
                if (parse.data.validateBarcode.items[0].barcode_response == 2) {
                    showNotification('success', __('Barcode Verified'));
                    updateComplain(data);
                    history.push('/ordercomplain/delivered-orders/order-change-options', data)
                }
                if (parse.data.validateBarcode.items[0].barcode_response == 1) {
                    showNotification('success', __(parse.data.validateBarcode.items[0].message));
                    updateComplain(data);
                    history.push('/ordercomplain/delivered-orders/exchange-order', data)
                }
            } else {
                showNotification('error', __(parse?.data?.validateBarcode?.items[0]?.message));
            }
        } else {
            console.log(parse.errors[0].message);
        }


        // if(parse.data.validateBarcode != null){
        //     if(orderBarcode && orderBarcode == scannedBarcode){
        //         // console.log("barcode matched with order");
        //         history.push('/ordercomplain/delivered-orders/order-change-options', data)
        //     }else{
        //         // console.log("barcode is not matching with order");
        //         history.push('/ordercomplain/delivered-orders/exchange-order', data)
        //     }

        // }else{
        //     console.log('Barcode is not valid');
        // }

        // console.log("ssfs",itemMsg);
        // if(itemMsg == "Barcode is valid but doesnt match with order product"){
        //     history.push('/ordercomplain/delivered-orders/exchange-order', data)
        // }

    }
    componentDidMount() {
        // const { location, complainData } = this.props;
        console.log("BarcodePicker", BarcodePicker);
        const { complainData, updateComplain, setHeaderState } = this.props;
        console.log(complainData, 'complain data');
        if (!complainData) {

            history.push('/ordercomplain/orderslist');
        }
        setHeaderState({ name: 'complain-order-scan', title: 'Scan the Price tag', onBackClick: () => history.goBack() });
        // console.log('sdjd', location);
        // console.log('hey tse', this.props);
        // let data = {
        //     // barcodeData : parse,
        //     locationData: complainData,
        //     // barcode: barcode
        // }
        // updateComplain(data);
        // history.push('/ordercomplain/delivered-orders/exchange-order', data)
        // this.barcodeValidate(complainData.orderData.orderId);
    }

    getScanSettings = () => {
        console.log("Barcode", Barcode);
        return new ScanSettings({
            enabledSymbologies: [Barcode.Symbology.AZTEC, Barcode.Symbology.CODABAR, Barcode.Symbology.CODE11, Barcode.Symbology.CODE128, Barcode.Symbology.CODE25, Barcode.Symbology.CODE32, Barcode.Symbology.CODE39, Barcode.Symbology.CODE93, Barcode.Symbology.DATA_MATRIX, Barcode.Symbology.DOTCODE, Barcode.Symbology.EAN13, Barcode.Symbology.EAN8, Barcode.Symbology.FIVE_DIGIT_ADD_ON, Barcode.Symbology.GS1_DATABAR, Barcode.Symbology.GS1_DATABAR_EXPANDED, Barcode.Symbology.GS1_DATABAR_LIMITED, Barcode.Symbology.IATA_2_OF_5, Barcode.Symbology.INTERLEAVED_2_OF_5, Barcode.Symbology.KIX, Barcode.Symbology.LAPA4SC, Barcode.Symbology.MATRIX_2_OF_5, Barcode.Symbology.MAXICODE, Barcode.Symbology.MICRO_PDF417, Barcode.Symbology.MICRO_QR, Barcode.Symbology.MSI_PLESSEY, Barcode.Symbology.PDF417, Barcode.Symbology.QR, Barcode.Symbology.MAXICODE, Barcode.Symbology.RM4SCC, Barcode.Symbology.TWO_DIGIT_ADD_ON, Barcode.Symbology.UPCA, Barcode.Symbology.UPCE, Barcode.Symbology.USPS_INTELLIGENT_MAIL],
            codeDuplicateFilter: 20000,
        });
    };
    // async componentDidMount(){
    //     const res = await _validateBarcode("0069596", "1");
    //     const parse = JSON.parse(res)
    //     this.setState({ validateBarcode: parse.data.validateBarcode.items[0] })
    // }
    onScanMethod = async (code) => {
        const { complainData } = this.props;
        console.log("tests1", code);
        console.log("complainData", complainData);
        // alert("code", code.barcodes[0].data);
        // this.barcodeValidate(complainData.orderData.orderId);
        // const res = await _validateBarcode(code.barcodes[0].data, "1");
        // const parse = JSON.parse(res)
        // alert('sss', code);
        // alert(code);
        // console.log("barcode Data ", code);
        // this.barcodeValidate(code.barcodes[0].data, complainData.orderData.orderId)
        this.barcodeValidate(code, complainData.orderData.orderId)
        // console.log(parse.data.validateBarcode.items[0])
        // this.setState({ barcodeNumber: code.barcodes[0].data, validateBarcode: parse.data.validateBarcode.items[0] })
    }
    // getSingleImageModeSettings = () => {
    //   return {
    //     desktop: {
    //       usageStrategy: SingleImageModeSettings.UsageStrategy.FALLBACK,
    //     },
    //     mobile: {
    //       usageStrategy: SingleImageModeSettings.UsageStrategy.FALLBACK,
    //     },
    //   };
    // };
    render() {
        return (
            <>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <h1>auto scan the barcode...</h1>
                <button onClick={() => this.onScanMethod("000023980XSMul00000ZWP1P2063")}>Click for Verified Barcode</button>
                <br />
                <br />
                <br />
                <button onClick={() => this.onScanMethod("0000239800SMul00000ZWP1P2063")}>Click for Unverified Barcode</button>
                <br />
                <br />
                <br />
                <button onClick={() => this.onScanMethod("000023980XLMul00000ZWP1P2063")}>Click for varified Barcode from sibtein bhai</button>
                <br />
                <br />
                <br />
                <button onClick={() => { }}>Click for</button>
            </>
            // <div className="scanTopSec">
            //     {/* <h3>Scan the Price tag</h3> */}
            //     {/* <h4>Please scan the barcode placed on the price tag on the your item.</h4> */}
            //     <p className="deliveryLocationPara">Please scan the barcode placed on the price tag on the your item.<br /><span onClick={() => this.setState({ ...this.state, isOpen: true })} className="locationDisable" > See How to Scan</span></p>
            //     {this.state.isOpen && (
            //         <Lightbox
            //             mainSrc={`${window.location.protocol + '//' + window.location.hostname + '/media/demo/scan-barcode-demo.gif'}`}
            //             onCloseRequest={() => this.setState({ ...this.state, isOpen: false })}
            //             enableZoom={false}
            //             imageTitle="See How to Scan"
            //         />
            //     )}
            //     <div className="scanSection">
            //         <ScanditBarcodeScanner
            //             licenseKey={licenseKey}
            //             engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build"
            //             preloadBlurryRecognition={true}
            //             preloadEngine={true}
            //             onReady={() => { }}
            //             onScan={(code) => this.onScanMethod(code)}
            //             onScanError={(err) => {
            //                 console.log(err, "err scandit")
            //             }}
            //             // onSubmitFrame={(submit) => alert(`${JSON.stringify(submit)} this is the submit `)}
            //             // onProcessFrame={(onProcessFrame) => alert(`${JSON.stringify(onProcessFrame)} this is the onProcessFrame `)}
            //             scanSettings={this.getScanSettings()}
            //             accessCamera={true}
            //             enableCameraSwitcher={true}
            //             enablePinchToZoom={true}
            //             enableTapToFocus={true}
            //             enableTorchToggle={true}
            //             // guiStyle={BarcodePicker.GuiStyle.VIEWFINDER}
            //             guiStyle={BarcodePicker.GuiStyle.LASER}
            //             laserArea={{ x: 0, y: 0, width: 1, height: 1 }}
            //             playSoundOnScan={true}
            //             vibrateOnScan={true}
            //             videoFit={BarcodePicker.ObjectFit.CONTAIN}
            //             visible={true}
            //             targetScanningFPS={30}
            //             zoom={0}
            //             viewfinderArea={{ x: 0, y: 0, width: 1, height: 0 }}
            //             cameraType={Camera.Type.BACK}
            //         // singleImageModeSettings={this.getSingleImageModeSettings()}
            //         />
            //     </div>
            //     <br />
            //     <br />
            //     <br />
            //     <h5>{this.state.barcodeNumber ? "Barcode  Number is :" + this.state.barcodeNumber : "Testing barcodes"}</h5>
            //     <h5>{this.state.validateBarcode ? "validateBarcode response is :" + JSON.stringify(this.state.validateBarcode) : "validateBarcode"}</h5>
            // </div>
        );
    }
}

export default SampleQRCode;
