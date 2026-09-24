import { Component, inject, ViewChild, ElementRef, afterNextRender, DestroyRef } from '@angular/core';
import { Input, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommandModalService } from '../../services/command-modal-service';
import { RecruiterStateService } from '../../services/recruiter-state-service';
import { InfoPanelService } from '../../services/info-panel.service';


interface CommandEntry {
  id?: number;
  input: string;
  result: string | null;
}

@Component({
  selector: 'app-command-terminal',
  imports: [CommonModule, FormsModule],
  templateUrl: './command-terminal.html',
  styleUrl: './command-terminal.scss',
  standalone: true,
})

export class CommandTerminal implements OnInit, AfterViewChecked {
  
  @ViewChild('cmdDisplay') private cmdDisplay!: ElementRef<HTMLDivElement>;
  @ViewChild('cmdInput') private cmdInput?: ElementRef<HTMLInputElement>;
  @Input() seedCommands: CommandEntry[] = [];
  suggestions: string[] = ['about', 'skills', 'experience', 'projects', 'education', 'certifications', 'referrals', 'contacts', 'introduction'];

  private modalService = inject(CommandModalService);
  private recruiterState = inject(RecruiterStateService);
  private infoPanelService = inject(InfoPanelService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Visitors should be able to start typing without clicking the terminal first,
    // including after closing a section modal.
    afterNextRender(() => {
      this.focusInput();
      this.dialog.afterAllClosed
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => setTimeout(() => this.focusInput()));
    });
  }

  private availableCommands = [
    'git checkout about',
    'git checkout skills',
    'git checkout experience',
    'git checkout projects',
    'git checkout education',
    'git checkout certifications',
    'git checkout certificates',
    'git checkout referrals',
    'git checkout contacts',
    'git checkout introduction',
    'git branch',
    'git status',
    'ls',
    'whoami',
    'show goal',
    'help',
    'clear',
    'switch mode'
  ];

  // Section name -> label shown in the terminal output.
  private sections: Record<string, string> = {
    introduction: 'Introduction',
    about: 'About',
    skills: 'Skills Explorer',
    experience: 'Experience',
    projects: 'Projects Explorer',
    education: 'Education',
    certifications: 'Certifications Explorer',
    certificates: 'Certifications Explorer',
    referrals: 'Referrals',
    contacts: 'Contacts',
  };

  // Shell-style verbs developers reach for instinctively; all behave like `git checkout`.
  private checkoutVerbs = ['git checkout', 'git switch', 'cd', 'open', 'cat'];

  levelName = 'Software Developer';
  commandHistory: CommandEntry[] = [];
  inputValue = '';
  hint = '';
  private nextId = 1;
  private inputHistory: string[] = [];
  private historyIndex = -1;

  ngOnInit(): void {
    this.commandHistory = this.seedCommands.map(cmd => ({
      ...cmd,
      id: this.nextId++,
    }));

    this.runInitialCommand();

    this.modalService.commandExecuted$.subscribe((command) => {
      const section = command.replace('git checkout ', '').trim();
      this.commandHistory.push({
        id: this.nextId++,
        input: command,
        result: `Opening ${section} section. ..`,
      });
      // Open the next modal (service handles deduplication)
      this.modalService.openModal(command);
    });
  }

  runInitialCommand(): void {
    if(this.seedCommands.length === 0){
      this.addCommand('show goal');
      this.addCommand('help');
    }
  }

  ngAfterViewChecked(): void {
    if (this.cmdDisplay) {
      const el = this.cmdDisplay.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  focusInput(): void {
    this.cmdInput?.nativeElement.focus();
  }

  runQuickCommand(command: string): void {
    this.addCommand(command);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && this.hint) {
      event.preventDefault();
      this.inputValue = this.hint;
      this.hint = '';
      this.updateHint();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.inputHistory.length > 0 && this.historyIndex < this.inputHistory.length - 1) {
        this.historyIndex++;
        this.inputValue = this.inputHistory[this.inputHistory.length - 1 - this.historyIndex];
        this.updateHint();
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.inputValue = this.inputHistory[this.inputHistory.length - 1 - this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.inputValue = '';
      }
      this.updateHint();
      return;
    }
    if (event.key === 'Enter' && this.inputValue.trim()) {
      this.inputHistory.push(this.inputValue.trim());
      this.historyIndex = -1;
      this.addCommand(this.inputValue.trim());
      this.inputValue = '';
      this.hint = '';
    }
  }
  onInputChange(): void {
    this.updateHint();
  }

  private updateHint(): void {
    const val = this.inputValue.toLowerCase().trim();
    if (!val) {
      this.hint = '';
      return;
    }
    const match = this.availableCommands.find(cmd => cmd.toLowerCase().startsWith(val) && cmd.toLowerCase() !== val);
    this.hint = match || '';
  }


  private addCommand(input: string): void {
    this.commandHistory.push({
      id: this.nextId++,
      input,
      result: this.processCommand(input),
    });
  }

  private processCommand(input: string): string | null {
    const command = input.toLowerCase().replace(/\s+/g, ' ').trim();

    const section = this.resolveSection(command);
    if (section) {
      this.modalService.openModal(`git checkout ${section}`);
      return `Opening ${this.sections[section]} section...`;
    }

    switch (command) {
      case 'ls':
        return Object.keys(this.sections).filter(s => s !== 'certificates').join('  ');
      case 'git branch':
        return `Branches: ${Object.keys(this.sections).filter(s => s !== 'certificates').join(', ')}. Use "git checkout <branch>" to open one.`;
      case 'git status':
        return 'On branch main. Nothing to commit, working tree clean. Try "git checkout projects".';
      case 'whoami':
        return 'Mfundo Mthembu, Software Developer based in Cape Town. Run "git checkout about" for more.';
        case 'show goal':
        this.infoPanelService.show('🎯 Goal', 'Navigate project sections using git terminal commands.\n\nUse "git checkout <section>" to explore each part of the portfolio.');
        return null;
      case 'help':
        this.infoPanelService.show('📖 Help', 'Available commands:\n\n• git checkout <section>\n  (or cd <section>, or just <section>)\n• ls / git branch\n• whoami\n• switch mode\n• show goal\n• help\n• clear\n\nSections:\nintroduction, about, skills, experience, projects,\ncertifications, education, referrals, contacts');
        return null;
        case 'clear':       
         this.commandHistory = [];
        return null;
      case 'switch mode':
        const currentMode = this.recruiterState.isRecruiterMode;
        this.recruiterState.setRecruiterMode(!currentMode);
        const newMode = !currentMode ? 'Recruiter' : 'Developer';
        return `Switched to ${newMode} mode.`;
      default: {
        const suggestion = this.suggestCommand(command);
        return suggestion
          ? `Unknown command: "${input}". Did you mean "${suggestion}"?`
          : `Unknown command: "${input}". Type "help" for available commands.`;
      }
    }
  }

  /** Maps `git checkout x`, `cd x`, `git switch x`, or a bare `x` to a known section. */
  private resolveSection(command: string): string | null {
    if (this.sections[command]) return command;
    for (const verb of this.checkoutVerbs) {
      if (command.startsWith(verb + ' ')) {
        const target = command.slice(verb.length + 1);
        return this.sections[target] ? target : null;
      }
    }
    return null;
  }

  private suggestCommand(command: string): string | null {
    const verb = this.checkoutVerbs.find(v => command.startsWith(v + ' '));
    if (verb) {
      const target = command.slice(verb.length + 1);
      const match = this.closest(target, Object.keys(this.sections));
      return match ? `git checkout ${match}` : null;
    }
    const match = this.closest(command, [...this.availableCommands, ...Object.keys(this.sections)]);
    if (!match) return null;
    return this.sections[match] ? `git checkout ${match}` : match;
  }

  private closest(value: string, candidates: string[]): string | null {
    let best: string | null = null;
    let bestDistance = 3; // only suggest when within 2 edits
    for (const candidate of candidates) {
      const distance = this.editDistance(value, candidate);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
    return best;
  }

  private editDistance(a: string, b: string): number {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const temp = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = temp;
      }
    }
    return row[b.length];
  }


}


