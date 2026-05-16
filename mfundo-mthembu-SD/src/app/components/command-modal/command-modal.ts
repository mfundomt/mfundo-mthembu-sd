import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-command-modal',
  imports: [],
  standalone: true,
  templateUrl: './command-modal.html',
  styleUrl: './command-modal.scss',
})

@NgModule({
  declarations: [CommandModal],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class CommandModal implements OnInit {

  constructor(public dialogRef: MatDialogRef<CommandModal>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string, message: string, links: string }) {}

  onCancel() {
    this.dialogRef.close();
  }
  
  onClose()
  {
    this.dialogRef.close();
  }

  ngOnInit(): void {

  }

}


