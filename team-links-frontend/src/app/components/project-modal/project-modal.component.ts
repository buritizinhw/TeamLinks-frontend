import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/types';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-modal.component.html',
})
export class ProjectModalComponent implements OnChanges {
  @Input() open = false;
  @Input() project: Project | null = null;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ name: string; description: string }>();

  name = '';
  description = '';

  ngOnChanges() {
    if (this.open) {
      this.name = this.project?.name ?? '';
      this.description = this.project?.description ?? '';
    }
  }

  close() { this.openChange.emit(false); }

  onSubmit() {
    if (!this.name.trim()) return;
    this.save.emit({ name: this.name.trim(), description: this.description.trim() });
    this.close();
  }
}