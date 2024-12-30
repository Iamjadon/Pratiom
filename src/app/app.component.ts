import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'pratiomJew';
  
}


