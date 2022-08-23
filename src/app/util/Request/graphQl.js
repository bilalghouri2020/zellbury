export const httpsRequest = async ({ auth = false, query, method = "POST", cookie = false , token}) => {
    try {
        const myHeaders = new Headers();
        auth && myHeaders.append("Authorization", `Bearer ${token || '4bndenqr0v1r62qox28s60lir7911tzt'}`);
        cookie && myHeaders.append("Cookie", "PHPSESSID=5kvvhds8t7epustksqjvliigjb; mage-messages=%5B%7B%22type%22%3A%22error%22%2C%22text%22%3A%22Invalid+Form+Key.+Please+refresh+the+page.%22%7D%2C%7B%22type%22%3A%22error%22%2C%22text%22%3A%22Invalid+Form+Key.+Please+refresh+the+page.%22%7D%2C%7B%22type%22%3A%22error%22%2C%22text%22%3A%22Invalid+Form+Key.+Please+refresh+the+page.%22%7D%5D; private_content_version=283288bf38d5796f7ca813106c390dfe");
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: method,
            headers: myHeaders,
            body: JSON.stringify({ query }),
            redirect: 'follow'
        };

        const response = await fetch(`${window.location.origin}/graphql`, requestOptions)
        return response.text()
    } catch (error) {
        console.log(error.message)
    }
}