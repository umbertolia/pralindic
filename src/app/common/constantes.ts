import {Injectable} from '@angular/core';

@Injectable()
export class AppConstants {

  public static getJsonFileLocation(): string {
    return './assets/json/foods.json';
  }

  public static getIconAddPhoto(): string {
    return 'assets/images/icon_add_photo.png';
  }
}
