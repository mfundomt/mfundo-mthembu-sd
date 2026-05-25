import { Component, signal, inject, afterNextRender, OnDestroy } from '@angular/core';
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
export class App implements OnDestroy {
  protected readonly title = signal('mfundo-mthembu-SD');
  private modalService = inject(CommandModalService);
  private vantaEffect: any;
    seedCommands = [
    { input: 'level overview', result: null },
    { input: 'hint', result: 'Try "git checkout" to explore the project structure!' },
    { input: 'show goal', result: 'Goal: Navigate project sections using git terminal commands.' },
  ];

  constructor() {
    afterNextRender(() => {
      const VANTA = (window as any)['VANTA'];
      if (VANTA) {
        this.vantaEffect = VANTA.WAVES({
          el: document.body,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          shininess: 150.00,
          waveHeight: 10.00,
          waveSpeed: 0.75,
          zoom: 1.03
        });
      }

      // Defer modal to avoid blocking FCP/LCP
      requestIdleCallback(() => {
        this.modalService.openModal('git checkout introduction');
      });
    });
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}