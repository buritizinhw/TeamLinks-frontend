import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  template: `
    @if (open) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-box" style="text-align:center" (click)="$event.stopPropagation()">

          <div class="delete-icon-circle">
            🗑️
          </div>

          <div class="modal-header">
            <h2>{{ title }}</h2>
          </div>

          <p style="margin:0;font-size:14px;color:var(--text-secondary)">
            {{ description }}
          </p>

          <div class="modal-footer" style="justify-content:center">
            <button class="btn btn-secondary" (click)="close()">
              Cancelar
            </button>
            <button class="btn btn-danger" (click)="onConfirm()">
              Excluir
            </button>
          </div>

        </div>
      </div>
    }
  `,
})
export class ConfirmDeleteDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmar exclusão';
  @Input() description = 'Tem certeza? Esta ação não pode ser desfeita.';
  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();

  close() { this.openChange.emit(false); }
  onConfirm() { this.confirm.emit(); this.close(); }
}