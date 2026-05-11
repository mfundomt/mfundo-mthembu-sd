import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CommandEntry {
  id?: number;
  input: string;
  result: string | null;
}

@Component({
  selector: 'app-terminal',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
})
export class Terminal implements OnInit {
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
      case 'help':
        return 'Available commands: help, show goal, hint, level overview';
      case 'show goal':
        return 'Goal: Navigate project sections using terminal commands.';
      case 'hint':
        return 'Try "show components" to explore the project structure!';
      case 'level overview':
        return null;
      default:
        return `Unknown command: "${input}". Type "help" for available commands.`;
    }
  }
}
