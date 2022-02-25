import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginRequest, UserRegisterRequest, UserResponse } from '@shared/interfaces';
import { environment } from '@env/environment';
import { Observable, from } from 'rxjs';
import { tableRequest } from '../interfaces/table';

@Injectable({
  providedIn: 'root',
})
export class HelperService {

  constructor() {
  }

  sortObject(array, key) {

    const order = [];
    for (let index = 1; index <= array.length + 1; index++) {
      order.push(index);
    }

    array.sort(function (a, b) {
      const A = a[key], B = b[key];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });
    return array;
  }
}
