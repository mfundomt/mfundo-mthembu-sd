import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CommandTerminal } from './components/command-terminal/command-terminal';

@Component({
  selector: 'app-root',
  imports: [CommandTerminal, RouterOutlet, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mfundo-mthembu-SD');
    seedCommands = [
    { input: 'level overview', result: null },
    { input: 'hint', result: 'Try "show components" to explore the project structure!' },
    { input: 'show goal', result: 'Goal: Navigate project sections using terminal commands.' },
  ];
}