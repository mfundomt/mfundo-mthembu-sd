import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DesktopFile {
  id: string;
  label: string;
  icon: string;      // emoji or text icon
  type: 'folder' | 'file' | 'app';
  command?: string;  // maps to git checkout <section>
}

@Component({
  selector: 'app-desktop-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="desktop-icon"
      [class.selected]="selected"
      (click)="select.emit(file)"
      (dblclick)="open.emit(file)"
      (keydown.enter)="open.emit(file)"
      tabindex="0"
      [attr.aria-label]="file.label"
      role="button">
      <div class="icon-img">{{ file.icon }}</div>
      <div class="icon-label">{{ file.label }}</div>
    </div>
  `,
  styles: [`
    .desktop-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 8px 6px;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      width: 72px;
      transition: background 0.15s;
      outline: none;

      &:hover {
        background: rgba(255,255,255,0.12);
      }

      &.selected {
        background: rgba(100, 160, 255, 0.3);
        border: 1px solid rgba(100, 160, 255, 0.6);
      }

      &:focus-visible {
        outline: 2px solid rgba(100, 160, 255, 0.8);
      }
    }

    .icon-img {
      font-size: 36px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    .icon-label {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 11px;
      color: #fff;
      text-align: center;
      text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7);
      word-break: break-word;
      max-width: 68px;
      line-height: 1.3;
    }
  `]
})
export class DesktopIconComponent {
  @Input() file!: DesktopFile;
  @Input() selected = false;
  @Output() select = new EventEmitter<DesktopFile>();
  @Output() open = new EventEmitter<DesktopFile>();
}
