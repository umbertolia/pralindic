import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {FoodService} from '../../services/food.service';
import {Subscription} from 'rxjs';
import {Category} from '../../models/category.model';
import {Food} from '../../models/food.model';
import {chechFoodName} from '../../validators/pralindic.validator';
import {AppConstants} from '../../common/constantes';
import * as deepEqual from 'deep-equal';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss']
})
export class FoodFormComponent implements OnInit {

  foodForm: FormGroup;
  errorMessage: string;
  fileUrl: string;
  fileToUpload: File = null;
  categoriesSubscription: Subscription;
  foodsSubscription: Subscription;
  foods: Food[] = [];
  categories =  new Map<string, Category>();
  currentFood: Food;
  createMode: boolean;

  constructor(private foodBuilder: FormBuilder,
              private foodService: FoodService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router, private commonService: CommonService) {
    this.currentFood = new Food('', 0, 0);
    this.createMode = true;
  }

  ngOnInit() {
    this.getFoodFromRoute();
    this.getCategoriesList();
    this.getFoods();
    this.initForm();
  }

  initForm() {
    this.foodForm = this.foodBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/[a-zA-Z]/), chechFoodName(this.foods, this.createMode)]],
        glycemicValue: [0, [Validators.required, Validators.pattern(/^[+]?\d*$/)]],
        pralValue: [0, [Validators.required, Validators.pattern(/^[+]?\d*$/)]],
        categoriesControl: ['']
      });
    this.fileUrl = AppConstants.getIconAddPhoto();
  }

  async onSubmit() {
    let newPhotoUploaded: boolean;
    const newFood = new Food(
      this.foodForm.get('name').value,
      this.foodForm.get('glycemicValue').value,
      this.foodForm.get('pralValue').value
    );
    if (this.fileToUpload) {
      await this.uploadFile(this.fileToUpload, newFood.constructor.name.concat('_').concat(newFood.foodName));
      newPhotoUploaded = true;
    }
    if (this.fileUrl && this.fileUrl.length > 0 && this.fileToUpload) {
      newFood.photo = this.fileUrl;
    }
    if (this.commonService.isAbstractControlNotEmpty(this.foodForm.get('categoriesControl'))) {
      newFood.categoryName = this.foodForm.get('categoriesControl').value;
    }

    if (this.createMode) {
      // food create
      this.foodService.createNewFood(newFood).then(
        foodAdded => {
            // mise a jour de la categorie avec l'aliment
            this.categoryService.addFoodToCategory(newFood, this.currentFood);
        });
    } else if (!deepEqual(newFood, this.currentFood)) {
      // food update
      this.foodService.updateFood(newFood, this.currentFood, newPhotoUploaded).then(
        () => {
            // mise a jour de la categorie avec l'aliment
            this.categoryService.addFoodToCategory(newFood, this.currentFood);
        });
    }
    this.router.navigate(['/foods']);
  }

  async uploadFile(file: File, additionalString: string) {
    await this.commonService.uploadFile(file, additionalString).then(
      (url: string) => {
        this.fileUrl = url;
      }
    );
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

  getCategoriesList() {
    this.categoriesSubscription = this.categoryService.categoriesSubject.subscribe(
      (categoryList: Map<string, Category>) => {
        this.categories = categoryList;
      }
    );
    this.categoryService.fetchCategories();
  }

  getFoods() {
    this.foodsSubscription = this.foodService.foodsSubject.subscribe(
      (foodListe: Map<string, Food>) => {
        if (Boolean(foodListe)) {
          foodListe.forEach((value: Food, key: string) => {
            this.foods.push(value);
          });
        }
      }
    );
    this.foodService.fetchFoods();
  }

  getFoodFromRoute() {
    this.getOptionalParamsFromRoute().then((params: Map<string, string>) => {
      if (params != null && params.size > 0) {
        this.foodService.fetchSingleFood(params.get('foodName')).then((foodBase: Food) => {
          this.currentFood = foodBase != null ?  { ...foodBase} :  new Food('', 0, 0);
          this.fileUrl = this.currentFood.photo ? this.currentFood.photo : AppConstants.getIconAddPhoto();
            try {
              this.createMode =  Boolean(JSON.parse(params.get('createMode')));
            } catch (error) {
              console.log('Erreur sur le JSON.parse()');
            }
          },
          reason => {
            console.log('Aucun aliment avec le nom : ' + params['foodName']);
          });
      }
    });
  }

  getOptionalParamsFromRoute(): Promise<Map<string, Object>> {
    const params = new Map;
    return  new Promise(resolve => {
      this.route.queryParamMap.subscribe(queryParams => {
        if (queryParams.keys.length > 0) {
          params.set('createMode', queryParams.get('createMode'));
          params.set('foodName', queryParams.get('foodName'));
        }
        resolve(params);
      });
    });
  }
}
