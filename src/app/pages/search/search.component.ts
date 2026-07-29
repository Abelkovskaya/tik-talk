import { Component, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { Profile } from '../../data/services/interfaces/profile.interface';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';

@Component({
  selector: 'app-search',
  imports: [ProfileCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
    profileService = inject(ProfileService);
    profiles: Profile[]= [];

  constructor(){
    this.profileService.getTestAccounts()
      .subscribe( val => {
        this.profiles = val});
  }
}
