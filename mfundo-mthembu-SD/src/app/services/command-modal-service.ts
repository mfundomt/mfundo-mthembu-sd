import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { marked } from 'marked';
import { CommandModal } from '../components/command-modal/command-modal';

@Injectable({
  providedIn: 'root',
})
export class CommandModalService {

  private commandExecuted = new Subject<string>();
  commandExecuted$ = this.commandExecuted.asObservable();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  openModal(command: string): void {
    const file = this.getFileForCommand(command);
    if (!file) return;

    this.http.get(`assets/command-info/${file}`, { responseType: 'text' }).subscribe({
      next: (raw) => {
        const { title, content } = this.parseFrontmatter(raw);
        const htmlContent = marked.parse(content) as string;
        const dialogRef = this.dialog.open(CommandModal, {
          data: { title, content: htmlContent, links: '' },
          width: '90%',
          maxWidth: "900px",
          height: "600px",
          panelClass: 'command-modal-panel'
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.commandExecuted.next(result);
            this.openModal(result);
          }
        });
      }
    });
  }

  private getFileForCommand(command: string): string | null {
    const section = command.replace('git checkout ', '').trim().toLowerCase();
    const validSections = ['about', 'skills', 'experience', /*'certifications'*/, 'education', 'referrals'];
    if (validSections.includes(section)) {
      return `${section}.md`;
    }
    return null;
  }

  private parseFrontmatter(raw: string): { title: string; content: string } {
    const normalized = raw.replace(/\r\n/g, '\n');
    const match = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (match) {
      const frontmatter = match[1];
      const content = match[2].trim();
      const titleMatch = frontmatter.match(/title:\s*(.+)/);
      return {
        title: titleMatch ? titleMatch[1].trim() : 'Info',
        content
      };
    }
    return { title: 'Info', content: normalized };
  }
}
