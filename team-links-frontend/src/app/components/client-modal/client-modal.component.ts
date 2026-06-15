import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Client } from '../../models/types';

@Component({
  selector: 'app-client-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
  template: `
    @if (open) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ client ? 'Editar Cliente' : 'Novo Cliente' }}</h2>
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
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="close()">
                <fa-icon [icon]="faTimes"></fa-icon> Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                <fa-icon [icon]="faSave"></fa-icon> Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class ClientModalComponent implements OnChanges {
  @Input() open = false;
  @Input() client: Client | null = null;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ name: string }>();

  faSave = faSave;
  faTimes = faTimes;
  name = '';

  ngOnChanges() {
    if (this.open) this.name = this.client?.name ?? '';
  }

  close() { this.openChange.emit(false); }

  onSubmit() {
    if (!this.name.trim()) return;
    this.save.emit({ name: this.name.trim() });
    this.close();
  }
}
