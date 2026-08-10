import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../data/services/profile.service';
import { Profile } from '../../data/services/interfaces/profile.interface';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';

@Component({
  selector: 'app-search',
  imports: [ProfileCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{
    profileService = inject(ProfileService);
    profiles: Profile[]= [];
    errorMessage = signal<string | null>(null)

  ngOnInit():void{
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
