import { Component } from '@angular/core';
import { Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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

  levelName = 'Overview';
  commandHistory: CommandEntry[] = [];
  inputValue = '';
  private nextId = 1;

  ngOnInit(): void {
    this.commandHistory = this.seedCommands.map(cmd => ({
      ...cmd,
      id: this.nextId++,
    }));
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
        return 'About Section: Learn about the project structure and components.';
      case 'git checkout skills':
        return 'Skills Section: Explore the skills and technologies used in the project.';
      case 'git checkout experience':
        return 'Experience Section: View the professional experience and projects.';
      case 'git checkout certifications':
        return 'Certifications Section: Check out the certifications and achievements.';
      case 'git checkout education':
        return 'Education Section: Discover the educational background and qualifications.';
      case 'git checkout referrals':
        return 'Referrals Section: See recommendations and endorsements from colleagues and mentors.';
      case 'help':
        return 'Available commands: "git checkout about", "git checkout skills", "git checkout experience", "git checkout certifications", "git checkout education", "git checkout referrals", "clear".';
        case 'clear':       
         this.commandHistory = [];
        return null;
      default:
        return `Unknown command: "${input}". Type "help" for available commands.`;
    }
  }


}


