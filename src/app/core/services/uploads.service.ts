import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArquivoUpload } from '../../features/configuracao/interface/empresa';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
 private apiUrl = `${environment.apiUrl}/uploads`;

   constructor(private httpClient: HttpClient) {}

 uploadLogo(file: File): Observable<ArquivoUpload> {
  const formData = new FormData();
  // O backend espera campo 'logo'
   formData.append('file', file, file.name);

  return this.httpClient.post<ArquivoUpload>(
    `${this.apiUrl}`,
    formData
  );
  }
}
