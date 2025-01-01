import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-update-price-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,  
    FormsModule      
  ],
  templateUrl: './update-price-modal.component.html',
  styleUrls: ['./update-price-modal.component.css']
})
export class UpdatePriceModalComponent {
  goldPrice: number=0;
  silverPrice: number=0;

  constructor(public dialogRef: MatDialogRef<UpdatePriceModalComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log('Gold Price:', this.goldPrice, 'Silver Price:', this.silverPrice);
    this.dialogRef.close();
  }
}
