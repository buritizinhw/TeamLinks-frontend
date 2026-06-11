import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from './components/sidebar-nav/sidebar-nav.component';
import { ThemeService } from './services/theme.service';
import { ToastService, Toast } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  toasts = signal<Toast[]>([]);

  constructor(
    public theme: ThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(t => this.toasts.set(t));
  }
}