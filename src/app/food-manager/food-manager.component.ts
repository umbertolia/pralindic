import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {CategoryService} from '../services/category.service';
import {Food} from '../models/food.model';
import {FoodService} from '../services/food.service';
import { of } from 'rxjs';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-food-manager',
  templateUrl: './food-manager.component.html',
  styleUrls: ['./food-manager.component.scss']
})
export class FoodManagerComponent implements OnInit, OnDestroy {

  categories: Map<string, Category>;
  foods: Map<string, Food>;
  selectedFoods: Food[] = [];
  backgroundTile: Map<string, boolean>;
  panelsHidden: Map<string, boolean>;

  constructor(private categoryService: CategoryService,
              private foodService: FoodService,
              private commonService: CommonService) { }

  ngOnInit() {
    this.getCategoriesAndFoods();
    this.backgroundTile = new  Map<string, boolean>();
    this.panelsHidden = new  Map<string, boolean>();
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


  ngOnDestroy() {
  }

  filterFoodsByCategory(categoryName: string): Map<string, Food> {
    const newMap = new Map<string, Food>();
    if (this.foods) {
      this.foods.forEach((foodBase: Food) => {
        if (foodBase.categoryName === categoryName) {
          newMap.set(foodBase.foodName, foodBase);
        }
      });
    }
    return newMap;
  }

  addFoodToCart(food: Food) {
    if (!this.selectedFoods.includes(food)) {
    this.selectedFoods.push(food);
    }
  }

  removeFoodFromCart(food: Food) {
    if (this.selectedFoods.includes(food)) {
      this.selectedFoods = this.selectedFoods.filter(foodSelected => {
        return foodSelected.foodName !== food.foodName;
      });
    }
  }

  setBackgroundTile(foodName: string, state: boolean) {
    this.backgroundTile.set(foodName, state);
  }

  getCardStyle(food: Food) {
    const styles = {};
    if (this.backgroundTile.get(food.foodName)) {
      styles['background-color'] = 'rgb(230, 230, 230)';
    } else {
      styles['background-color'] = 'white';
    }
    return styles;
  }

  onHideOthersPanels(category: Category, event: boolean) {
    // cas le panneau est déployé
    if (event) {
      this.categories.forEach(
        catBase => {
          catBase.catName !== category.catName ? this.panelsHidden.set(catBase.catName, true) : this.panelsHidden.set(catBase.catName, false);
        });
    } else {
      this.categories.forEach(
        catBase => { this.panelsHidden.set(catBase.catName, false);
        });
    }
  }
}
