import { httpsRequest } from "../util/Request/graphQl"

const _validateBarcode = async (barcode, orderid) => {
    const token = JSON.parse(localStorage.getItem("auth_token"));
    try {
        return await httpsRequest({
            auth: true,
            // query: `{\n  validateBarcode(barcode: "${barcode}" orderId: "${orderid}") {\n    items {\n      status\n      message\n      data\n  product\n   }\n  }\n}`,
            query: `{\r\n  validateBarcode(barcode: "${barcode}",orderId:"${orderid}") {\r\n    items {\r\n      status\r\n      message\r\n      barcode_response\r\n    }\r\n    order{\r\n        order_id\r\n        phone_number\r\n        estimated_delivery\r\n        status\r\n        city\r\n        courier_name\r\n        tracking_information\r\n        first_name\r\n        address\r\n        grandtotal\r\n        source_name\r\n        source_id\r\n       tracking_details{\r\n            status\r\n            error\r\n            detailed_tracking{\r\n                Status\r\n                Activity_datetime\r\n            }\r\n        }\r\n    }\r\n    product{\r\n        order_barcode\r\n        sku\r\n        qty\r\n        collection\r\n        fabric\r\n        pieces\r\n        factory_outlet\r\n     discounted\r\n    }\r\n    user{\r\n        scanned_barcode\r\n        uploaded_picture\r\n    }\r\n    customer{\r\n        completed_orders\r\n        undelivered_orders\r\n        closed_undelivered_orders\r\n    }\r\n  }\r\n}\r\n `,
            token: token.data
        })
    } catch (error) {
        console.log(error.message)
    }
}

export {
    _validateBarcode
}