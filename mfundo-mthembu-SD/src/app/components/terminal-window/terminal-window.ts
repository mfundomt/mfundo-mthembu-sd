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
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      min-height: 0;
    }

    .terminal-window-wrap {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    /* Force the terminal to fill the window content area using flex */
    ::ng-deep app-command-terminal {
      flex: 1 !important;
      min-height: 0 !important;
      width: 100% !important;
      height: auto !important;
      align-items: stretch !important;
      padding: 0 !important;
    }

    ::ng-deep .terminal-wrap {
      flex: 1 !important;
      min-height: 0 !important;
      width: 100% !important;
      height: auto !important;
      border-radius: 0 !important;
      border: none !important;
    }

    /* Hide only the traffic lights — ngx-window provides those; keep the title label */
    ::ng-deep .titlebar .traffic-lights {
      display: none !important;
    }

    ::ng-deep .titlebar .title-label {
      margin-top: 0 !important;
      text-align: center;
    }
  `]
})
export class TerminalWindowComponent {
  windowController = input.required<NgwWindowControllerService>();
}
