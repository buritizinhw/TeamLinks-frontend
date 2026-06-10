import { Injectable } from '@angular/core';

const TAG_COLORS = [
  { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
  { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' },
  { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  { bg: '#FFE4E6', text: '#9F1239', border: '#FECDD3' },
  { bg: '#CFFAFE', text: '#164E63', border: '#A5F3FC' },
  { bg: '#FAE8FF', text: '#86198F', border: '#F5D0FE' },
  { bg: '#ECFCCB', text: '#3F6212', border: '#D9F99D' },
  { bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA' },
  { bg: '#CCFBF1', text: '#134E4A', border: '#99F6E4' },
];

const TAG_COLORS_DARK = [
  { bg: 'rgba(29,78,216,0.25)',   text: '#93C5FD', border: 'rgba(29,78,216,0.4)' },
  { bg: 'rgba(6,95,70,0.25)',     text: '#6EE7B7', border: 'rgba(6,95,70,0.4)' },
  { bg: 'rgba(109,40,217,0.25)', text: '#C4B5FD', border: 'rgba(109,40,217,0.4)' },
  { bg: 'rgba(146,64,14,0.25)',  text: '#FCD34D', border: 'rgba(146,64,14,0.4)' },
  { bg: 'rgba(159,18,57,0.25)',  text: '#FDA4AF', border: 'rgba(159,18,57,0.4)' },
  { bg: 'rgba(22,78,99,0.25)',   text: '#67E8F9', border: 'rgba(22,78,99,0.4)' },
  { bg: 'rgba(134,25,143,0.25)', text: '#F0ABFC', border: 'rgba(134,25,143,0.4)' },
  { bg: 'rgba(63,98,18,0.25)',   text: '#BEF264', border: 'rgba(63,98,18,0.4)' },
  { bg: 'rgba(154,52,18,0.25)',  text: '#FED7AA', border: 'rgba(154,52,18,0.4)' },
  { bg: 'rgba(20,78,74,0.25)',   text: '#99F6E4', border: 'rgba(20,78,74,0.4)' },
];

@Injectable({ providedIn: 'root' })
export class TagColorService {
  private colorMap = new Map<number, number>();
  private nextIndex = 0;

  getStyle(tagId: number, isDark: boolean): { background: string; color: string; border: string } {
    if (!this.colorMap.has(tagId)) {
      this.colorMap.set(tagId, this.nextIndex);
      this.nextIndex = (this.nextIndex + 1) % TAG_COLORS.length;
    }
    const idx = this.colorMap.get(tagId)!;
    const palette = isDark ? TAG_COLORS_DARK : TAG_COLORS;
    const c = palette[idx];
    return { background: c.bg, color: c.text, border: `1px solid ${c.border}` };
  }
}