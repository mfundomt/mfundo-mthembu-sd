import {
  Component, inject, afterNextRender, OnDestroy, DestroyRef,
  signal, ChangeDetectionStrategy, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgwWindowsManagerService, NgwWindowsContainerComponent } from 'ngx-windows';
import {
  DesktopIconComponent,
  DesktopFile,
  DesktopIconPosition,
  DesktopIconPositionChange,
} from '../desktop-icon/desktop-icon';
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
  terminal: { w: 500, h: 800 },
  default:  { w: 660, h: 500 },
};

const ICON_POSITIONS_STORAGE_KEY = 'desktop.icon.positions.v1';

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
      <div class="icon-grid">
        @for (file of desktopFiles; track file.id; let i = $index) {
          <app-desktop-icon
            [file]="file"
            [selected]="selectedId() === file.id"
            [position]="getIconPosition(file.id, i)"
            (select)="selectedId.set($event.id)"
            (positionChange)="onIconPositionChange($event)"
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
      inset: 0;
      z-index: 10;
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
  private platformId = inject(PLATFORM_ID);
  private modalService = inject(CommandModalService);
  private isBrowser = isPlatformBrowser(this.platformId);

  desktopFiles = DESKTOP_FILES;
  selectedId = signal<string | null>(null);
  iconPositions = signal<Record<string, DesktopIconPosition>>({});

  // Track open window IDs per section so we don't duplicate
  private openWindows = new Map<string, string>();

  constructor() {
    if (this.isBrowser) {
      this.iconPositions.set(this.loadIconPositions());
    }

    afterNextRender(() => {
      // Open terminal by default after a brief delay so the container is ready
      if (this.isBrowser) {
        setTimeout(() => this.openTerminal(), 200);
      }
    });

    // React to terminal commands that open sections
    this.modalService.commandExecuted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((command) => {
        const section = command.replace('git checkout ', '').trim().toLowerCase();
        const file = DESKTOP_FILES.find(f => f.command === section);
        if (file) {
          this.openFile(file);
          return;
        }

        // Support modal-only commands (e.g. project explorer folders).
        this.modalService.openModal(command);
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

    switch (file.id) {
      case 'terminal':
        this.openTerminal();
        return;
      case 'projects':
        this.modalService.openModal('git checkout projects-explorer');
        return;
      case 'skills':
        this.modalService.openModal('git checkout skills-explorer');
        return;
    }

    if (file.command) {
      this.modalService.openModal(`git checkout ${file.command}`);
      return;
    }

    this.openFileWindow(file);
  }

  getIconPosition(fileId: string, index: number): DesktopIconPosition {
    const saved = this.iconPositions()[fileId];
    return saved ?? this.defaultIconPosition(index);
  }

  onIconPositionChange(event: DesktopIconPositionChange) {
    this.iconPositions.update((current) => {
      const next = {
        ...current,
        [event.id]: { x: event.x, y: event.y },
      };
      this.saveIconPositions(next);
      return next;
    });
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

  private defaultIconPosition(index: number): DesktopIconPosition {
    return {
      x: 16,
      y: 16 + index * 92,
    };
  }

  private loadIconPositions(): Record<string, DesktopIconPosition> {
    if (!this.isBrowser) return {};

    try {
      const raw = localStorage.getItem(ICON_POSITIONS_STORAGE_KEY);
      if (!raw) return {};

      const parsed = JSON.parse(raw) as Record<string, DesktopIconPosition>;
      const allowedIds = new Set(this.desktopFiles.map((file) => file.id));
      const sanitized: Record<string, DesktopIconPosition> = {};

      for (const [id, pos] of Object.entries(parsed)) {
        if (
          allowedIds.has(id) &&
          typeof pos?.x === 'number' &&
          typeof pos?.y === 'number'
        ) {
          sanitized[id] = { x: pos.x, y: pos.y };
        }
      }

      return sanitized;
    } catch {
      return {};
    }
  }

  private saveIconPositions(positions: Record<string, DesktopIconPosition>) {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(ICON_POSITIONS_STORAGE_KEY, JSON.stringify(positions));
    } catch {
      // Storage can fail in private mode or when quotas are exceeded.
    }
  }
}
