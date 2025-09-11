import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-confirm-email',
  imports: [RouterModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  userId: string | null = null;
  token: string | null = null;
  loading = false;
  success = false;
  errorMessage = '';

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.token) {
      this.token = decodeURIComponent(this.token);
    }

    if (this.userId && this.token) {
      this.loading = true;

      this.authService.confirmEmail(this.userId, this.token).subscribe({
        next: () => {
          console.log('Email confirmed successfully');
          this.loading = false;
          this.success = true;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); 
        },
        error: (err) => {
          console.error('Email confirmation failed', err);
          this.loading = false;
          this.errorMessage = 'Щось пішло не так. Спробуйте будь ласка пізніше';
        }
      });
    } else {
      console.error('Missing userId or token in query params');
      this.errorMessage = 'Неправильне посилання для підтвердження електронної пошти';
    }
  }
}
