import { HttpInterceptorFn } from "@angular/common/http"
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export const AuthTokenInterceptor:HttpInterceptorFn = (request, next) => {

    const token = inject(AuthService).token;

    if(!token) return next(request);

    const newRequest = request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })

    return next(newRequest);

}