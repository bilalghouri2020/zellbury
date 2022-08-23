import { fetchQuery } from 'Util/Request';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { isSignedIn } from 'Util/Auth';
import history from 'Util/History';
import isMobile from 'Util/Mobile';
import OrderStatusLeopards from './OrderStatusLeopards.component';
import OrderQuery from 'Query/Order.query';
import { showNotification } from 'Store/Notification/Notification.action';
import { getMessageFromStatus ,getExpectedDate} from 'Util/Order';
export const mapStateToProps = (state) => ({

});

export const mapDispatchToProps = (dispatch) => ({

});

export class OrderStatusLeopardsContainer extends PureComponent {
    setActiveStep() {
        const { order ,userName, customMessage,response_code} = this.props;
        if (order && order.base_order_info && order.base_order_info.status_label)
        {
            let oredrObject = getMessageFromStatus(order.base_order_info.status_label,userName,{customMessage,response_code})
            this.setState({title:oredrObject.title,message :oredrObject.message ,image:oredrObject.image});
        }
        if (order && order.base_order_info && order.base_order_info.status_label.toLowerCase() == 'confirmed') {
            // let oredrObject = getMessageFromStatus(order.base_order_info.status_label,userName)
        } else if (order && order.base_order_info && order.base_order_info.status_label.toLowerCase() == 'processing') {
            this.setState({ activeStep: 2});
        } else if (order && order.base_order_info && order.base_order_info.status_label.toLowerCase() == 'shipped') {
            this.setState({ activeStep: 3});
        } else if (order && order.base_order_info && order.base_order_info.status_label.toLowerCase() == 'complete') {
            this.setState({ activeStep: 4});
        }
        else {
            this.setState({ activeStep: -1 });
        }
    }
    componentDidMount() {
        
        this.setActiveStep();
        // this.requestOrderDetails(29326);
    }
    
    constructor(props) {
        super(props);
        this.state = {
            steps: ['Confirmed', 
            'Packed', 
            'Shipped', 
            'Delivered'],
            activeStep: -1
        };
    }
    render() {
        return (
            <OrderStatusLeopards
                {...this.props}
                {...this.state} />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatusLeopardsContainer);