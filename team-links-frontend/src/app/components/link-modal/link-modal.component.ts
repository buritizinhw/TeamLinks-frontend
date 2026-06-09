import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes, faCheck, faTimes as faTimes2 } from '@fortawesome/free-solid-svg-icons';
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
  @Output() save = new EventEmitter<{ title: string; url: string; tagIds: string[] }>();

  faSave = faSave;
  faTimes = faTimes;
  faCheck = faCheck;
  faTimesCircle = faTimes2;

  title = '';
  url = '';
  selectedTagIds: string[] = [];
  tagMenuOpen = false;

  ngOnChanges() {
    if (this.open) {
      this.title = this.link?.title ?? '';
      this.url = this.link?.url ?? '';
      this.selectedTagIds = this.link?.tags.map(t => t.id) ?? [];
      this.tagMenuOpen = false;
    }
  }

  get selectedTags() {
    return this.availableTags.filter(t => this.selectedTagIds.includes(t.id));
  }

  get triggerLabel() {
    return this.selectedTagIds.length
      ? `${this.selectedTagIds.length} tag(s) selecionada(s)`
      : '';
  }

  toggleTagMenu() { this.tagMenuOpen = !this.tagMenuOpen; }
  toggleTag(tagId: string) {
    this.selectedTagIds = this.selectedTagIds.includes(tagId)
      ? this.selectedTagIds.filter(id => id !== tagId)
      : [...this.selectedTagIds, tagId];
  }

  isSelected(tagId: string) { return this.selectedTagIds.includes(tagId); }
  removeTag(tagId: string) {
    this.selectedTagIds = this.selectedTagIds.filter(id => id !== tagId);
  }

  close() { this.openChange.emit(false); this.tagMenuOpen = false; }

  onSubmit() {
    if (!this.title.trim() || !this.url.trim()) return;
    this.save.emit({
      title: this.title.trim(),
      url: this.url.trim(),
      tagIds: this.selectedTagIds
    });
    this.close();
  }
}