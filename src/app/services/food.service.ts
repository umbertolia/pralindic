import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

import {Subject} from 'rxjs';
import {Food} from '../models/food.model';
import {CategoryService} from './category.service';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private foods = new Map<string, Food>();
  foodsSubject = new Subject<Map<string, Food>>();

  constructor(private categoryService: CategoryService, private commonService: CommonService) { }

  emitFoods() {
    this.foodsSubject.next(this.foods);
  }

  updateFood(newFood: Food, oldFood: Food, newPhotoUploaded: boolean): Promise<boolean> {
    console.log('service updateFood');
    const updates = {};
    updates['foodName'] = newFood.foodName;
    updates['glycemicIndex'] = newFood.glycemicIndex;
    updates['pralIndex'] = newFood.pralIndex;
    updates['favorite'] = newFood.favorite;

    if (newFood.categoryName || newFood.categoryName === '') {
      updates['categoryName'] = newFood.categoryName;
    }
    if (newPhotoUploaded && newFood.photo) {
      updates['photo'] = newFood.photo;
    }


    return new Promise(
      (resolve) => {
        firebase.database().ref('/foods/').child(newFood.foodName).update(updates).then(
          value => {
            console.log('mise a jour de ' + newFood);
            resolve(true);
          },
          erreur => {
            console.log('erreur sur l\'update' + erreur);
            resolve(false);
          }
        ).then( value => {
            // cas si le nom a changé, alors on doit renommer le noeud et mettre a jour le nom de l'aliment dans la catégorie
            if (newFood.foodName !== oldFood.foodName) {
              this.updateChildNameAndCategoryFoodName(newFood, oldFood);
            }
          },
            reason => {
              console.log('erreur sur updateChildNameAndCategoryFoodName()' + reason);
            }
        );
        if (newPhotoUploaded && oldFood.photo) {
          // suppr de l'ancienne image
          const refImage = firebase.storage().refFromURL(oldFood.photo);
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

  private updateChildNameAndCategoryFoodName(newFood: Food, oldFood: Food): Promise<boolean> {
    console.log('service updateChildNameAndCategoryFoodName');
    return new Promise((resolve) => {
      firebase.database().ref('/foods/').child(newFood.foodName).set(newFood).then(
        data => {
          firebase.database().ref('/foods/').child(oldFood.foodName).remove().then(
            value => {
              this.categoryService.deleteFoodNameFromCategory(newFood);
            });
          resolve(true);
        });
    });
  }

  fetchFoods(): Promise<boolean> {
    const mapLocal = new Map<string, Food>();
    return new Promise(resolve => {
      firebase.database().ref('/foods').on(
        'value', (data) => {
          data.forEach(entry => {
            mapLocal.set(entry.key, entry.val() as Food);
          });
          this.foods =  this.commonService.sortMap(mapLocal, Food.name);
          this.emitFoods();
          resolve(true);
        });
    });
  }



  fetchSingleFood(foodName: string): Promise<Food> {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/foods/').child(foodName).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  createNewFood(food: Food): Promise<Boolean> {
    console.log('service createNewFood');
    return new Promise(resolve => {
      this.foods.set(food.foodName, food);
      firebase.database().ref('/foods/').child(food.foodName).set(food).then(
        value => {
          resolve(true);
        } );
      this.emitFoods();
    });
  }

  deleteSingleFood(food: Food): Promise<boolean> {
    console.log('service deleteSingleFood');
    return new Promise(resolve => {
      this.commonService.deletePhoto(true, food.photo);
      let deleted = false;
      firebase.database().ref('/foods').child(food.foodName).remove().then(
        value => {
          deleted =  this.foods.delete(food.foodName);
          this.emitFoods();
          this.categoryService.deleteFoodNameFromCategory(food);
          resolve(deleted);
        }
      );
    });
  }

  deleteCategoryIndexFromFoods(foodsName: string[]) {
    console.log('service deleteCategoryIndexFromFoods');
    foodsName.forEach(foodName => {
      this.fetchSingleFood(foodName).then(
        (food: Food) => {
          const newFood = { ...food};
          const oldFood = { ...food};
          newFood.categoryName = '';
          this.updateFood(newFood, oldFood, false);
        });
    });
  }
}
