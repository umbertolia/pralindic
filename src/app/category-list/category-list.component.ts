import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {Subscription} from 'rxjs';
import {CategoryService} from '../services/category.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material';
import {FoodService} from '../services/food.service';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Map<string, Category>;
  categoriesSubscription: Subscription;
  displayedColumns: string[] = ['catName', 'icon'];
  dataSource: MatTableDataSource<Category>;



  constructor(private categoryService: CategoryService,
              private foodService: FoodService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit() {
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe(
      (categoryList: Map<string, Category>) => {
        this.categories = categoryList;
        this.dataSource = new MatTableDataSource(this.commonService.getArrayFromMap(this.categories));
      }
    );
     this.categoryService.fetchCategories();
  }

  onNewCategory() {
    this.router.navigate(['/categories', 'new']);
  }

  onDeleteCategory(category: Category) {
    this.categoryService.deleteSingleCategory(category).then(
      (catDeleted: boolean) => {
        if (catDeleted && category.foods) {
          // on supprime son nom pour chaque aliment associé
          this.foodService.deleteCategoryIndexFromFoods(category.foods);
        }
      }
    );
  }

  onRowClick(category: Category) {
    this.router.navigate(['/categories', 'edit', category.catName]);
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }
}
