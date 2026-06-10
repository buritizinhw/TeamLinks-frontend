import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link, Tag } from '../../models/types';

@Component({
  selector: 'app-link-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './link-modal.component.html',
})
export class LinkModalComponent implements OnChanges {
  @Input() open = false;
  @Input() link: Link | null = null;
  @Input() availableTags: Tag[] = [];
  @Output() openChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ name: string; url: string; description: string; tagNames: string[] }>();

  faSave = faSave;
  faTimes = faTimes;
  faCheck = faCheck;

  name = '';
  url = '';
  description = '';
  selectedTagNames: string[] = [];
  tagMenuOpen = false;

  ngOnChanges() {
    if (this.open) {
      this.name = this.link?.name ?? '';
      this.url = this.link?.url ?? '';
      this.description = this.link?.description ?? '';
      this.selectedTagNames = this.link?.tagNames ?? [];
      this.tagMenuOpen = false;
    }
  }

  get selectedTags() {
    return this.availableTags.filter(t => this.selectedTagNames.includes(t.name));
  }

  get triggerLabel() {
    return this.selectedTagNames.length
      ? `${this.selectedTagNames.length} tag(s) selecionada(s)`
      : '';
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

  close() { this.openChange.emit(false); this.tagMenuOpen = false; }

  onSubmit() {
    if (!this.name.trim() || !this.url.trim()) return;
    this.save.emit({
      name: this.name.trim(),
      url: this.url.trim(),
      description: this.description.trim(),
      tagNames: this.selectedTagNames,
    });
    this.close();
  }
}