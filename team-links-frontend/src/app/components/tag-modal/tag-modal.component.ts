import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../models/types';

@Component({
  selector: 'app-tag-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (open) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-box" (click)="$event.stopPropagation()">

          <div class="modal-header">
            <h2>{{ tag ? 'Editar Tag' : 'Nova Tag' }}</h2>
          </div>

          <form class="modal-body" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">
                Nome <span class="required">*</span>
              </label>
              <input
                class="form-input"
                [(ngModel)]="name"
                name="name"
                placeholder="Nome da tag"
                required
              />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="close()">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Salvar
              </button>
            </div>
          </form>

        </div>
      </div>
    }
  `,
})
export class TagModalComponent implements OnChanges {
  @Input() open = false;
  @Input() tag: Tag | null = null;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ name: string }>();

  name = '';

  ngOnChanges() {
    if (this.open) this.name = this.tag?.name ?? '';
  }

  close() { this.openChange.emit(false); }

  onSubmit() {
    if (!this.name.trim()) return;
    this.save.emit({ name: this.name.trim() });
    this.close();
  }
}