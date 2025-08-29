import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSource = new BehaviorSubject<string | null>(null);
  message$ = this.messageSource.asObservable();

  show(message: string, duration = 3000) {
    this.messageSource.next(message);

    setTimeout(() => {
      this.messageSource.next(null);
    }, duration);
  }
}
