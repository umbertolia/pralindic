import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Food} from '../models/food.model';
import {Router} from '@angular/router';
import {FoodService} from '../services/food.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit, OnDestroy {

  foods: Food[];
  foodsSubscription: Subscription;

  constructor(private foodService: FoodService, private router: Router) { }

  ngOnInit() {
    this.foodsSubscription = this.foodService.foodsSubject.subscribe(
      (foodList: Food[]) => {
        console.log('foodList : ' + foodList);
        this.foods = foodList;
      }
    );
    this.foodService.fetchFoods();
  }

  onNewFood() {
    this.router.navigate(['/foods', 'new']);
  }

  onDeleteFood(food: Food) {
    this.foodService.deleteSingleFood(food);
  }

  onEditFood(idFood: number) {
    this.router.navigate(['/foods', 'edit', idFood]);
  }

  ngOnDestroy() {
    this.foodsSubscription.unsubscribe();
  }

}
