import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { PaisesComponent } from './pages/paises/paises.component';
import { LogsComponent } from './pages/logs/logs.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    PaisesComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,  
    AppRoutingModule,   
    RouterModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
