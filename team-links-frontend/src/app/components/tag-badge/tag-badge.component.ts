import { Component, Input, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Tag } from '../../models/types';
import { TagColorService } from '../../services/tag-color.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-tag-badge',
  standalone: true,
  imports: [NgStyle],
  template: `
    <span class="tag-chip" [ngStyle]="style">{{ tag.name }}</span>
  `,
  styles: [`
    .tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
  `],
})
export class TagBadgeComponent implements OnInit {
  @Input() tag!: Tag;
  style: Record<string, string> = {};

  constructor(
    private tagColor: TagColorService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    const s = this.tagColor.getStyle(this.tag.id, this.themeService.isDark);
    this.style = {
      'background': s.background,
      'color': s.color,
      'border': s.border,
    };
  }
}