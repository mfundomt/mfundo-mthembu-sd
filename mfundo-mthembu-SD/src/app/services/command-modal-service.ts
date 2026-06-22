import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { marked } from 'marked';
import { CommandModal } from '../components/command-modal/command-modal';
import { RecruiterStateService } from './recruiter-state-service';

// Configure marked to add lazy loading to images
const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  return `<img src="${href}" alt="${text}" ${title ? `title="${title}"` : ''} loading="lazy" decoding="async" />`;
};
marked.setOptions({ renderer });

@Injectable({
  providedIn: 'root',
})
export class CommandModalService {

  private commandExecuted = new Subject<string>();
  commandExecuted$ = this.commandExecuted.asObservable();
  isRecruiterMode = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private recruiterStateService: RecruiterStateService
  ) {
    this.recruiterStateService.isRecruiterMode$.subscribe(mode => {
      this.isRecruiterMode = mode;
    });
  }

  private lastOpenCommand = '';
  private lastOpenTime = 0;

  openModal(command: string): void {
    const file = this.getFileForCommand(command);
    if (!file) return;

    // Deduplicate rapid-fire calls for same command
    const now = Date.now();
    if (command === this.lastOpenCommand && now - this.lastOpenTime < 2000) return;
    this.lastOpenCommand = command;
    this.lastOpenTime = now;

    this.dialog.closeAll();

    this.http.get(`assets/command-info/${file}`, { responseType: 'text' }).subscribe({
      next: (raw) => {
        const { title, content } = this.parseFrontmatter(raw);
        const section = command.replace('git checkout ', '').trim().toLowerCase();
        const htmlContent = marked.parse(content) as string;
        const panelClass = section === 'introduction' ? 'introduction-modal-panel' : 'command-modal-panel';
        const dialogRef = this.dialog.open(CommandModal, {
          data: { title, content: htmlContent, links: '', mode: this.isRecruiterMode ? 'recruiter' : 'developer', section },
          width: '90%',
          maxWidth: "900px",
          height: "600px",
          panelClass
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.commandExecuted.next(result);
          }
        });
      }
    });
  }

  private getFileForCommand(command: string): string | null {
    const section = command.replace('git checkout ', '').trim().toLowerCase();
    const validSections = [
      'introduction',
      'about',
      'skills',
      'experience',
      'education',
      'certifications',
      'referrals',
      'contacts',
      'projects',
      'projects-explorer',
      'project-footlook',
      'project-careerpulse',
      'project-portfolio',
      'skills-explorer',
      'skill-software-development',
      'skill-frontend-web',
      'skill-databases-tools',
      'skill-architecture-interests',
      'skill-professional-academic',
    ];
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
