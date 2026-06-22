import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RecruiterStateService } from '../../services/recruiter-state-service';
import { CommandModalService } from '../../services/command-modal-service';

@Component({
  selector: 'app-command-modal',
  imports: [CommonModule, MatDialogModule],
  standalone: true,
  templateUrl: './command-modal.html',
  styleUrl: './command-modal.scss',
})
export class CommandModal {
  safeContent: SafeHtml;
  isRecruiterMode = false; 

  private sections = ['about', 'skills', 'experience', 'education', 'certifications', 'projects', 'referrals', 'contacts'];
  currentSection: string;

  constructor(
    public dialogRef: MatDialogRef<CommandModal>,
    
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string; links: string; mode?: string; section?: string },
    private sanitizer: DomSanitizer,
    private recruiterStateService: RecruiterStateService,
    private modalService: CommandModalService
  ) {
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(data.content);
    this.currentSection = data.section || '';
    this.recruiterStateService.isRecruiterMode$.subscribe(mode => {
      this.isRecruiterMode = mode;
    });
  }

  onContentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Handle mode selection buttons
    const modeBtn = target.closest('[data-mode]') as HTMLElement;
    if (modeBtn) {
      event.preventDefault();
      const mode = modeBtn.getAttribute('data-mode');
      this.recruiterStateService.setRecruiterMode(mode === 'recruiter');
      this.dialogRef.close('git checkout about');
      return;
    }

    // Handle command links
    const cmdLink = target.closest('[data-command]') as HTMLElement;
    if (cmdLink) {
      if (cmdLink.getAttribute('data-activate') === 'dblclick') {
        return;
      }

      event.preventDefault();
      const command = cmdLink.getAttribute('data-command');
      if (command) {
        this.dialogRef.close(command);
      }
    }
  }

  onContentDoubleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const cmdLink = target.closest('[data-command]') as HTMLElement;
    if (!cmdLink) return;
    if (cmdLink.getAttribute('data-activate') !== 'dblclick') return;

    event.preventDefault();
    const command = cmdLink.getAttribute('data-command');
    if (command) {
      this.dialogRef.close(command);
    }
  }

  onNext(): void {
    const idx = this.sections.indexOf(this.currentSection);
    if (idx < this.sections.length - 1) {
      this.dialogRef.close(`git checkout ${this.sections[idx + 1]}`);
    }
  }

  onPrev(): void {
    const idx = this.sections.indexOf(this.currentSection);
    if (idx > 0) {
      this.dialogRef.close(`git checkout ${this.sections[idx - 1]}`);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}


