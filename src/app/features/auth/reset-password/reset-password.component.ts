import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email!: string;
  token!: string;

  message: string | null = null;
  errorMessage: string | null = null;

  form = new FormGroup({
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
    }),
  },
  {
    validators: (group) => {
      const password = group.get('password');
      const confirm = group.get('confirmPassword');

      if (!password || !confirm) {
        return null;
      }

      if (password.invalid || confirm.invalid) {
        return null;
      } 

      return password.value === confirm.value ? null : { passwordMismatch: true };
    }
  });

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { password } = this.form.getRawValue();

    this.authService.resetPassword(this.email, this.token, password).subscribe({
      next: () => {
        this.message = 'Пароль успішно змінено! Через декілька секунд ви будете перенаправлені на сторінку входу.';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: () => {
        this.errorMessage = 'Не вдалося змінити пароль. Будь ласка, спробуйте пізніше.';
        this.message = null;
      },
    });
  }
}
