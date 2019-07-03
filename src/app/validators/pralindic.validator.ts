import {Category} from '../models/category.model';
import {AbstractControl, ValidatorFn} from '@angular/forms';
import {Food} from '../models/food.model';

export function chechCategoryName(listeCat: Map<string, Category>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const catName = control.value;
    let catExists: boolean;
    if (!catName.toString().isEmpty && listeCat) {
      listeCat.forEach((value: Category, key: string) => {
        console.log(key, value);
        if (value.catName === catName) {
          return (catExists = true);
        }
      });
      return catExists ? {forbiddenNameCat: true} : null;
    }
  };
}

export function chechFoodName(foods: Food[], createMode): ValidatorFn {
  if (createMode) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const foodName = control.value;
      let foodNameExists: boolean;
      if (!foodName.toString().isEmpty && foods) {
        for (let i = 0; i < foods.length && !foodNameExists; i++) {
          if (foods[i].foodName === foodName) {
            foodNameExists = true;
          }
        }
      }
      return foodNameExists ? {forbiddenNameFood: true} : null;
    };
  }
}



