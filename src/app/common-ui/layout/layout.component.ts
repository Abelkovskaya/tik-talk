import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProfileService } from '../../data/services/profile.service';
import { Profile } from '../../data/services/interfaces/profile.interface';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  profileService = inject(ProfileService);
  profile: Profile | null = null;
  errorMessage = signal<string | null>(null)


  ngOnInit():void{
    this.profileService.getMe().subscribe({
      next: (val) => this.profile = val,
      error: (err) => {
        console.log(err)
        this.errorMessage.set(
          err.status === 401
          ? 'Неверный логин или пароль'
          : 'Что-то пошло не так, попробуйте позже'
        );
      }
    })
  }

}
