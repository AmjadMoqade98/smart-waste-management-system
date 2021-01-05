import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {share} from 'rxjs/operators';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  activeFragment = this.route.fragment.pipe(share());
  username;
  constructor(private authService: AuthService, private router: Router , public route: ActivatedRoute) {
    this.authService.currentUser.subscribe(value => {
      this.username = value.username;
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.destroyToken();
    this.router.navigateByUrl('/');
  }
}
