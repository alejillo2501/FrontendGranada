import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesService } from '../../Services/countries.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FloatLabelType, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Country } from '../../interfaces/country';


@Component({
  selector: 'app-paises',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormField,
    MatProgressSpinnerModule
  ],
  templateUrl: './paises.component.html',
  styleUrl: './paises.component.scss'
})
export class PaisesComponent implements OnInit, AfterViewInit {
  countries: Country[] = [];
  displayedColumns: string[] = ['name', 'population', 'area', 'densidad'];
  dataSource = new MatTableDataSource<Country>([]);
  limite: number = 0;
  username: string = 'default';
  show: boolean = false;
  loader: boolean = false;

  form!: FormGroup;

  readonly floatLabelControl = new FormControl('auto' as FloatLabelType);
  protected readonly floatLabel = toSignal(
    this.floatLabelControl.valueChanges.pipe(map(v => v || 'auto')),
    {initialValue: 'auto'},
  );  

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private countryService: CountriesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {    

    this.form = this.fb.group({
      username: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.max(50), Validators.min(0)]],
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);

      this.limite = this.form.value.cantidad;
      this.username = this.form.value.username;

      this.loader = true;
      this.countryService.getCountries(this.limite, this.username).subscribe((result: any) => {
        this.show = true;
        this.countries = result.data.countries;
        this.dataSource.data = result.data.countries; 
        this.loader = false;       
        console.log(result.data);
        this.ngOnInit();
      });

    } else {
      console.warn('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }
}
