import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {share} from 'rxjs/operators';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  activeFragment = this.route.fragment.pipe(share());
  constructor(private authService: AuthService, private router: Router , public route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.destroyToken();
    this.router.navigateByUrl('/');
  }
}
