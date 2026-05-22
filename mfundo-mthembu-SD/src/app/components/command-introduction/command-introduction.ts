import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-command-introduction',
  imports: [CommonModule, MatDialogModule],
  templateUrl: '../././../components/command-introduction/command-introduction.html',
  styleUrl: './command-introduction.scss',
  standalone: true
})
export class CommandIntroduction {
  isRecruiterMode = false;

  constructor(
    public dialogRef: MatDialogRef<CommandIntroduction>,
    @Inject(MAT_DIALOG_DATA) public data:any,
      ) {}

  next(){
    if(this.data.curentIndex < this.data.introductionData.length - 1){
      this.data.curentIndex++;
    } 
  }

  prev(){
    if(this.data.curentIndex > 0){
      this.data.curentIndex--;
    }
  }


  onClose(): void {
    this.dialogRef.close();
  }
}
