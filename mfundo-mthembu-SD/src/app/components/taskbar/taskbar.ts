import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgwWindowsManagerService } from 'ngx-windows';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="taskbar">
      <!-- Left: launcher + open windows -->
      <div class="taskbar-left">
        <div class="taskbar-launcher" title="Desktop" (click)="minimizeAll()">
          <span class="launcher-icon">⚡</span>
        </div>

        @for (win of nwm.activeWindows(); track win.id) {
          <button
            class="taskbar-pill"
            [class.active]="nwm.currentActiveWindow()?.id === win.id"
            [class.minimized]="win.service?.stateSvc?.minimized()"
            (click)="toggleWindow(win.id)"
            [title]="win.name">
            <span class="pill-icon">{{ getIcon(win.name) }}</span>
            <span class="pill-label">{{ win.name }}</span>
          </button>
        }
      </div>

      <!-- Right: clock -->
      <div class="taskbar-right">
        <div class="taskbar-clock">
          <span class="clock-time">{{ now() | date:'HH:mm' }}</span>
          <span class="clock-date">{{ now() | date:'EEE dd MMM' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 42px;
      background: rgba(20, 20, 30, 0.88);
      backdrop-filter: blur(16px);
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      z-index: 9999;
      box-shadow: 0 -2px 20px rgba(0,0,0,0.4);
    }

    .taskbar-left {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      overflow: hidden;
    }

    .taskbar-launcher {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 1px solid rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      margin-right: 6px;
      transition: background 0.15s;

      &:hover { background: rgba(255,255,255,0.1); }

      .launcher-icon {
        font-size: 18px;
        filter: drop-shadow(0 0 6px #5af78e);
      }
    }

    .taskbar-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.06);
      color: #ccc;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      cursor: pointer;
      max-width: 140px;
      transition: background 0.15s;
      white-space: nowrap;
      overflow: hidden;

      &:hover { background: rgba(255,255,255,0.14); }

      &.active {
        background: rgba(90,247,142,0.15);
        border-color: rgba(90,247,142,0.4);
        color: #5af78e;
      }

      &.minimized {
        opacity: 0.55;
        border-style: dashed;
      }
    }

    .pill-icon { font-size: 14px; flex-shrink: 0; }
    .pill-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .taskbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .taskbar-clock {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: 'JetBrains Mono', monospace;
    }

    .clock-time {
      font-size: 13px;
      color: #e0e0e0;
      font-weight: 600;
      line-height: 1;
    }

    .clock-date {
      font-size: 9px;
      color: #888;
      line-height: 1;
    }
  `]
})
export class TaskbarComponent implements OnInit {
  nwm = inject(NgwWindowsManagerService);
  now = signal(new Date());

  private clockInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.clockInterval = setInterval(() => this.now.set(new Date()), 10000);
  }

  ngOnDestroy() {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  toggleWindow(id: string) {
    const win = this.nwm.getWindowById(id);
    if (!win) return;
    if (win.service?.stateSvc?.minimized()) {
      this.nwm.activateWindow(id);
    } else if (this.nwm.currentActiveWindow()?.id === id) {
      win.service?.minimize();
    } else {
      this.nwm.activateWindow(id);
    }
  }

  minimizeAll() {
    this.nwm.getOpenWindows().forEach(w => w.service?.minimize());
  }

  getIcon(name: string): string {
    const map: Record<string, string> = {
      'Terminal': '💻',
      'Projects': '📁',
      'Experience': '💼',
      'Education': '🎓',
      'Skills': '🛠️',
      'About': '👤',
      'Contacts': '📬',
      'Certifications': '🏆',
      'Referrals': '⭐',
    };
    return map[name] ?? '🗂️';
  }
}
