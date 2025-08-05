import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string | null = null; 

  protected form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]
    })
  });

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Невірна електронна пошта або пароль.';
      }
    });
  }
}
