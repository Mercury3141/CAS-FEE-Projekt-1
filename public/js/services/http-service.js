const httpService = {
    async ajax(method, url, data) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
};

export default httpService;












/*
import { valueStorage } from './value-storage.js'

const tokenKey = "token";

class HttpService {
    ajax(method, url, data, headers) {
        const fetchHeaders = new Headers({'content-type': 'application/json', ...(headers || {})});

        if(valueStorage.getItem(tokenKey)){
            fetchHeaders.append("authorization", "Bearer "+ valueStorage.getItem(tokenKey))
        }

        return fetch(url, {
            method: method,
            headers: fetchHeaders, body: JSON.stringify(data)
        }).then(x => {
            return x.json();
        });
    }

    setAuthToken(token){
        valueStorage.setItem(tokenKey, token);
    }

    hasAuthToken(){
        return Boolean(valueStorage.getItem(tokenKey))
    }

    removeAuthToken(token){
        valueStorage.removeItem(tokenKey, undefined);
    }

}

export const httpService = new HttpService();*/
