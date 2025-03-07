
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { SearchsaleregisterComponent } from '../../component/searchsaleregister/searchsaleregister.component';
import { UpdatePriceModalComponent } from '../../component/update-price-modal/update-price-modal.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule,CommonModule,
      MatIconModule,
      MatSidenavModule,
      MatButtonModule,
      MatListModule,
      MatButtonModule,
      MatListModule,
      MatExpansionModule,
      MatMenuModule,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
constructor(private dialog: MatDialog,private router: Router) {}

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
  navigateToSalesRegister() {
    console.log("Navigating to Sales Register...");
    this.router.navigateByUrl('home/salesregister');
  }
  navigateTodashboard(){
    this.router.navigateByUrl('home/dashboard');
  }
  logout(){
    this.router.navigateByUrl('login');
  }
  navigateToGst(){
    this.router.navigateByUrl('home/gstDetails');
  }
  openSearchOldSales(){
    this.router.navigateByUrl('home/oldsalessearch');
  }
  
}
