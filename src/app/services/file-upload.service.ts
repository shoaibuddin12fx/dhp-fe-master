import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadImage(data, id) {
    const body = new FormData();
    body.append('file', data);

    return this.http
      .post(environment.serverUrl + `/files/${id}/temp-files `, body)
      .toPromise();
  }
}
