import {Component, OnDestroy, OnInit, NgModule, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Food} from '../models/food.model';
import {Router} from '@angular/router';
import {FoodService} from '../services/food.service';
import {MaterialModule} from '../common/material.module';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CommonService} from '../services/common.service';
import {AppConstants} from '../common/constantes';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})

@NgModule({
  imports: [
    MaterialModule
  ],
  exports: [
    MaterialModule
  ]
})
export class FoodListComponent implements OnInit, OnDestroy {

  foods: Map<string, Food>;
  foodsSubscription: Subscription;
  displayedColumns: string[] = ['foodName', 'glycemicIndex', 'pralIndex', 'favorite', 'icon'];
  dataSource: MatTableDataSource<Food[]>;
  jsonFileSubscription: Subscription;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private foodService: FoodService,
              private router: Router,
              private commonService: CommonService) { }

  ngOnInit() {
    this.foodsSubscription = this.foodService.foodsSubject.subscribe(
      (foodList: Map<string, Food>) => {
        console.log('foodList size : ' + foodList.size);
        this.foods = foodList;
        this.dataSource = new MatTableDataSource(this.commonService.getArrayFromMap(this.foods));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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


  ngOnDestroy() {
    this.foodsSubscription.unsubscribe();
    if (this.jsonFileSubscription) {
      this.jsonFileSubscription.unsubscribe();
    }
  }

  onRowClick(food: Food) {
    const params = {};
    params['createMode'] = false;
    params['foodName'] = food.foodName;
    this.router.navigate(['/foods', 'new'], {queryParams : params });
  }

  onReinitFoods() {
    this.getFoodsFromJson();
  }

  getFoodsFromJson(): Promise<any> {
    return new Promise<string>(resolve => {
      this.jsonFileSubscription = this.commonService.getJSON(AppConstants.getJsonFileLocation()).subscribe(data => {
        const foodArray = [];
        for (let i = 0; i < data.foods.length; i++) {
          foodArray.push(new Food(data.foods[i].foodName, data.foods[i].glycemicIndex, data.foods[i].pralIndex));
        }
        this.dataSource = new MatTableDataSource(foodArray);
        return this.dataSource;
      }, erreur => {
        console.log('erreur de lecture sur le fichierJson : ' + erreur);
      });
    });
  }

  onFavorite(foodRow: Food) {
    // on enregistre en base la mise a jour Favorite
    this.foods.forEach(foodBase => {
      if (foodBase.foodName === foodRow.foodName) {
        const oldFood = { ...foodBase};
        const newFood = { ...foodBase};
        newFood.favorite =  !newFood.favorite;
        this.foodService.updateFood(newFood, oldFood, false);
      }
    });
  }
}
