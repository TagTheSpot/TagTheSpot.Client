import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute); 
  errorMessage: string | null = null;
  returnUrl: string | null = null;

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

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.form.valueChanges.subscribe(() => {
      this.errorMessage = '';
    })
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.router.navigateByUrl(this.returnUrl || '/');

        this.authService.storeTokens(
          res.accessToken, res.refreshToken);
      },
      error: (res) => {
        if (res.error.detail == 'The provided credentials are invalid.') {
          this.errorMessage = 'Неправильна електронна пошта або пароль.';
        }
        else {
          this.errorMessage = 'Будь ласка, спробуйте пізніше.';
        }
      }
    });
  }
}
