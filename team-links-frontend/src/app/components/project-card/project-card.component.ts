import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLink, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../../models/types';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  faLink = faLink;
  faPencil = faPencil;
  faTrash = faTrash;

  menuOpen = false;

  toggleMenu(e: Event) {
    e.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() { this.menuOpen = false; }
  onEdit()    { this.edit.emit(this.project); this.menuOpen = false; }
  onDelete()  { this.delete.emit(this.project); this.menuOpen = false; }
}
