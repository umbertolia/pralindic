import {Component, Input, OnInit} from '@angular/core';
import {Food} from '../../models/food.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {FoodService} from '../../services/food.service';
import {AppConstants} from '../../common/constantes';
import {CategoryEditComponent} from '../../category-list/category-edit/category-edit.component';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss']
})

export class FoodEditComponent implements OnInit {

  food: Food;
  fileUrl: string;
  oldFood: Food;
  @Input() foodName;
  @Input() editionMode = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private foodService: FoodService,
              private commonService: CommonService
  ) {}

  ngOnInit() {
    this.food = new Food('', 0, 0);
    if (this.route.component === CategoryEditComponent && Boolean(this.foodName)) {
        console.log('appel depuis le composant CategoryEditComponent');
        this.getSingleFood(this.foodName);
    } else {
      const foodName = this.route.snapshot.params['foodName'];
      this.getSingleFood(foodName);
    }
  }

  private getSingleFood(foodName: string) {
    this.foodService.fetchSingleFood(foodName).then(
      (foodBase: Food) => {
        this.food = { ...foodBase};
        this.oldFood = { ...foodBase};
        this.fileUrl = this.food.photo ? this.food.photo : AppConstants.getIconAddPhoto();
      },
      (error) => {
        console.log('Impossib le de récupérer l\'aliment ' + foodName + 'erreur : ' + error);
      }
    );
  }

  onEditFood(food: Food) {
    const params = {};
    params['createMode'] = false;
    params['foodName'] = food.foodName;
    this.router.navigate(['/foods', 'new'], {queryParams : params });
  }

  onDeleteFood(food: Food) {
    this.foodService.deleteSingleFood(food);
  }

}
