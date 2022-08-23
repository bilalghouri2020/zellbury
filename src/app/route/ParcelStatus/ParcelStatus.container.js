import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import {ParcelStatus} from './ParcelStatus.component'

export const OrderDispatcher = import(
    'Store/Order/Order.dispatcher'
);

export const mapStateToProps = (state) => ({
    orderList: state.OrderReducer.orderList,
    isLoading: state.OrderReducer.isLoading
});

export const mapDispatchToProps = (dispatch) => ({
    getOrderList: () => OrderDispatcher.then(
        ({ default: dispatcher }) => dispatcher.requestOrders(dispatch)
    )
});

export class ParcelStatusContainer extends PureComponent {
    static propTypes = {
        getOrderList: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { getOrderList } = this.props;
        getOrderList();
    }

    render() {
        return (
            <ParcelStatus
                {...this.props}
            />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ParcelStatusContainer);