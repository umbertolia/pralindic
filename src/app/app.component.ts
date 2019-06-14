import {Component} from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyD3qeeXjZvqBWA52gdZkeYSX4G-6TE0XR4',
      authDomain: 'pralindic.firebaseapp.com',
      databaseURL: 'https://pralindic.firebaseio.com',
      projectId: 'pralindic',
      storageBucket: 'pralindic.appspot.com',
      messagingSenderId: '811337064569',
      appId: '1:811337064569:web:12c0d16606e56f50'
    };
    firebase.initializeApp(firebaseConfig);
  }
}
