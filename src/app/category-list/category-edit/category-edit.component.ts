import {Component, NgModule, OnInit} from '@angular/core';
import {Category} from '../../models/category.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../services/category.service';
import {CommonService} from '../../services/common.service';
import {AppConstants} from '../../common/constantes';
import {Subscription} from 'rxjs';
import * as deepEqual from 'deep-equal';
import {MaterialModule} from '../../common/material.module';


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})

@NgModule({
  imports: [
    MaterialModule
  ],
  exports: [
    MaterialModule
  ]
})

export class CategoryEditComponent implements OnInit {

  category: Category;
  fileUrl: string;
  fileToUpload: File = null;
  foodsSubscription: Subscription;
  oldCategory: Category;
  panelOpenState = false;
  messages: boolean[] = [];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService,
              private commonService: CommonService) {

  }

  ngOnInit() {
    this.category = new Category('');
    const categoryName = this.route.snapshot.params['categoryName'];
    this.addSubscribers();
    this.getSingleCategory(categoryName);
    this.fileUrl = AppConstants.getIconAddPhoto();
  }

  onPrevious() {
    this.router.navigate(['/categories']);
  }

  onSelectFiles(event) {
    console.log('fileUrl : ' + this.fileUrl);
    if (event.target.files[0]) {
      this.fileToUpload = event.target.files[0];
      // image preview
      const reader = new FileReader();
      reader.readAsDataURL(this.fileToUpload);
      reader.onload = (evenemnt: any) => {
         this.fileUrl = reader.result;
      };
    }
    console.log('fileUrl : ' + this.fileUrl);
  }


 /* onSelectFiles(event) {
    console.log('fileUrl : ' + this.fileUrl);
   this.commonService.onSelectFiles(event, this.fileToUpload, this.fileUrl);
   console.log('fileUrl : ' + this.fileUrl);
  }*/

  async valider() {
    let newPhotoUploaded: boolean;
    if (this.fileToUpload) {
      await this.uploadFile(this.fileToUpload);
      newPhotoUploaded = true;
    }
    if (this.fileUrl && this.fileUrl.length > 0) {
      this.category.photo = this.fileUrl;
    }
    if (!deepEqual(this.category, this.oldCategory)) {
      this.categoryService.updateCategorie(this.category, this.oldCategory, newPhotoUploaded);
      this.router.navigate(['/categories']);
    }
  }

  async uploadFile(file: File) {
    await this.commonService.uploadFile(file, this.category.constructor.name.concat('_').concat(this.category.catName)).then(
      (url: string) => {
        this.fileUrl = url;
      });
  }



  private getSingleCategory(categoryName: string) {
    this.categoryService.fetchSingleCategory(categoryName).then(
      (category: Category) => {
        this.category = { ...category};
        this.oldCategory = { ...category};
        this.fileUrl = this.category.photo ? this.category.photo : AppConstants.getIconAddPhoto();
        this.categoryService.fetchFoodsNameFromCategory(categoryName);
        console.log('foods size from category : ' + this.category.foods.length);
      },
      (error) => {
        console.log('Impossible de récupérer la catégorie ' + categoryName);
      }
    );
  }

  private addSubscribers() {
    this.foodsSubscription = this.categoryService.foodsNameSubject.subscribe(
      (foodsName: string[]) => {
        this.category.foods = foodsName;
      }
    );
  }

  showMessage(index: number) {
    this.messages[index] = true;
  }

  hideMessage(index: number) {
    this.messages[index] = false;
  }
}
