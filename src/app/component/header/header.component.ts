
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { UpdatePriceModalComponent } from '../update-price-modal/update-price-modal.component';
import { SearchsaleregisterComponent } from '../searchsaleregister/searchsaleregister.component'; 



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule,
   ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private dialog: MatDialog) {}

  openUpdateGoldRateDialog(): void {
    this.dialog.open(UpdatePriceModalComponent, {
      width: '500px',  
      data: {
        goldPrice: 60000,  
        silverPrice: 750   
      }
    });
  }
  openSearchSalesRegister(): void {
    this.dialog.open(SearchsaleregisterComponent, { 
      width: '500px'
    });
  }
  
}


