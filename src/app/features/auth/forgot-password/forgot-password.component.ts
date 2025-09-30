import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  
  message: string | null = null;
  errorMessage: string | null = null;
  
  form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
  });

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { email } = this.form.getRawValue();

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.message = 'На вашу електронну адресу надіслано посилання для відновлення пароля. Будь ласка, перевірте також папку «Спам».';
        this.errorMessage = null;
      },
      error: (err) => {
        if (err.error.detail == 'The user has not been found.') {
          this.errorMessage = 'Користувача з такою електронною адресою не знайдено.';
        } else if (err.error.detail == 'The email is not confirmed for this user.') {
          this.errorMessage = 'Електронна адреса не підтверджена. Будь ласка, підтвердіть електронну адресу перед скиданням пароля.';
        } else {
          this.errorMessage = 'Невідома помилка. Спробуйте пізніше.';
        }
        this.message = null;
      },
    });
  }
}
