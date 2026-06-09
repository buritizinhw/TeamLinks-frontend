import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../../models/types';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    PageHeaderComponent,
    ProjectCardComponent,
    ProjectModalComponent,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  search = '';

  faPlus = faPlus;
  faSearch = faSearch;

  modalOpen = false;
  editingProject: Project | null = null;

  deleteDialogOpen = false;
  projectToDelete: Project | null = null;

  constructor(
    private data: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.data.projects$.subscribe(p => this.projects = p);
  }

  get filtered() {
    const q = this.search.toLowerCase();
    return this.projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  openCreate() { this.editingProject = null; this.modalOpen = true; }
  openEdit(p: Project) { this.editingProject = p; this.modalOpen = true; }
  openDelete(p: Project) { this.projectToDelete = p; this.deleteDialogOpen = true; }

  onSave(data: { name: string; description: string }) {
    if (this.editingProject) {
      this.data.updateProject(this.editingProject.id, data);
      this.toast.success('Projeto atualizado com sucesso!');
    } else {
      this.data.createProject(data);
      this.toast.success('Projeto criado com sucesso!');
    }
  }

  onConfirmDelete() {
    if (this.projectToDelete) {
      this.data.deleteProject(this.projectToDelete.id);
      this.toast.success('Projeto excluído com sucesso!');
      this.projectToDelete = null;
    }
  }
}