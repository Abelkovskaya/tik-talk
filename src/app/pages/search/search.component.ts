import { Component, inject, signal } from '@angular/core';
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
    errorMessage = signal<string | null>(null)

  ngOnInit(){
    this.loadProfiles();
  }

  loadProfiles():void{

    this.errorMessage.set(null);
    this.profileService.getTestAccounts()
      .subscribe({
        next: (val) => {
          this.profiles = val;
        },
        error: (err) => {
          console.log(err);
          this.errorMessage.set('Не удалось загрузить профили. Проверьте подключение к интернету')
        }
      });

  }

}
