import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PaisesComponent } from './pages/paises/paises.component';
import { LogsComponent } from './pages/log/logs.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'paises', component: PaisesComponent },
    { path: 'logs', component: LogsComponent }
];
