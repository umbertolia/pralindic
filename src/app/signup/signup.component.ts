import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthentificationService} from '../services/authentification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signun',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthentificationService,
              private router: Router) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signUpForm =  this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
      });
  }

  onSubmit() {
    const email = this.signUpForm.get('email').value;
    const pwd = this.signUpForm.get('password').value;
    this.authService.createNewUer(email, pwd).then(
      () => {
        this.router.navigate(['/manager']);
      },
      (erreur) => {
        this.errorMessage = erreur;
      }
    );
  }
}
