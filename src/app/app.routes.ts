import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';

export const routes: Routes = [
    { path: '', component: LayoutComponent, children: [
        { path: '', component: SearchComponent },
        { path: 'profile', component: ProfilePageComponent }
    ]},
    { path: 'login', component: LoginPageComponent }
];
