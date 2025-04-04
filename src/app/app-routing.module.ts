import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PaisesComponent } from './pages/paises/paises.component';
import { LogsComponent } from './pages/logs/logs.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'paises', component: PaisesComponent },
  { path: 'logs', component: LogsComponent }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
