import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

import {Subject} from 'rxjs';
import {Food} from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private foods: Food[] = [];
  foodsSubject = new Subject<Food[]>();

  constructor() { }

  emitFoods() {
    this.foodsSubject.next(this.foods);
  }

  saveFoods() {
    firebase.database().ref('/foods').set(this.foods);
    return new Promise(
      (resolve) => {
        firebase.database().ref('/foods/').once('value').then(
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

  fetchFoods() {
    firebase.database().ref('/foods').on(
      'value', (data) => {
        this.foods = data.val() ? data.val() : [];
        this.emitFoods();
      }
    );
  }

  fetchSingleFood(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/foods/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  createNewFood(food: Food) {
    this.foods.push(food);
    this.saveFoods();
    this.emitFoods();
  }

  deleteSingleFood(food: Food) {
    console.log('service deleteSingleFood');
    if (food.photo) {
      console.log('food.photo : ' + food.photo);
      const refImage = firebase.storage().refFromURL(food.photo);
      console.log('deleteSingleFood : refImage' + refImage);
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
    const foodIndex = this.foods.findIndex(
      catElement =>  {
        if (catElement === food) {
          return true;
        }
      }
    );
    this.foods.splice(foodIndex, 1);
    this.saveFoods();
    this.emitFoods();
  }
}
