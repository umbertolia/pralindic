import {Category} from './category.model';

export class Food {
  photo: string;
  price: number;
  glycemicIndex: number;
  pralIndex: number;


  constructor(public foodName: string, public category: Category) {

  }
}
