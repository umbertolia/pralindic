import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AbstractControl} from '@angular/forms';
import {Food} from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient: HttpClient) {  }

  public getJSON(url: string): Observable<any> {
    return this.httpClient.get(url);
  }

  uploadFile(file: File, additionalString: string) {
    return new Promise(
      (resolve, reject) => {
        const uniqueFileName = Date.now().toString().concat('_').concat(additionalString).concat('_');
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

  public isAbstractControlNotEmpty(control: AbstractControl): boolean {
    if (control != null && control.value !== '') {
        return true;
    }
    return  false;
  }

  public getArrayFromMap(myMap: Map<string, Object>) {
    const array = [];
    myMap.forEach((value: Food, key: string) => {
      console.log(key, value);
      array.push(value);
    });
    return array;
  }

  public isNotNullOrEmpty(value: string): boolean {
    if (value && value.trim().length > 0) {
      return true;
    }
    return false;
  }

  getAvatarStyles(fileUrl: string) {
    const styles = {
      'background-size': 'cover',
      'background-image': 'url(' + fileUrl + ')'
    };
    return styles;
  }

  onSelectFiles(event: any, fileToUpload: File, fileUrl: string) {
    if (event.target.files[0]) {
      fileToUpload = event.target.files[0];
      // image preview
      const reader = new FileReader();
      reader.onload = (evenemnt: any) => {
        fileUrl = evenemnt.target.result;
      };
      reader.readAsDataURL(fileToUpload);
    }
    return (fileToUpload =  event.target.files[0]);
  }
}
