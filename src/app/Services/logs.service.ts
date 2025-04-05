import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GET_LOGS } from '../GraphQL/Queries/logs.query';
import { UPDATE_LOG } from '../GraphQL/Mutations/updateLog.mutation';
import { DELETE_LOG } from '../GraphQL/Mutations/deleteLog.mutation';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private logs = new BehaviorSubject<any[]>([]);
  logs$ = this.logs.asObservable();

  private from = new BehaviorSubject<any>({});
  from$  =this.from.asObservable();

  private to = new BehaviorSubject<any>({});
  to$  =this.to.asObservable();

  constructor(private apollo: Apollo) { }

  getLogs(from: string, to: string): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_LOGS,
      variables: {
        from,
        to,
      },
    }).valueChanges;
  }

  updateLog(id: number, username: string): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_LOG,
      variables: {
        id,
        username,
      },
    });
  }

  deleteLog(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_LOG,
      variables: {
        id,
      },
    });
  }

  loadLogs(from: string, to: string ){
    this.getLogs(from,to).pipe(
      catchError(err => {
        console.error('Error al cargar los datos de la API', err);
        return [];  // Si hay un error, devolvemos un array vacío
      })
    ).subscribe(response => {
      this.logs.next(response.data.logs);  // Emitimos los datos al BehaviorSubject
    })
  }

  actualizarArgs(from: string, to: string ): void {
    this.from.next(from);
    this.to.next(to); 
    this.loadLogs(from, to);
  }
}
