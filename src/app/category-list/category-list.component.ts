import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {Subscription} from 'rxjs';
import {FoodService} from '../services/food.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Category[];
  categoriesSubscription: Subscription;

  constructor(private foodService: FoodService, private router: Router) { }

  ngOnInit() {
    this.categoriesSubscription = this.foodService.categoriesSubject.subscribe(
      (catList: Category[]) => {
        console.log('catliste : ' + catList);
        this.categories = catList;
      }
    );
     this.foodService.fetchCategories();
  }

  onNewCategory() {
    this.router.navigate(['/categories', 'new']);
  }

  onDeleteCategory(category: Category) {
    this.foodService.deleteSingleCategory(category);
  }

  onEditCategory(idCat: number) {
    this.router.navigate(['/categories', 'edit', idCat]);
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }
}
