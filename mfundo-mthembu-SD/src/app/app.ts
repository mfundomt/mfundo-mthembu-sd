import { Component, signal, afterNextRender, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DesktopComponent } from './components/desktop/desktop';

@Component({
  selector: 'app-root',
  imports: [
    DesktopComponent,
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
  private vantaEffect: any;

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
    });
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}