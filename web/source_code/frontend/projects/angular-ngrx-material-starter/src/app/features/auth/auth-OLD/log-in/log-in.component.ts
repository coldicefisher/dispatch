import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../../../../core/jch-models/user';
import { AppState } from '../../../../core/core.module';
import { actionLogin } from '../../../../core/jch-store/auth/actions';
import { Observable } from 'rxjs';
import { selectAuthState } from '../../../../core/jch-store/auth/selectors';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-Login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  getState: Observable<any>;
  errorMessage: string | null;
  username: string | null;

  constructor(
    private store: Store<AppState>
  ) {
    this.getState = this.store.select('auth');
  }

  ngOnInit() {
    this.getState.subscribe((state) => {
      this.username = state.username;
      this.errorMessage = state.errorMessage;
    });
  }

  onSubmit(): void {
    const payload = {
      username: this.username,
      password: this.user.password
    };
    console.log('dispatching Login action with the following payload', payload);
    this.store.dispatch(actionLogin(payload));
  }
}
