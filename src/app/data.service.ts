import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public url = 'http://cgi.uru.ac.th:3000';

  constructor(
    public http: HttpClient
  ) { }

  getTemple() {
    // tslint:disable-next-line: max-line-length
    const json = `http://www.cgi.uru.ac.th/geoserver/fire_support/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=fire_support%3Atemple_4326&outputFormat=application%2Fjson`;
    return new Promise((resolve: any, reject: any) => {
      this.http.get(json).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

}
