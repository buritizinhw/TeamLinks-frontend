import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts.asObservable();
  private nextId = 0;

  success(message: string) { this.add(message, 'success'); }
  error(message: string)   { this.add(message, 'error'); }

  private add(message: string, type: 'success' | 'error') {
    const id = ++this.nextId;
    const toast: Toast = { id, message, type };
    this._toasts.next([...this._toasts.value, toast]);
    setTimeout(() => this.remove(id), 3500);
  }

  remove(id: number) {
    this._toasts.next(this._toasts.value.filter(t => t.id !== id));
  }
}