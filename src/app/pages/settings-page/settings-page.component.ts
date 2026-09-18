import { Component, effect, inject, ViewChild } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service'
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component'

@Component({
  selector: 'app-settings-page',
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

  fb = inject(FormBuilder)
  profileService = inject(ProfileService);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  router = inject(Router);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: ['']
  })

  constructor(){
    effect( () => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack)
      }) 
    })
  }

  ngAfterViewInit(){
    
  }

  async onSave(){
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity();

    if(this.form.invalid) return;

    try {
      if(this.avatarUploader.avatar){
        const updated = await firstValueFrom(
          this.profileService.uploadAvatar(this.avatarUploader.avatar)
        );

        if(updated?.avatarUrl){
          await this.waitForImage(updated.avatarUrl);
        }
      }

      //@ts-ignore
      await firstValueFrom(this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack)
      }));

      this.router.navigate(['/profile/me']);
    } catch (err) {
      console.error('Не удалось сохранить профиль', err);
    }
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if(!stack) return [];
    if(Array.isArray(stack)) return stack;

    return stack.split(',').map(item => item.trim());
  }

  mergeStack(stack: string | null | string[]) {
    if(!stack) return '';
    if(Array.isArray(stack)) return stack.join(',');

    return stack;
  }

  private waitForImage(url: string, maxAttempts = 10, delayMs = 500): Promise<void> {
    return new Promise((resolve) => {
      let attempts = 0;

      const tryLoad = () => {
        attempts++;
        const img = new Image();

        img.onload = () => resolve();
        img.onerror = () => {
          if(attempts >= maxAttempts){
            resolve();
            return;
          }
          setTimeout(tryLoad, delayMs);
        };

        img.src = `${url}?t=${Date.now()}`;
      };

      tryLoad();
    });
  }
}