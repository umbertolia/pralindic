import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

import {Subject} from 'rxjs';
import {Category} from '../models/category.model';
import {Food} from '../models/food.model';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories = new Map<string, Category>();
  private foodsName = [];
  categoriesSubject = new Subject<Map<string, Category>>();
  foodsNameSubject = new Subject<String[]>();

  constructor(private commonService: CommonService) {
  }

  emitCategories() {
    this.categoriesSubject.next(this.categories);
  }

  emitFoodsName() {
    this.foodsNameSubject.next(this.foodsName);
  }

  updateCategorie(newCategory: Category, oldCategory: Category, newPhotoUploaded: boolean) {
    console.log('service updateCategorie');
    return new Promise(resolve => {
      if (newCategory.catName !== oldCategory.catName) {
        this.createNewCategory(newCategory);
        this.deleteSingleCategory(oldCategory, false);
        // on met à jour le nom de categeorie pour chaque aliment associé
        newCategory.foods.forEach((foodName) => {
          const updateCatName = {};
          updateCatName['categoryName'] = newCategory.catName;
          firebase.database().ref('/foods/').child(foodName).update(updateCatName);
        });
      } else {
        const updates = {};
        updates['catName'] = newCategory.catName;
        if (newPhotoUploaded && newCategory.photo) {
          updates['photo'] = newCategory.photo;
        }
        firebase.database().ref('/categories/').child(newCategory.catName).update(updates).then(
          value => {
            console.log('mise a jour de ' + newCategory.catName);
          },
          erreur => {
            console.log('erreur sur l\'update' + erreur);
          }
        );
        this.commonService.deletePhoto(newPhotoUploaded, oldCategory.photo);
      }
      resolve(true);
    });
    this.emitCategories();
  }

  addFoodToCategory(newFood: Food, oldFood: Food): Promise<boolean> {
    console.log('Service addFoodToCategory()...');

    let update: boolean;
    if (this.commonService.isNotNullOrEmpty(newFood.categoryName)) {
      if (!this.commonService.isNotNullOrEmpty(oldFood.categoryName)) {
        update = true;
      } else if (oldFood.categoryName !== newFood.categoryName) {
        update = true;
      }
    }
    if (update) {
      if (!this.categories.get(newFood.categoryName).foods) {
        this.categories.get(newFood.categoryName).foods = [];
      }
      this.categories.get(newFood.categoryName).foods.push(newFood.foodName);
      return new Promise(
        (resolve) => {
          firebase.database().ref('/categories/').child(newFood.categoryName).
          child('foods').update(this.categories.get(newFood.categoryName).foods).then(
            value => {
              console.log('mise a jour de ' + newFood.categoryName);
              // cas : si l'ancienne categorie est remplacée par une nouvelle : suppr de l'ancienne
              if (oldFood.categoryName !== newFood.categoryName) {
                this.deleteFoodNameFromCategory(oldFood);
              }
              this.emitCategories();
              resolve(true);
            },
            erreur => {
              console.log('erreur sur l\'update ' + erreur);
            });
        });
    }
  }

  fetchCategories() {
    const mapLocal = new Map<string, Category>();
    firebase.database().ref('/categories').on(
      'value', (data) => {
        data.forEach(entry => {
          mapLocal.set(entry.key, entry.val() as Category);
        });
        this.categories = mapLocal;
        this.emitCategories();
      }
    );
  }

  fetchSingleCategory(categoryName: string): Promise<Category> {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/categories/').child(categoryName).once('value').then(
          (data) => {
            const category = <Category> data.val();
              if (category && !category.foods) {
                category.foods = [];
            }
            resolve(category);
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewCategory(category: Category) {
    console.log('service createNewCategory');
    return new Promise(resolve => {
      this.categories.set(category.catName, category);
      firebase.database().ref('/categories/').child(category.catName).set(category);
      resolve(true);
      this.emitCategories();
    });
  }

  deleteSingleCategory(category: Category, deletePhoto: boolean): Promise<boolean> {
    console.log('service deleteSingleCategory');
    return new Promise(resolve => {
        if (deletePhoto && category.photo) {
          console.log('category.photo : ' + category.photo);
          const refImage = firebase.storage().refFromURL(category.photo);
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
        firebase.database().ref('/categories/').child(category.catName).remove().then(
          value => {
            this.categories.delete(category.catName);
            this.emitCategories();
            resolve(true);
          });
      });
  }

  fetchFoodsNameFromCategory(categoryName: string) {
    console.log('service fetchFoodsNameFromCategory');
    const foodListName = [];
    firebase.database().ref('/categories/').child(categoryName).child('/foods/').once(
      'value', (data) => {
        data.forEach(function (elmt) {
          foodListName.push(elmt.val());
        });
        this.foodsName = foodListName;
        this.emitFoodsName();
      });
  }

  deleteFoodNameFromCategory(food: Food) {
    console.log('service deleteFoodNameFromCategory');
    if (food.categoryName) {
      const foodIndex = this.categories.get(food.categoryName).foods.indexOf(food.foodName);
      this.categories.get(food.categoryName).foods.splice(foodIndex, 1);
      firebase.database().ref('/categories/').child(food.categoryName).child('/foods/').set(this.categories.get(food.categoryName).foods);
      this.foodsName.splice(foodIndex, 1);
      this.emitFoodsName();
    }
  }



}
