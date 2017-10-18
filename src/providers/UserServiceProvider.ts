import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserServiceProvider {
  API_URL: string = 'http://ajanvi.com/ws/index.php?auth=80RktwTdG9Aq7T';

  constructor(public http: Http) {

  }

  signUpUser(post_params?: any, options?: RequestOptions) {
    let api_url = this.API_URL;
    for (let i = 0; i < post_params.length; i++) {
      api_url += "&" + post_params[i].key + '=' + post_params[i].value;
    }

    console.log(api_url);
    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get(api_url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch (e) {
            reject(err);
          }
        });
    });
  }

  login(email?: any, password?: any, options?: RequestOptions) {
    let api_url = this.API_URL + "&action=login&email=" + email +"&pass=" + password;

    if (!options) {
      options = new RequestOptions();
    }

    return new Promise((resolve, reject) => {
      this.http.get(api_url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          try {
            resolve(err.json());
          } catch (e) {
            reject(err);
          }
        });
    });
  }
}
