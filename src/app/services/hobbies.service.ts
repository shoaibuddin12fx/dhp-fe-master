import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HobbiesService {
  url: string = `${environment.serverUrl}/hobbies`;
  constructor(private http: HttpClient) {}

  addHobbiesData(data) {
    return this.http.post(`${this.url}/`, data).toPromise();
  }
  updateHobbiesData(id, data) {
    return this.http.put(`${this.url}/${id}`, data).toPromise();
  }

  deleteHobbiesData(id) {
    return this.http.delete(`${this.url}/${id}`).toPromise();
  }
}
