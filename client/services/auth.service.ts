const url:string = "/api/user";
import {HttpClient} from './';


class AuthService {
    postLogin = async (object:Object): Promise<any> => {
        return await HttpClient.post(url + "/login", object, {});
    }
    postRegister = async (object:Object): Promise<any> => {
        return await HttpClient.post(url + "/register", object, {});
    }
    getData = async (token:string): Promise<any> => {
        return await HttpClient.get(url + "/data", "", {"token": token});
    }
    putData = async (object:Object, token:string): Promise<any> => {
        return await HttpClient.put(url + "/data", object, {"token": token});
    }
    getUserData = async (id:string, token:string): Promise<any> => {
        return await HttpClient.get(url + "/data/" + id, "", {"token": token});
    }
    getFollowers = async (id:string, token:string): Promise<any> => {
        return await HttpClient.get(url + "/data/followers/" + id, "", {"token": token});
    }
    getFollowing = async (id:string, token:string): Promise<any> => {
        return await HttpClient.get(url + "/data/following/" + id, "", {"token": token});
    }
    putFollow = async (id:string, token:string): Promise<any> => {
        return await HttpClient.put(url + "/follow/" + id, {}, {"token": token});
    }
    deleteFollow = async (id:string, token:string): Promise<any> => {
        return await HttpClient.delete(url + "/follow/" + id, {}, {"token": token});
    }
}

export default AuthService;