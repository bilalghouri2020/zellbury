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

import OrderQuery from 'Query/Order.query';
import { showNotification } from 'Store/Notification/Notification.action';
import { getOrderList } from 'Store/Order/Order.action';
import { fetchQuery } from 'Util/Request';

export class OrderDispatcher {

    requestOrders(dispatch) {
        const query = OrderQuery.getOrderListQuery();
        // return fetchQuery(query).then(
        //     ({ getOrderList: orders }) => {
        //         dispatch(getOrderList(orders, false));
        //     },
        //     (error) => dispatch(showNotification('error', error[0].message))
        // );
        let token = JSON.parse(localStorage.getItem('auth_token'));
        let UserToken = '';
        if (token && token.data) {
            UserToken = token.data;
        }
        var requestOptions = { method: 'GET' };
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${UserToken}`);
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ "query": `query  {customerPlacedOrder(customer_token: "${UserToken}") { items{  id, increment_id, created_at, status_label, grand_total,created_at,delivery_date , estimated_delivery } } }` });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
        return fetch(`${window.location.origin}/graphql`, requestOptions)
            .then(response => response.text())
            .then(res => {
                let Items = JSON.parse(res).data.customerPlacedOrder;
                if (Items.items) {
                    let ordersItems = Items.items.map(x => {
                        return { base_order_info: x };
                    });
                    let orders = { items: ordersItems };
                    dispatch(getOrderList(orders, false));
                }
                else {
                    dispatch(getOrderList([], false));
                }


            })
            .catch(error => console.log('error', error));
    }
}

export default new OrderDispatcher();
