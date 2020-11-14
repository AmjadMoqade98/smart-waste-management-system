import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authType = '';
  title = '';
  isSubmitting = false;
  authForm: FormGroup;
  errors: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
      this.authType = this.router.url.replace('/' , '');
      console.log(this.authType);
      this.title = (this.authType === '/login') ? 'Sign in' : 'Sign up';
      if (this.authType === 'register') {
        this.authForm.addControl('email', new FormControl());
      }
  }
  submitForm(): void {
    this.isSubmitting = true;
    const credentials = this.authForm.value;
    this.authService
      .tryLogin(this.authType, credentials);

    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigateByUrl('/');
    }, 2000);

    // .subscribe(
    //   data => this.router.navigateByUrl('/'),
    //   err => {
    //     console.log(err)
    //     this.errors = err;
    //     this.isSubmitting = false;
    //   }
    // );
  }
}
