import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Users } from '../modals/Users';

@Injectable({
  providedIn: 'root',
})
export class AllUsers {
  private readonly _http = inject(HttpClient);

  getListing(){
    return this._http.get<Users[]>('http://localhost:3000/users');
  }

  addListing(data: Omit<Users, 'id'>){
    return this._http.post<Users>('http://localhost:3000/users',data);
  }

  update(data: Omit<Users, 'id'>, id: string){
    return this._http.put<Users>('http://localhost:3000/users/' + id, data);
  }

  delete(id: string){
    return this._http.delete('http://localhost:3000/users/' + id);
  }
}
