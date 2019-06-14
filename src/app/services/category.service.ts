import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

import {Subject} from 'rxjs';
import {Category} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Category[] = [];
  categoriesSubject = new Subject<Category[]>();

  constructor() { }

  emitCategories() {
    this.categoriesSubject.next(this.categories);
  }

  saveCategories() {
    const catArraySize = this.categories.length;
    console.log('saveCategories() / catArraySize : ' + catArraySize);
    firebase.database().ref('/categories').set(this.categories);
    return new Promise(
      (resolve) => {
        firebase.database().ref('/categories/').once('value').then(
          (value) => {
            console.log(value.val());
            resolve(value);
          },
          erreur => {
            console.log(erreur);
          }
        );
      }
    );
  }

  updateCategorie(categorie: Category, id: number, newPhoto: File, oldFileUrl: string) {
    console.log('service updateCategorie');
    const updates = {};
    updates['catName'] = categorie.catName;
    if (newPhoto) {
      updates['photo'] = categorie.photo;
    }
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/categories/' + id).update(updates).then(
          value => {
            console.log('mise a jour de ' + categorie);
          },
          erreur => {
            console.log('erreur sur l\'update' + erreur);
          }
        );
        if (oldFileUrl) {
          // suppr de l'ancienne image
          const refImage = firebase.storage().refFromURL(oldFileUrl);
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
    );

  }

  fetchCategories() {
    firebase.database().ref('/categories').on(
      'value', (data) => {
        this.categories = data.val() ? data.val() : [];
        this.emitCategories();
      }
    );
  }

  fetchSingleCategory(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/categories/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  createNewCategory(category: Category) {
    this.categories.push(category);
    this.saveCategories();
    this.emitCategories();
  }

  deleteSingleCategory(category: Category) {
    console.log('service deleteSingleCategory');
    if (category.photo) {
      console.log('category.photo : ' + category.photo);
      const refImage = firebase.storage().refFromURL(category.photo);
      console.log('deleteSingleCategory : refImage' + refImage);
      refImage.delete().then(
        () => {
          console.log('photo supprimée');
        }
      ).catch(
        (erreur) => {
          console.log('erreur lors de la suppression, de la photo' + erreur);
        }
      );
    }
    const catIndex = this.categories.findIndex(
      catElement =>  {
        if (catElement === category) {
          return true;
        }
      }
    );
    this.categories.splice(catIndex, 1);
    this.saveCategories();
    this.emitCategories();
  }

}
