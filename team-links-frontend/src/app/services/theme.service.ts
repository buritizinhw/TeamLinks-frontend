import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'teamlinks-theme';
  private _isDark = new BehaviorSubject<boolean>(true);
  isDark$ = this._isDark.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const dark = saved ? saved === 'dark' : true;
    this._isDark.next(dark);
    this.applyTheme(dark);
  }

  toggle() {
    const next = !this._isDark.value;
    this._isDark.next(next);
    localStorage.setItem(this.STORAGE_KEY, next ? 'dark' : 'light');
    this.applyTheme(next);
  }

  private applyTheme(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark);
  }

  get isDark() { return this._isDark.value; }
}