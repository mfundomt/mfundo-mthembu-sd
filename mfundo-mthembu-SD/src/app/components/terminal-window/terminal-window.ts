import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgwWindowControllerService } from 'ngx-windows';
import { CommandTerminal } from '../command-terminal/command-terminal';

@Component({
  selector: 'app-terminal-window',
  standalone: true,
  imports: [CommandTerminal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="terminal-window-wrap">
      <app-command-terminal [seedCommands]="[]" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .terminal-window-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
    }

    /* Override the host-level height restriction from command-terminal */
    ::ng-deep app-command-terminal {
      display: flex;
      flex: 1;
      width: 100%;
      height: 100%;
      align-items: stretch;
      padding: 0 !important;
    }

    ::ng-deep .terminal-wrap {
      width: 100% !important;
      height: 100% !important;
      border-radius: 0 !important;
      border: none !important;
    }
  `]
})
export class TerminalWindowComponent {
  windowController = input.required<NgwWindowControllerService>();
}
