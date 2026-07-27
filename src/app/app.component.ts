import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileCardComponent } from "./common-ui/profile-card/profile-card.component";
import { ProfileService } from './data/services/profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProfileCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tik-talk';
  profileService = inject(ProfileService);
  profiles: any = [];

  constructor(){
    this.profileService.getTestAccounts()
      .subscribe( val => {
        this.profiles = val});
  }
}
