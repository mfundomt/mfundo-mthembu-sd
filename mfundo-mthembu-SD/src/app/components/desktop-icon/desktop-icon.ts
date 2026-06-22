import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DesktopFile {
  id: string;
  label: string;
  icon: string;      // emoji or text icon
  type: 'folder' | 'file' | 'app';
  command?: string;  // maps to git checkout <section>
}

export interface DesktopIconPosition {
  x: number;
  y: number;
}

export interface DesktopIconPositionChange extends DesktopIconPosition {
  id: string;
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
      [class.dragging]="isDragging"
      [style.left.px]="currentPosition.x"
      [style.top.px]="currentPosition.y"
      (mousedown)="onMouseDown($event)"
      (click)="onClick($event)"
      (dblclick)="onDoubleClick($event)"
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
      position: absolute;
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
      cursor: grab;

      &.dragging {
        cursor: grabbing;
      }

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
export class DesktopIconComponent implements OnChanges, OnDestroy {
  @Input() file!: DesktopFile;
  @Input() selected = false;
  @Input() position: DesktopIconPosition = { x: 0, y: 0 };

  @Output() select = new EventEmitter<DesktopFile>();
  @Output() open = new EventEmitter<DesktopFile>();
  @Output() positionChange = new EventEmitter<DesktopIconPositionChange>();

  currentPosition: DesktopIconPosition = { x: 0, y: 0 };
  isDragging = false;

  private dragStartMouse: DesktopIconPosition | null = null;
  private dragStartIcon: DesktopIconPosition | null = null;
  private movedDuringDrag = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['position']) {
      this.currentPosition = { ...this.position };
    }
  }

  onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;

    event.stopPropagation();
    event.preventDefault();

    this.isDragging = true;
    this.movedDuringDrag = false;
    this.dragStartMouse = { x: event.clientX, y: event.clientY };
    this.dragStartIcon = { ...this.currentPosition };

    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mouseup', this.onWindowMouseUp);
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.movedDuringDrag) {
      this.movedDuringDrag = false;
      return;
    }

    this.select.emit(this.file);
  }

  onDoubleClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.movedDuringDrag) {
      return;
    }

    this.open.emit(this.file);
  }

  ngOnDestroy() {
    this.cleanupDragListeners();
  }

  private onWindowMouseMove = (event: MouseEvent) => {
    if (!this.dragStartMouse || !this.dragStartIcon) return;

    const deltaX = event.clientX - this.dragStartMouse.x;
    const deltaY = event.clientY - this.dragStartMouse.y;

    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      this.movedDuringDrag = true;
    }

    const nextX = this.dragStartIcon.x + deltaX;
    const nextY = this.dragStartIcon.y + deltaY;
    this.currentPosition = {
      x: this.clamp(nextX, 0, Math.max(0, window.innerWidth - 84)),
      y: this.clamp(nextY, 0, Math.max(0, window.innerHeight - 120)),
    };
  };

  private onWindowMouseUp = () => {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.cleanupDragListeners();

    this.positionChange.emit({
      id: this.file.id,
      x: this.currentPosition.x,
      y: this.currentPosition.y,
    });
  };

  private cleanupDragListeners() {
    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
