import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {CategoryService} from '../services/category.service';
import {Food} from '../models/food.model';
import {FoodService} from '../services/food.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-food-manager',
  templateUrl: './food-manager.component.html',
  styleUrls: ['./food-manager.component.scss']
})
export class FoodManagerComponent implements OnInit, OnDestroy {

  categories: Map<string, Category>;
  foods: Map<string, Food>;
  selectedFoods: string[];
  panelsOpened: Map<string, boolean>;

  constructor(private categoryService: CategoryService,
              private foodService: FoodService) { }

  ngOnInit() {
    this.getCategoriesAndFoods();
    this.panelsOpened = new Map<string, boolean>();
  }

  private getCategoriesAndFoods() {
    of(this.categoryService.categoriesSubject.subscribe(
      (categoryList: Map<string, Category>) => {
        this.categories = categoryList;
      }));
    of(this.foodService.foodsSubject.subscribe(
      (foodList: Map<string, Food>) => {
        this.foods = foodList;
      }));
    this.categoryService.fetchCategories();
    this.foodService.fetchFoods();
  }

  managerFoodsCard() {
    console.log('foods selected size : ' + this.selectedFoods.length);
  }

  ngOnDestroy() {
  }

}
