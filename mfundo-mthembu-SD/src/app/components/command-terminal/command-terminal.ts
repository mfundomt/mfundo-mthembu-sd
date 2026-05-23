import { Component, inject } from '@angular/core';
import { Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandModalService } from '../../services/command-modal-service';


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

export class CommandTerminal implements OnInit {
  
  @Input() seedCommands: CommandEntry[] = [];
  suggestions: string[] = ['about', 'skills', 'experience', 'projects', 'education', "certificates", 'referrals', 'contacts', 'introduction'];

  private modalService = inject(CommandModalService);

  private availableCommands = [
    'git checkout about',
    'git checkout skills',
    'git checkout experience',
    'git checkout projects',
    'git checkout education',
    'git checkout certifications',
    'git checkout referrals',
    'git checkout contacts',
    'git checkout introduction',
    'show goal',
    'help',
    'clear'
  ];

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

    this.modalService.commandExecuted$.subscribe((command) => {
      this.commandHistory.push({
        id: this.nextId++,
        input: command,
        result: this.processCommand(command),
      });
    });
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

    switch (input.toLowerCase()) {

      case 'git checkout about':
        this.modalService.openModal(input);
        return 'Opening About section...';
      case 'git checkout skills':
        this.modalService.openModal(input);
        return 'Opening Skills section...';
      case 'git checkout experience':
        this.modalService.openModal(input);
        return 'Opening Experience section...';
      case 'git checkout projects':
      this.modalService.openModal(input);
      return 'Opening Projects section...';
      case 'git checkout certifications':
        this.modalService.openModal(input);
        return 'Opening Certifications section...';
      case 'git checkout education':
        this.modalService.openModal(input);
        return 'Opening Education section...';
      case 'git checkout referrals':
        this.modalService.openModal(input);
        return 'Opening Referrals section...';
      case 'git checkout contacts':
        this.modalService.openModal(input);
        return 'Opening Contacts section...';
        case 'show goal':
        return "Goal: Navigate project sections using git terminal commands";
      case 'help':
        return 'Available commands: "git checkout about", "git checkout skills", "git checkout experience", "git checkout projects", "git checkout certifications", "git checkout education", "git checkout referrals", "git checkout contacts","help", "clear".';
        case 'clear':       
         this.commandHistory = [];
        return null;
      default:
        return `Unknown command: "${input}". Type "help" for available commands.`;
    }
  }


}


