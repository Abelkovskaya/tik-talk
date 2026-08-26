import { Component } from '@angular/core';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component'

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {

  fileBrowserHandler(event: Event){
    const file = (event.target as HTMLInputElement)?.files?.[0];

    if(!file) return;
  }

}
