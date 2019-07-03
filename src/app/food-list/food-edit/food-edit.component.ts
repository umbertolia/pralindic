import {Component, Input, OnInit} from '@angular/core';
import {Food} from '../../models/food.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {FoodService} from '../../services/food.service';
import {AppConstants} from '../../common/constantes';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/category.model';
import {CategoryEditComponent} from '../../category-list/category-edit/category-edit.component';
import * as deepEqual from 'deep-equal';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss']
})

export class FoodEditComponent implements OnInit {

  food: Food;
  fileUrl: string;
  fileToUpload: File = null;
  oldFood: Food;
  category: Category;
  @Input() foodName;
  @Input() editionMode = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private foodService: FoodService,
              private commonService: CommonService,
              private categoryService: CategoryService) {

  }

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

  onPrevious() {
    this.router.navigate(['/foods']);
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
      this.food.photo = this.fileUrl;
    }
    if (!deepEqual(this.food, this.oldFood)) {
      const result = this.foodService.updateFood(this.food, this.oldFood, newPhotoUploaded);

      console.log('retour de l\'update : ' + result);
      this.router.navigate(['/foods']);
    }
  }

  async uploadFile(file: File) {
    await this.commonService.uploadFile(file, this.food.constructor.name.concat('_').concat(this.food.foodName)).then(
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

  private getSingleFood(foodName: string) {
    this.foodService.fetchSingleFood(foodName).then(
      (foodBase: Food) => {
        this.food = { ...foodBase};
        this.oldFood = { ...foodBase};
        this.fileUrl = this.food.photo ? this.food.photo : AppConstants.getIconAddPhoto();
        // recup de la catégorie
        if (this.commonService.isNotNullOrEmpty(foodBase.categoryName)) {
          this.categoryService.fetchSingleCategory(foodBase.categoryName).then(
            (category: Category) => {
              this.category = category;
            });
        }
      },
      (error) => {
        console.log('Impossible de récupérer l\'aliment ' + foodName);
      }
    );
  }

  callFoodForm() {
    const params = {};
    params['createMode'] = false;
    params['foodName'] = this.food.foodName;
    this.router.navigate(['/foods', 'new'], {queryParams : params });
  }

}
