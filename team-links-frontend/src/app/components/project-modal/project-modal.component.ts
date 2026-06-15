import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Project, ProjectStatus, PROJECT_STATUS_OPTIONS } from '../../models/types';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './project-modal.component.html',
})
export class ProjectModalComponent implements OnChanges {
  @Input() open = false;
  @Input() project: Project | null = null;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ name: string; description: string; status: ProjectStatus }>();

  faSave = faSave;
  faTimes = faTimes;
  statusOptions = PROJECT_STATUS_OPTIONS;

  name = '';
  description = '';
  status: ProjectStatus = 'INICIAR';

  ngOnChanges() {
    if (this.open) {
      this.name = this.project?.name ?? '';
      this.description = this.project?.description ?? '';
      this.status = this.project?.status ?? 'INICIAR';
    }
  }

  close() { this.openChange.emit(false); }

  onSubmit() {
    if (!this.name.trim()) return;
    this.save.emit({
      name: this.name.trim(),
      description: this.description.trim(),
      status: this.status,
    });
    this.close();
  }
}
