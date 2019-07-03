import {Component, OnInit} from '@angular/core';
import {Category} from '../../models/category.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../services/category.service';
import {CommonService} from '../../services/common.service';
import {AppConstants} from '../../common/constantes';
import {Subscription} from 'rxjs';
import * as deepEqual from 'deep-equal';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  category: Category;
  fileUrl: string;
  fileToUpload: File = null;
  oldFileUrl: string;
  foodsSubscription: Subscription;
  oldCategory: Category;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService,
              private commonService: CommonService) {

  }

  ngOnInit() {
    this.category = new Category('');
    const categoryName = this.route.snapshot.params['categoryName'];
    this.getSingleCategory(categoryName);
  }

  onPrevious() {
    this.router.navigate(['/categories']);
  }

  onSelectFiles(event) {
    if (event.target.files[0]) {
      this.fileToUpload = event.target.files[0];
      // image preview
      const reader = new FileReader();
      reader.onload = (evenemnt: any) => {
        this.fileUrl = evenemnt.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    }
    this.fileToUpload =  event.target.files[0];
  }

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

  getAvatarStyles() {
    const styles = {
      'background-size': 'cover',
      'background-image': 'url(' + this.fileUrl + ')'
    };
    return styles;
  }

  private getSingleCategory(categoryName: string) {
    this.categoryService.fetchSingleCategory(categoryName).then(
      (category: Category) => {
        this.category = { ...category};
        this.oldCategory = { ...category};
        this.fileUrl = this.category.photo ? this.category.photo : AppConstants.getIconAddPhoto();
        this.foodsSubscription = this.categoryService.foodsNameSubject.subscribe(
          (foodsName: string[]) => {
            this.category.foods = foodsName;
          }
        );
        this.categoryService.fetchFoodsNameFromCategory(categoryName);
        console.log('foods size from category : ' + this.category.foods.length);
      },
      (error) => {
        console.log('Impossible de récupérer la catégorie ' + categoryName);
      }
    );
  }
}
