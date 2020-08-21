const url = "http://" + window.location.host + "/api/user";
import {HttpClient} from './';

class AuthService {
    postLogin = async (object) => {
        return await HttpClient.post(url + "/login", object);
    }
    postRegister = async (object) => {
        return await HttpClient.post(url + "/register", object);
    }
    getData = async (token) => {
        return await HttpClient.get(url + "/data", "", {"token": token})
    }
}

export default AuthService;