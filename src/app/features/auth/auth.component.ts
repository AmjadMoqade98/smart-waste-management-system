import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../core/services/auth/auth.service';
import {skip} from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
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
  }
  submitForm(): void {
    this.isSubmitting = true;
    const credentials = this.authForm.value;
    this.authService.tryLogin(credentials);
    this.authService.isAdmin.pipe(skip(1)).subscribe(value => {
      this.isSubmitting = false;
      if (value === true) {
        this.router.navigateByUrl('/');
      }else {
        this.errors = 'incorrect username or password';
      }
    });
  }
}
