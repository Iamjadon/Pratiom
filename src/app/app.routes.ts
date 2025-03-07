import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GstDetailsComponent } from './pages/gst-details/gst-details.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { OldsearchsalesBillComponent } from './pages/oldsearchsales-bill/oldsearchsales-bill.component';
import { SalesregisterComponent } from './pages/salesregister/salesregister.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path:'home',
        component:LayoutComponent,
        children:[
            {
                path:'dashboard',
                component:DashboardComponent
            },
            {
                path:'salesregister',
                component:SalesregisterComponent
            },
            {
                path:'gstDetails',
                component:GstDetailsComponent
            },
            {
                path:'oldsalessearch',
                component:OldsearchsalesBillComponent
            }

          
        ]

    },
   
];
