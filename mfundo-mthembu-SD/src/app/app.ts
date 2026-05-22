import { Component, signal, inject, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CommandTerminal } from './components/command-terminal/command-terminal';
import { CommandModalService } from './services/command-modal-service';

@Component({
  selector: 'app-root',
  imports: [
    CommandTerminal,
    RouterOutlet,
    CommonModule,
    RouterModule
  ],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mfundo-mthembu-SD');
  private modalService = inject(CommandModalService);
    seedCommands = [
    { input: 'level overview', result: null },
    { input: 'hint', result: 'Try "git checkout" to explore the project structure!' },
    { input: 'show goal', result: 'Goal: Navigate project sections using git terminal commands.' },
  ];

  constructor() {
    afterNextRender(() => {
      // Defer modal to avoid blocking FCP/LCP
      requestIdleCallback(() => {
        this.modalService.openModal('git checkout introduction');
      });
    });
  }
}