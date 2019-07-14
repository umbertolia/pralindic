import {Component, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {Subscription} from 'rxjs';
import {CategoryService} from '../services/category.service';

@Component({
  selector: 'app-food-manager',
  templateUrl: './food-manager.component.html',
  styleUrls: ['./food-manager.component.scss']
})
export class FoodManagerComponent implements OnInit {

  categories: Map<string, Category>;
  categoriesSubscription: Subscription;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe(
    (categoryList: Map<string, Category>) => {
      this.categories = categoryList;
    });
    this.categoryService.fetchCategories();
  }

}
