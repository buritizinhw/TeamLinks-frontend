import { Component, Input } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <header class="page-header">
      <div class="page-header-left">
        <ng-content select="[breadcrumb]"></ng-content>
        <h1>{{ title }}</h1>
      </div>
      <div class="page-header-right">
        <ng-content select="[action]"></ng-content>
        <app-theme-toggle></app-theme-toggle>
      </div>
    </header>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
}