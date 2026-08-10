import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenResponce } from './auth.interface';
import { catchError, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router);
  cookieService = inject(CookieService);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth(){

    if(!this.token){
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken')
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
      tap( val => this.saveTokens(val))
    )
  }

  refreshAuthToken(){
    return this.http.post<TokenResponce>(
      `${this.baseApiUrl}auth/refresh`,
      {refresh_token: this.refreshToken}
    ).pipe(
      tap(val => this.saveTokens(val)),
      catchError(error =>{
        this.logout();
        return throwError(() => error);
      })
    )
  }

  logout(){
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  saveTokens(res: TokenResponce){
        this.token = res.access_token;
        this.refreshToken = res.refresh_token;
        this.cookieService.set('token', this.token);
        this.cookieService.set('refreshToken', this.refreshToken);
  }

}
