import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkEducationService {
  url: string = `${environment.serverUrl}/work-educations`;
  constructor(private http: HttpClient) {}

  addWorkData(data) {
    return this.http.post(`${this.url}/`, data).toPromise();
  }
  updateWorkData(id, data) {
    return this.http.put(`${this.url}/${id}`, data).toPromise();
  }
}
