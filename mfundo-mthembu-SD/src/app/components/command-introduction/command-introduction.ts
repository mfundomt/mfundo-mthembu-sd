import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-command-introduction',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './command-introduction.html',
  styleUrl: './command-introduction.scss',
  standalone: true
})
export class CommandIntroduction {}
