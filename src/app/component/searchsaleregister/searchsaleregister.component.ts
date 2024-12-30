import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-searchsaleregister',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './searchsaleregister.component.html',
  styleUrl: './searchsaleregister.component.css'
})
export class SearchsaleregisterComponent {
  invoiceNumber: string = '';
  selectedParty: string = '';
  parties: string[] = ['Party A', 'Party B', 'Party C'];

  search() {
    console.log('Searching for invoice:', this.invoiceNumber, 'Party:', this.selectedParty);
  }
}
