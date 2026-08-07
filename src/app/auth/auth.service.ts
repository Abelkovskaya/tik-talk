import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenResponce } from './auth.interface';
import { tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  cookieService = inject(CookieService);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth(){

    if(!this.token){
      this.token = this.cookieService.get('token');
    }

    return !!this.token;
  }

  login(payload:{username:string, password:string}){

    const formData = new FormData();

    formData.append( 'username', payload.username);
    formData.append( 'password', payload.password );

    return this.http.post<TokenResponce>(
      `${this.baseApiUrl}auth/token`,
      formData
    ).pipe(
      tap( val => {
        this.token = val.access_token;
        this.refreshToken = val.refresh_token;
        this.cookieService.set('token', this.token);
        this.cookieService.set('refreshToken', this.refreshToken);
      })
    )
  }
}
