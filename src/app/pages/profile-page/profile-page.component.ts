import { Component, inject } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs' ;
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';
import { ImageUrlPipe } from '../../helpers/pipes/image-url.pipe';
import { PostFeedComponent } from './post-feed/post-feed.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeaderComponent, 
    AsyncPipe, 
    RouterLink, 
    SvgIconComponent, 
    ImageUrlPipe, 
    PostFeedComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(6);

  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        if(id === 'me') return this.me$;

        return this.profileService.getAccount(id);
      })
    )

  isMyProfile$ = this.route.params
    .pipe(
      map(({id}) => id === 'me')
    )  
}
