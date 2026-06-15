import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Project, Client } from '../../models/types';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './project-modal.component.html',
})
export class ProjectModalComponent implements OnChanges {
  @Input() open = false;
  @Input() project: Project | null = null;
  @Input() clients: Client[] = [];
  @Output() openChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ name: string; description: string; clientId: number }>();

  faSave = faSave;
  faTimes = faTimes;

  name = '';
  description = '';
  clientId: number | null = null;

  ngOnChanges() {
    if (this.open) {
      this.name = this.project?.name ?? '';
      this.description = this.project?.description ?? '';
      this.clientId = this.project?.clientId ?? this.clients[0]?.id ?? null;
    }
  }

  close() { this.openChange.emit(false); }

  onSubmit() {
    if (!this.name.trim() || !this.clientId) return;
    this.save.emit({
      name: this.name.trim(),
      description: this.description.trim(),
      clientId: this.clientId,
    });
    this.close();
  }
}
