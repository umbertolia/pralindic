import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {Subscription} from 'rxjs';
import {CategoryService} from '../services/category.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Category[];
  categoriesSubscription: Subscription;

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit() {
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe(
      (catList: Category[]) => {
        console.log('catliste : ' + catList);
        this.categories = catList;
      }
    );
     this.categoryService.fetchCategories();
  }

  onNewCategory() {
    this.router.navigate(['/categories', 'new']);
  }

  onDeleteCategory(category: Category) {
    this.categoryService.deleteSingleCategory(category);
  }

  onEditCategory(idCat: number) {
    this.router.navigate(['/categories', 'edit', idCat]);
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }
}
