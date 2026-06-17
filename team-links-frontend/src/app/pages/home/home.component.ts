import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Project, Tag } from '../../models/types';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { guessName, normalizeUrl } from '../../utils/url.util';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, ThemeToggleComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  urlInput = '';
  showCard = false;
  saving = signal(false);

  name = '';
  url = '';
  description = '';
  selectedProjectId: number | null = null;
  selectedTagNames: string[] = [];
  tagMenuOpen = false;

  projects = signal<Project[]>([]);
  tags = signal<Tag[]>([]);

  faLink = faLink;
  faCheck = faCheck;
  faTimes = faTimes;

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.api.getProjects(0, 100).subscribe({
      next: (res) => {
        this.projects.set(res.content);
        this.selectedProjectId = res.content[0]?.id ?? null;
      },
      error: () => this.toast.error('Erro ao carregar projetos.')
    });

    this.api.getTags().subscribe({
      next: (res) => this.tags.set(res.content),
      error: () => this.toast.error('Erro ao carregar tags.')
    });
  }

  onSubmitUrl() {
    const trimmed = this.urlInput.trim();
    if (!trimmed) return;

    this.url = normalizeUrl(trimmed);
    this.name = guessName(this.url);
    this.description = '';
    this.selectedTagNames = [];
    this.tagMenuOpen = false;
    this.showCard = true;
  }

  cancelCard() {
    this.showCard = false;
    this.urlInput = '';
  }

  toggleTagMenu() { this.tagMenuOpen = !this.tagMenuOpen; }

  toggleTag(tagName: string) {
    this.selectedTagNames = this.selectedTagNames.includes(tagName)
      ? this.selectedTagNames.filter(n => n !== tagName)
      : [...this.selectedTagNames, tagName];
  }

  isSelected(tagName: string) { return this.selectedTagNames.includes(tagName); }

  removeTag(tagName: string) {
    this.selectedTagNames = this.selectedTagNames.filter(n => n !== tagName);
  }

  get triggerLabel() {
    return this.selectedTagNames.length
      ? `${this.selectedTagNames.length} tag(s) selecionada(s)`
      : '';
  }

  saveLink() {
    if (!this.name.trim() || !this.url.trim() || !this.selectedProjectId) return;

    this.saving.set(true);
    this.api.createLink(this.selectedProjectId, {
      name: this.name.trim(),
      url: this.url.trim(),
      description: this.description.trim(),
      tagNames: this.selectedTagNames,
    }).subscribe({
      next: (link) => {
        this.toast.success('Link salvo!');
        this.saving.set(false);
        this.showCard = false;
        this.urlInput = '';
        if (link.shortUrl) {
          navigator.clipboard?.writeText(link.shortUrl).catch(() => {});
        }
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err?.error?.error;
        if (msg?.includes('Tag') && msg.includes('não encontrada')) {
          this.toast.error('Uma ou mais tags não existem. Crie-as na página Tags.');
        } else {
          this.toast.error('Erro ao salvar link.');
        }
      }
    });
  }
}
