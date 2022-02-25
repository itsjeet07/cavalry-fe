import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginRequest, UserRegisterRequest, UserResponse } from '@shared/interfaces';
import { environment } from '@env/environment';
import { Observable, from } from 'rxjs';
import { tableRequest } from '../interfaces/table';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapUrl = 'https://app.zipcodebase.com/api/v1/search?apikey=57420540-0e05-11eb-9f57-015ff86c2e44&country=us&codes=';
  constructor(
    private http: HttpClient,
  ) {
  }

  getLocations(zip) {
    return this.http.get(this.mapUrl + zip);
  }
}
