import axios from 'axios';

export const getRequest = (url, params = {}) => {
    return axios(
        {
            method: 'get',
            url: url,
            params: params
        }
    );
}