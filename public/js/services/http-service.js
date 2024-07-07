class HttpService {
    async ajax(method, url, data) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }

        console.log(`Making ${method} request to ${url} with data:`, data);

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}`, errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log(`Response from ${url}:`, responseData);
        return responseData;
    }
}

export default new HttpService();
