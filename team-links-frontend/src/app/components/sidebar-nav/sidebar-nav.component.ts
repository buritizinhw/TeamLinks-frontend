import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder, faTag, faUsers, faHouse } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent {
  faHouse = faHouse;
  faFolder = faFolder;
  faUsers = faUsers;
  faTag = faTag;

  navItems = [
    { href: '/',         label: 'Home',     icon: this.faHouse },
    { href: '/projects', label: 'Projects', icon: this.faFolder },
    { href: '/clients',  label: 'Clientes', icon: this.faUsers },
    { href: '/tags',     label: 'Tags',     icon: this.faTag },
  ];
}
