import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);
  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required })
  })

  onSubmit(): void {

    if(this.form.invalid || this.isLoading() ){
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (token) => { 
        this.isLoading.set(true);
        console.log("Успешный вход", token); 
        this.router.navigate(['/']);
      },
      error: (err) => { 
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 401
          ? 'Неверный логин или пароль'
          : 'Что-то пошло не так - попробуйте пожалуйста позже'
        ); 
      }
    })

  }

}
