
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import isMobile from 'Util/Mobile';
import OrderStatusStepper from './OrderStatusStepper.component';


export const mapStateToProps = (state) => ({
    
});

export const mapDispatchToProps = (dispatch) => ({
   
});

export class OrderStatusStepperContainer extends PureComponent {
   
    componentDidMount() {
        //this.requestTrackingDetails('7001016969');
    }
    
    constructor(props) {
         super(props);
        // this.state = {
        //     packet_list:{},
        //     TrackingDetail:[]
        // };
    }
    // requestTrackingDetails(orderNumber) {
    //     var requestOptions = { method: 'GET' };
    //     fetch(`${window.location.origin}/trackingdetails?OrderId=${orderNumber}`, requestOptions)
    //         .then(response => response.text())
    //         .then(result => {
    //             let data = JSON.parse(result);
    //             this.setState({packet_list:data.packet_list[0]});
    //             this.setState({TrackingDetail:data.packet_list[0]["Tracking Detail"]});
    //         }).catch(error => console.log(error));
    // }
    render() {
        return (
            <OrderStatusStepper  
            { ...this.props }
            { ...this.state }/>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatusStepperContainer);