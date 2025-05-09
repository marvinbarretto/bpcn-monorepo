import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../data-access/auth.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authStore = inject(AuthStore);
  identifier!: string;
  password!: string;

  // TODO: Sort out error handling
  onLogin() {
    if (this.identifier && this.password) {
      this.authStore.login(this.identifier, this.password);
    }
  }
}
