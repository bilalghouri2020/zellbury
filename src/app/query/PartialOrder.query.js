import { httpsRequest } from "../util/Request/graphQl"

const _getPartialOrder = async (orderId,token) => {
    try {
        return await httpsRequest({
            cookie: true,
            auth:true,
            token,
            query: `\n{\n  getPartialOrderById(ids: \"${orderId}\") {\n    items {\n      base_order_info {\n          id\n          total_qty_ordered\n          increment_id\n          created_at\n          status\n          redeempoints\n         cashback\n         apistatus\n         estimated_delivery\n          status_label\n          grand_total\n          sub_total\n      }   \n      payment_info {\n          additional_information{\n              method_title\n          }\n          method\n      }\n      shipping_info{\n        shipping_method\n        tracking_numbers\n        shipping_description\n        shipping_amount\n        shipping_address {\n            city \n            country_id \n            firstname\n            lastname\n            street\n            telephone\n        }\n      }\n      order_products{\n          id\n          name\n          short_description{ html }\n          sku\n          qty\n          row_total\n          original_price\n          license_key\n          thumbnail{url}\n          attributes{ attribute_value}\n      }\n    }\n  }\n}`,
        })
    } catch (error) {
        console.log(error.message)
    }
}

export {
    _getPartialOrder
}