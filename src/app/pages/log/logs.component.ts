import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FloatLabelType, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LogsService } from '../../Services/logs.service';
import { StringToJsonPipe } from '../../pipes/string-to-json.pipe';
import { FormDialogComponent } from '../../modals/form-dialog/form-dialog.component';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { Log } from '../../interfaces/log';

@Component({
  selector: 'app-logs',
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
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StringToJsonPipe,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit, AfterViewInit {

  logs: Log[] = [];
  displayedColumns: string[] = ['id', 'username', 'request_timestamp', 'num_countries_returned', 'countries_details', 'actualizar', 'eliminar'];
  dataSource = new MatTableDataSource<Log>([]);
  show: boolean = false;
  loader: boolean = false;
  from:string=this.formatFechaCompleta(new Date());
  to:string=this.formatFechaCompleta(new Date());

  logsReactivo:Log[] = [];
  fromReactivo:string = this.from;
  toReactivo:string = this.to;

  form!: FormGroup;

  readonly floatLabelControl = new FormControl('auto' as FloatLabelType);
  protected readonly floatLabel = toSignal(
    this.floatLabelControl.valueChanges.pipe(map(v => v || 'auto')),
    {initialValue: 'auto'},
  );  

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
      private logsService: LogsService,
      private fb: FormBuilder,
      private dialog: MatDialog
    ) {}

  ngOnInit(): void {     

    this.logsService.logs$.subscribe(objeto => {
      this.logsReactivo = objeto;
      this.dataSource.data = objeto;
      console.log('DataSource recibido:', objeto);
    })
    
    this.actualizarRango(this.from, this.to);

    this.form = this.fb.group({
      rangoFechas: this.fb.group(
        {
          from: [null, Validators.required],
          to: [null, Validators.required]
        },
        { validators: this.validarRangoFechas }
      )
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
      this.loader = true;
      this.show = false;
      const { from, to } = this.form.get('rangoFechas')?.value;

      const fromFormatted = this.formatFechaCompleta(from);
      const toFormatted = this.formatFechaCompleta(to);

      console.log('Fecha desde:', fromFormatted);
      console.log('Fecha hasta:', toFormatted);

      this.actualizarRango(fromFormatted, toFormatted);

    } else {
      console.warn('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

  validarRangoFechas(group: AbstractControl): { [key: string]: any } | null {
    const from = group.get('from')?.value;
    const to = group.get('to')?.value;

    if (from && to && from > to) {
      return { rangoInvalido: true };
    }

    return null;
  }

  formatFechaCompleta(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  actualizarRango(from:string, to:string){
    this.loader = true;
    this.show = false;
    this.logsService.actualizarArgs(from, to);
    this.loader = false;
    this.show = true;
  }

  actualizarLog(e:Log){
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '300px',
      height: '250px',
      data: e
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(e.username != result.username){
          this.logsService.updateLog(e.id, result.username).subscribe(response => {
            console.log("Registro actualizado::", response);
            this.actualizarRango(this.from, this.to);
          });
        }        
      }
    });
  }

  eliminarLog(e:Log){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      height: '200px',
      data: e
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result){
          this.logsService.deleteLog(e.id).subscribe(response => {
            console.log('Registro eliminado::', response);
            this.actualizarRango(this.from, this.to);
          });
        }
        
      }
    });
  }

  

}
