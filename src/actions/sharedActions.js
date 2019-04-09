import * as api from '../../tools/apiConfig';
import axios from 'axios';

export async function isValidToken() {
    
    const token = localStorage.getItem('token');
    if (token) {
        let res = await axios.post(api.IS_TOKEN_VALID, { bearerToken: token });
        if (res.data.code == 200) {
            return true;
        }
        else {
            toastr.error(res.data.message);
            return false;
        }
    }
    else {
        return false;
    }
}





