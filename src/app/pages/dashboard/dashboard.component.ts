import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import Chart from 'chart.js/auto';
import { UpdatePriceModalComponent } from '../../component/update-price-modal/update-price-modal.component';
import { metalprice } from '../../models/metalprice.model';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  private chart: Chart | undefined;
  goldPrice: number = 0;
  silverPrice: number = 0;
  yesterdayGoldPrice: number = 0;
  yesterdaySilverPrice: number = 0;

  constructor(
    private apiService: ApiService, 
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog
  ) {}


  ngOnInit() {
    if (!sessionStorage.getItem('firstLoad')) {
      sessionStorage.setItem('firstLoad', 'true');
      location.reload(); 
    }
    this.apiService.getemetalprice().subscribe({
      next: (data: metalprice) => {
        this.goldPrice = data.todayGoldPrice; 
        this.silverPrice = data.todaySilverPrice;  
        this.yesterdayGoldPrice = data.yesterdayGoldPrice; 
        this.yesterdaySilverPrice = data.yesterdaySilverPrice;  
      },
      error: (err) => {
        console.error('Error fetching metal prices:', err);
      }
    });
  }


  // Open the modal when the "Get Update Gold Rate" is clicked
  openUpdateGoldRateDialog(): void {
    const dialogRef = this.dialog.open(UpdatePriceModalComponent, {
      width: '300px',
      data: {
        goldPrice: 60000,  
        silverPrice: 750    
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  ngAfterViewInit() {
    // Ensure chart is only rendered on the client side
    if (isPlatformBrowser(this.platformId)) {
      this.renderChart();
    }
  }

  renderChart() {
    const ctx = document.getElementById('goldSilverChart') as HTMLCanvasElement;
    
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
          datasets: [
            {
              label: 'Gold Price (₹)',
              data: [60000, 59000, 58000, 59500, 61000],
              borderColor: '#FFD700',
              backgroundColor: 'rgba(255, 215, 0, 0.3)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Silver Price (₹)',
              data: [750, 740, 730, 745, 760],
              borderColor: '#C0C0C0',
              backgroundColor: 'rgba(192, 192, 192, 0.3)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
  }

}


