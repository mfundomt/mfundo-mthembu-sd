import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-command-modal',
  imports: [CommonModule, MatDialogModule],
  standalone: true,
  templateUrl: './command-modal.html',
  styleUrl: './command-modal.scss',
})
export class CommandModal {
  safeContent: SafeHtml;

  constructor(
    public dialogRef: MatDialogRef<CommandModal>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string; links: string },
    private sanitizer: DomSanitizer
  ) {
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(data.content);
  }

  onContentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const cmdLink = target.closest('[data-command]') as HTMLElement;
    if (cmdLink) {
      event.preventDefault();
      const command = cmdLink.getAttribute('data-command');
      if (command) {
        this.dialogRef.close(command);
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}


