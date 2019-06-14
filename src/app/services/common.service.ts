import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + uniqueFileName + file.name)
          .put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
          console.log('upload en cours...');
          },
          (erreur) => {
            console.log('Erreur d\'upload' + erreur);
            reject();
          },
          () => {
          resolve(upload.snapshot.ref.getDownloadURL());
            console.log('upload terminé');
          }
        );
      }
    );
  }
}
