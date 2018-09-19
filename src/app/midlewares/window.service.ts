import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }
  get windowRef() {
    return window
  }
}
