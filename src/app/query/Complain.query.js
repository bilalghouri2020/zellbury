import { httpsRequest } from "../util/Request/graphQl"

const token = JSON.parse(localStorage.getItem("auth_token"));

const _customerOrders = async () => {
    try {
        return await httpsRequest({
            auth: true,
            query: `{\r\n    customerPlacedOrder(customer_token: "${token.data}")\r\n     { items{\r\n           id, increment_id, created_at, status_label, grand_total,created_at,delivery_date , estimated_delivery \r\n           }\r\n    } \r\n}`
            // query: `{\n  customerPlacedOrder(customer_token: "ysmfjwr9b79lrhlfn4yf1tvzqmq6ikw0) {\n    items {\nid,\nincrement_id,\ncreated_at,\nstatus_label,\ngrand_total,\ndelivery_date,\nestimated_delivery}}\n}`
        })
    } catch (error) {
        console.log(error.message)
    }
}


const _cancelOrder = async (orderid) => {
    try {
        return await httpsRequest({
            auth: true,
            query: `{\r\n  cancelOrder(customer_token: "${token.data}",orderId:\"${orderid}\") {\r\n    items {\r\n      id\r\n      status\r\n    }\r\n  }\r\n}\r\n `
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _orderDetailById = async (orderid) => {
    try {
        return await httpsRequest({
            auth: true,
            query: ` {getOrderById(id:${orderid}){ base_order_info{ id, increment_id, created_at, status_label, grand_total, sub_total,total_qty_ordered,redeempoints,cashback,apistatus,estimated_delivery}, payment_info{ method, additional_information{ bank, method_title, credit_type, month, customer_info{ first_name, last_name, phone } } }, shipping_info{ shipping_method, shipping_description, shipping_amount, tracking_numbers, shipping_address{ city, company, firstname, lastname, middlename, telephone, district, house_number, apartment_number, postomat_code, store_pickup_code, post_office_code, postcode, street, is_b2b, region, organizationname, organizationbin, organizationaddress, organizationiic, organizationbik } }, order_products{ id, name, short_description{ html }, sku, qty, row_total, original_price, license_key, thumbnail{ url, label, path }, small_image{ url, label, path }, attributes{ attribute_value, attribute_code, attribute_type, attribute_label, attribute_options{ label, value, swatch_data{ value } } } } }}`,
            token: token.data
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _storesList = async (city, currentData, lat, lng) => {
    try {
        return await httpsRequest({
            auth: true,
            query: `{\r\n    storeLocationList(city:"${city}", current_date: "${currentData}",lat:"${lat}",lng:"${lng}") {\r\n    store_code\r\n    store_name\r\n    store_distance\r\n    open_time\r\n        is_fot\r\n    close_time\r\n    message\r\n    day\r\n}\r\n}`,
            token: token.data
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _storesListCheck = async (city, currentData, lat, lng) => {
    try {
        return await httpsRequest({
            auth: true,
            query: `{\r\n    storeLocationList(city:"${city}", current_date: "${currentData}",lat:"${lat}",lng:"${lng}") {\r\n    store_name\r\n}\r\n}`,
            token: token.data
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _storeByID = async (code) => {
    try {
        return await httpsRequest({
            auth: true,
            query: `{\r\n    storeLocationDetails(store_code: \"${code}") {\r\n        location_details{\r\n                store_name\r\n                store_city\r\n                is_fot\r\n                is_live\r\n                store_address\r\n                store_phone\r\n                latitude\r\n                longitude\r\n                zone\r\n                mon_open\r\n                mon_close\r\n                tue_open\r\n                tue_close\r\n                wed_open\r\n                wed_close\r\n                thu_open\r\n                thu_close\r\n                fri_open\r\n                fri_close\r\n                sat_open\r\n                sat_close\r\n                sun_open\r\n                sun_close\r\n           }\r\n    } \r\n}`,
            token: token.data
        })
    } catch (error) {
        console.log(error.message)
    }
}



export {
    _customerOrders, _cancelOrder, _orderDetailById, _storesList, _storeByID, _storesListCheck
}

// {
//     customerPlacedOrder(customer_token: "ysmfjwr9b79lrhlfn4yf1tvzqmq6ikw0")
//      { items{
//            id, increment_id, created_at, status_label, grand_total,created_at,delivery_date , estimated_delivery 
//            }
//     } 
// }