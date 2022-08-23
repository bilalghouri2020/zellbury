import { httpsRequest } from "../util/Request/graphQl"

const _getLoyaltyPoints = async (id) => {
    try {
        return await httpsRequest({
            auth: true,
            query: `{\n  getRedeemedPoints(orderid: ${id}) {\n      redeempoints\n    	cashback\n  }\n}`,
        })
    } catch (error) {
        console.log(error.message)
    }
}

const _getCustomerLoyaltyPoints = async (token) => {
    try {
        return await httpsRequest({
            cookie: true,
            query: `{\n  getCustomeLoyaltyPoints(customer_token: \"${token}\") {\n      customerCode\n      customerName\n      mobile\n      pointsEarned\n      pointsRedeem\n      pointsAvailable\n      cashbackpercent\n  apistatus\n  }\n}`,
        })
    } catch (error) {
        console.log(error.message)
    }
}

export {
    _getLoyaltyPoints,
    _getCustomerLoyaltyPoints
}