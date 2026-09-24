import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RecruiterStateService } from '../../services/recruiter-state-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-info-panel',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="info-terminal" *ngIf="content">
      <div class="info-titlebar">
        <span class="info-title">{{ title }}</span>
        <button type="button" class="close-btn" (click)="onClose()" aria-label="Close" title="Close">✕</button>
      </div>
      <div class="info-body">
        <p class="info-content">{{ content }}</p>
      </div>
      <div class="mode-indicator">
        <span class="mode-label">Mode:</span>
        <span class="mode-value" [class.recruiter]="isRecruiter$ | async">
          {{ (modeLabel$ | async) }}
        </span>
      </div>
    </div>
    <div class="mode-badge" *ngIf="!content">
      <span class="mode-label">Mode:</span>
      <span class="mode-value" [class.recruiter]="isRecruiter$ | async">
        {{ (modeLabel$ | async) }}
      </span>
    </div>
  `,
  styleUrl: './info-panel.scss'
})
export class InfoPanel {
  @Input() title = '';
  @Input() content = '';
  @Output() closed = new EventEmitter<void>();

  private recruiterState = inject(RecruiterStateService);
  isRecruiter$ = this.recruiterState.isRecruiterMode$;
  modeLabel$ = this.recruiterState.isRecruiterMode$.pipe(
    map(isRecruiter => isRecruiter ? '👔 Recruiter' : '💻 Developer')
  );

  onClose() {
    this.closed.emit();
  }
}
