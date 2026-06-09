import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <button class="btn btn-ghost btn-icon" (click)="theme.toggle()" title="Alternar tema">
      <fa-icon [icon]="theme.isDark ? faSun : faMoon"></fa-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  faSun = faSun;
  faMoon = faMoon;

  constructor(public theme: ThemeService) {}
}