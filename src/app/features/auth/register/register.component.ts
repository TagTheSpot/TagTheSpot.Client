import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  auth = inject(AuthService);
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
  })

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    
    const { email, password } = this.form.getRawValue();

    this.auth.register(email, password).subscribe({
      next: () => {
        this.router.navigate(['login']);
      },
      error: () => {
        this.errorMessage = 'Електронна пошта вже зайнята. Будь ласка, введіть іншу.';
      }
    });
  }
}
