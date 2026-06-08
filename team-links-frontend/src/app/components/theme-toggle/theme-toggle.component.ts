import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button class="btn btn-ghost btn-icon" (click)="theme.toggle()" title="Alternar tema">
      {{ theme.isDark ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggleComponent {
  constructor(public theme: ThemeService) {}
}