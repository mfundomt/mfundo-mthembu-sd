import {
  Component, inject, afterNextRender, OnDestroy, DestroyRef,
  signal, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgwWindowsManagerService, NgwWindowsContainerComponent } from 'ngx-windows';
import { DesktopIconComponent, DesktopFile } from '../desktop-icon/desktop-icon';
import { TaskbarComponent } from '../taskbar/taskbar';
import { FileViewerComponent } from '../file-viewer/file-viewer';
import { TerminalWindowComponent } from '../terminal-window/terminal-window';
import { CommandModalService } from '../../services/command-modal-service';

const DESKTOP_FILES: DesktopFile[] = [
  { id: 'terminal',       label: 'Terminal',       icon: '💻', type: 'app' },
  { id: 'about',          label: 'About',          icon: '👤', type: 'file',   command: 'about' },
  { id: 'projects',       label: 'Projects',       icon: '📁', type: 'folder', command: 'projects' },
  { id: 'experience',     label: 'Experience',     icon: '💼', type: 'folder', command: 'experience' },
  { id: 'education',      label: 'Education',      icon: '🎓', type: 'folder', command: 'education' },
  { id: 'skills',         label: 'Skills',         icon: '🛠️', type: 'file',   command: 'skills' },
  { id: 'certifications', label: 'Certifications', icon: '🏆', type: 'folder', command: 'certifications' },
  { id: 'contacts',       label: 'Contacts',       icon: '📬', type: 'file',   command: 'contacts' },
  { id: 'referrals',      label: 'Referrals',      icon: '⭐', type: 'file',   command: 'referrals' },
];

// Default window sizes per type
const WINDOW_SIZES: Record<string, { w: number; h: number }> = {
  terminal: { w: 500, h: 520 },
  default:  { w: 660, h: 500 },
};

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    CommonModule,
    NgwWindowsContainerComponent,
    DesktopIconComponent,
    TaskbarComponent,
  ],
  providers: [NgwWindowsManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="desktop" (click)="onDesktopClick()">
      <!-- Desktop icons -->
      <div class="icon-grid" (click)="$event.stopPropagation()">
        @for (file of desktopFiles; track file.id) {
          <app-desktop-icon
            [file]="file"
            [selected]="selectedId() === file.id"
            (select)="selectedId.set($event.id)"
            (open)="openFile($event)" />
        }
      </div>

      <!-- ngx-windows container -->
      <ngw-windows-container [style]="{ width: '100vw', height: '100vh' }" />
    </div>

    <!-- Taskbar rendered outside desktop click zone -->
    <app-taskbar />
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .desktop {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .icon-grid {
      position: absolute;
      top: 16px;
      left: 16px;
      display: grid;
      grid-template-columns: 84px;
      gap: 8px;
      z-index: 10;
      /* Allow icons to stack vertically in one column on the left */
    }

    ngw-windows-container {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
    }
  `]
})
export class DesktopComponent implements OnDestroy {
  nwm = inject(NgwWindowsManagerService);
  private destroyRef = inject(DestroyRef);
  private modalService = inject(CommandModalService);

  desktopFiles = DESKTOP_FILES;
  selectedId = signal<string | null>(null);

  // Track open window IDs per section so we don't duplicate
  private openWindows = new Map<string, string>();

  constructor() {
    afterNextRender(() => {
      // Open terminal by default after a brief delay so the container is ready
      setTimeout(() => this.openTerminal(), 200);
    });

    // React to terminal commands that open sections
    this.modalService.commandExecuted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((command) => {
        const section = command.replace('git checkout ', '').trim().toLowerCase();
        const file = DESKTOP_FILES.find(f => f.command === section);
        if (file) this.openFile(file);
      });
  }

  onDesktopClick() {
    this.selectedId.set(null);
  }

  openFile(file: DesktopFile) {
    this.selectedId.set(file.id);

    // If already open, just activate it
    const existingId = this.openWindows.get(file.id);
    if (existingId && this.nwm.getWindowById(existingId)) {
      this.nwm.activateWindow(existingId);
      return;
    }

    if (file.id === 'terminal') {
      this.openTerminal();
      return;
    }

    this.openFileWindow(file);
  }

  private openTerminal() {
    const existingId = this.openWindows.get('terminal');
    if (existingId && this.nwm.getWindowById(existingId)) {
      this.nwm.activateWindow(existingId);
      return;
    }

    const size = WINDOW_SIZES['terminal'];
    const offsetX = Math.max(20, (window.innerWidth / 2) - (size.w / 2));
    const offsetY = Math.max(20, (window.innerHeight / 2) - (size.h / 2) - 30);

    const win = this.nwm.createWindow({
      name: 'Terminal',
      component: TerminalWindowComponent,
    });

    win.onRegister$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(svc => {
      svc.placementSvc.setAll(size.w, size.h, offsetX, offsetY);
      this.openWindows.set('terminal', win.id);

      svc.onClose$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.openWindows.delete('terminal');
        this.nwm.removeWindow(win.id);
      });
    });
  }

  private openFileWindow(file: DesktopFile) {
    const size = WINDOW_SIZES['default'];
    // Cascade offset based on how many windows are open
    const count = this.nwm.activeWindows().length;
    const offsetX = 120 + count * 24;
    const offsetY = 60 + count * 24;

    const win = this.nwm.createWindow({
      name: file.label,
      component: FileViewerComponent,
    });

    win.onRegister$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(svc => {
      svc.data.set({ section: file.command });
      svc.placementSvc.setAll(size.w, size.h, offsetX, offsetY);
      this.openWindows.set(file.id, win.id);

      svc.onClose$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.openWindows.delete(file.id);
        this.nwm.removeWindow(win.id);
      });
    });
  }

  ngOnDestroy() {
    this.nwm.removeAllWindows();
  }
}
