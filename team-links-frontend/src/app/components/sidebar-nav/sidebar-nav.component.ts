import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder, faTag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent {
  faFolder = faFolder;
  faTag = faTag;

  navItems = [
    { href: '/projects', label: 'Projects', icon: this.faFolder },
    { href: '/tags',     label: 'Tags',     icon: this.faTag },
  ];
}