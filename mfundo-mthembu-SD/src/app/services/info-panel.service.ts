import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface InfoPanelData {
  title: string;
  content: string;
}

export interface InfoPanelInstance extends InfoPanelData {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class InfoPanelService {
  private panelSubject = new BehaviorSubject<InfoPanelInstance[]>([]);
  panels$ = this.panelSubject.asObservable();
  private nextId = 1;

  // Keep compatibility for callers expecting a single active panel.
  panel$ = this.panels$;

  show(title: string, content: string): number {
    const id = this.nextId++;
    const panel: InfoPanelInstance = { id, title, content };
    this.panelSubject.next([...this.panelSubject.value, panel]);
    return id;
  }

  hide(id?: number): void {
    if (id === undefined) {
      this.panelSubject.next([]);
      return;
    }

    this.panelSubject.next(this.panelSubject.value.filter(panel => panel.id !== id));
  }
}
