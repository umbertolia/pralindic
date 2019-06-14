import {Category} from '../models/category.model';
import {AbstractControl, ValidatorFn} from '@angular/forms';

export function chechCategoryName(listeCat: Category[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const catName = control.value;
    let catExists: boolean;
    if (!catName.toString().isEmpty && listeCat) {
      for (let i = 0; i < listeCat.length && !catExists; i++) {
        if (listeCat[i].catName === catName) {
          catExists = true;
        }
      }
    }
    return catExists ? {forbiddenNameCat : true} : null;
  };
}


