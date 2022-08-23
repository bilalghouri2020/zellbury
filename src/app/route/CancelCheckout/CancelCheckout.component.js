import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import CmsBlock from 'Component/CmsBlock';
import ContentWrapper from 'Component/ContentWrapper';
import BrowserDatabase from 'Util/BrowserDatabase';
import './CancelCheckout.style';
import { formatCurrency } from 'Util/Price';
import Image from 'Component/Image';
import { fetchQuery } from 'Util/Request';
import OrderQuery from 'Query/Order.query';
import { showNotification } from 'Store/Notification/Notification.action';
import history from 'Util/History';
import checkoutSuccess from "../../../../media/double-tick.png";
import Loader from 'Component/Loader';

export class CancelCheckout extends PureComponent {
    static propTypes = {
        onSignIn: PropTypes.func.isRequired,
    };
    state={
        orderID:'',
        order:{}
    }
    callController() {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let url = `${window.location.origin}/customcheckout/index?data=${window.location.search.replace('?data=', '')}`;
        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);
                history.push(`/order/status/${data.data.placeOrder.order.order_id}/`)
            }).catch(error => console.log(error));
    }
    componentDidMount() {
        this.callController()
    }

    render() {
        return (
            <main block="CustomerCheckout">
                <ContentWrapper
                    wrapperMix={{ block: 'Checkout', elem: 'WrapperCenter' }}
                    label={__('Checkout page')}
                >
                   <Loader isLoading={true} />
                    {/* <div block="Checkout" elem="Step">
                        <h1>Order Cancelled</h1>
                    </div> */}
                   
                </ContentWrapper>
            </main>
        );
    }
}
export default CancelCheckout;
