import { Component, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Client } from '../../models/types';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ClientModalComponent } from '../../components/client-modal/client-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    FontAwesomeModule,
    PageHeaderComponent,
    ClientModalComponent,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  clients = signal<Client[]>([]);
  loading = signal(false);

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  modalOpen = false;
  editingClient: Client | null = null;

  deleteDialogOpen = false;
  clientToDelete: Client | null = null;

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadClients(); }

  loadClients() {
    this.loading.set(true);
    this.api.getClients(0, 100).subscribe({
      next: (res) => { this.clients.set(res.content); this.loading.set(false); },
      error: () => { this.toast.error('Erro ao carregar clientes.'); this.loading.set(false); }
    });
  }

  openCreate() { this.editingClient = null; this.modalOpen = true; }
  openEdit(client: Client) { this.editingClient = client; this.modalOpen = true; }
  openDelete(client: Client) { this.clientToDelete = client; this.deleteDialogOpen = true; }

  onSave(data: { name: string }) {
    if (this.editingClient) {
      this.api.updateClient(this.editingClient.id, data).subscribe({
        next: () => { this.toast.success('Cliente atualizado!'); this.loadClients(); },
        error: (err) => this.toast.error(this.clientErrorMessage(err, 'atualizar'))
      });
    } else {
      this.api.createClient(data).subscribe({
        next: () => { this.toast.success('Cliente criado!'); this.loadClients(); },
        error: (err) => this.toast.error(this.clientErrorMessage(err, 'criar'))
      });
    }
  }

  onConfirmDelete() {
    if (this.clientToDelete) {
      this.api.deleteClient(this.clientToDelete.id).subscribe({
        next: () => { this.toast.success('Cliente excluído!'); this.loadClients(); },
        error: (err) => {
          const msg = err?.error?.error;
          this.toast.error(msg?.includes('projetos') ? msg : 'Erro ao excluir cliente.');
        }
      });
      this.clientToDelete = null;
    }
  }

  private clientErrorMessage(err: { status?: number; error?: { error?: string } }, action: string): string {
    if (err?.status === 404) {
      return 'API de clientes não encontrada. Reinicie o backend com a versão mais recente.';
    }
    const message = err?.error?.error;
    if (message) return message;
    return `Erro ao ${action} cliente.`;
  }
}
