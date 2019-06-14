import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../services/category.service';
import {Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {FoodService} from '../../services/food.service';
import {chechCategoryName} from '../../validators/categorie.validator';

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

  constructor(private foodBuilder: FormBuilder,
              private foodService: FoodService,
              private router: Router, private commonService: CommonService) { }

  ngOnInit() {
    this.initForm();
    this.fileUrl = 'assets/images/icon_add_photo.png';
  }

  private initForm() {
    this.foodForm = this.foodBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/[a-zA-Z]/)]],
        glycemicValue: ['', [Validators.required, Validators.pattern(/^[+]?\d*$/)]],
        pralValue: ['', [Validators.required, Validators.pattern(/^[+]?\d*$/)]]
      });
  }

  onSubmit() {

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

}
