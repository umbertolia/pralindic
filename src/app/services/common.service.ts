import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AbstractControl} from '@angular/forms';
import {Food} from '../models/food.model';
import {Category} from '../models/category.model';
import {KeyValue} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient: HttpClient) {  }

  getJSON(url: string): Observable<any> {
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

  isAbstractControlNotEmpty(control: AbstractControl): boolean {
    if (control != null && control.value !== '') {
        return true;
    }
    return  false;
  }

  public getArrayFromMap(myMap: Map<string, Object>) {
    const array = [];
    myMap.forEach((value: Food) => {
      array.push(value);
    });
    array.sort((a: Food, b: Food) => this.sortByFoodFavorite(a, b));
    return array;
  }

  isNotNullOrEmpty(value: string): boolean {
    if (value && value.trim().length > 0) {
      return true;
    }
    return false;
  }

  getAvatarStyles(fileUrl: string) {
    const styles = {
      'background-size': 'cover',
      'background-image': 'url(' + fileUrl + ')',
    };
    return styles;
  }

  deletePhoto(newPhotoUploaded: boolean, urlPhotoToDelete: string) {
    if (newPhotoUploaded && urlPhotoToDelete) {
      // suppr de l'ancienne image
      const refImage = firebase.storage().refFromURL(urlPhotoToDelete);
      refImage.delete().then(
        () => {
          console.log('ancienne photo supprimée');
        }
      ).catch(
        (erreur) => {
          console.log('erreur lors de la suppression, de l\'ancienne photo' + erreur);
        }
      );
    }
  }

  sortMap(map: Map<string, any>, className: string): Map<string, any> {
    const arr = Array.from(map);
    if (className === Category.name) {
      arr.sort((a: [string, Category], b: [string, Category]) => {
        return this.sortByFoodsNumber(a[1], b[1]);
      });
    }
    if (className === Food.name) {
      arr.sort((a: [string, Food], b: [string, Food]) => {
        return this.sortByFoodFavorite(a[1], b[1]);
      });
    }
    return new Map([...arr]);
  }

  /*
* utilisé dans le pipe de la vue car par défaut la map est trié selon ses clés (meme si celle-ci est trié autrement en amont)
*/
  indexOrderByFoodsNumber = (akv: KeyValue<string, Category>, bkv: KeyValue<string, Category>): number => {
    return this.sortByFoodsNumber(akv.value, bkv.value);
  }

  sortByFoodsNumber(cat1: Category, cat2: Category): number {
    if (cat1.foods && !cat2.foods) {
      return -1;
    } else if (cat1.foods && cat2.foods) {
      if (cat1.foods.length > cat2.foods.length) {
        return -1;
      }
    }
  }

  sortByFoodFavorite(food1: Food, food2: Food) {
    if (food1.favorite && !food2.favorite) {
      return -1;
    }
  }
}
