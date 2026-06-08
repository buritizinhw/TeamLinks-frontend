import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent {
  navItems = [
    { href: '/projects', label: 'Projects', icon: '📁' },
    { href: '/tags',     label: 'Tags',     icon: '🏷️' },
  ];
}