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

export class CommandTerminal {
  
  @Input() seedCommands: CommandEntry[] = [];

  private modalService = inject(CommandModalService);

  levelName = 'Software Developer';
  commandHistory: CommandEntry[] = [];
  inputValue = '';
  private nextId = 1;

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
    if (event.key === 'Enter' && this.inputValue.trim()) {
      this.addCommand(this.inputValue.trim());
      this.inputValue = '';
    }
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
      /*case 'git checkout certifications':
        this.modalService.openModal(input);
        return 'Opening Certifications section...';*/
      case 'git checkout education':
        this.modalService.openModal(input);
        return 'Opening Education section...';
      case 'git checkout referrals':
        this.modalService.openModal(input);
        return 'Opening Referrals section...';
      case 'help':
        return 'Available commands: "git checkout about", "git checkout skills", "git checkout experience", "git checkout education", "git checkout referrals", "clear".';
        case 'clear':       
         this.commandHistory = [];
        return null;
      default:
        return `Unknown command: "${input}". Type "help" for available commands.`;
    }
  }


}


