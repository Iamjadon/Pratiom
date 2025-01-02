import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; 
import { FormsModule } from '@angular/forms'; 
import { metalprice } from '../../models/metalprice.model';
import { ApiService } from '../../services/api-service';

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

  constructor(private apiService: ApiService,public dialogRef: MatDialogRef<UpdatePriceModalComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    const data: metalprice = {
      date: new Date().toISOString(), 
      todayGoldPrice: this.goldPrice,
      yesterdayGoldPrice: 0,  
      todaySilverPrice: this.silverPrice,
      yesterdaySilverPrice: 0  
    };

    console.log('Data being sent to API:', data);

    this.apiService.updatemetalprice(data).subscribe({
      next: (response) => {
        console.log('Price updated successfully:', response);
        alert('Metal prices updated successfully');
        this.dialogRef.close(response);  
      },
      error: (error) => {
        console.error('Error updating prices:', error);
        alert('Error updating prices. Please try again.');
      }
    });
  }
  
}
