import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainPageComponent } from './features/main/main-page.component';
import { CitySpotsComponent } from './features/city/city-spots.component/city-spots.component';

export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent
    },
    {
        path: 'register',
        pathMatch: 'full',
        component: RegisterComponent
    },
    {
        path: '',
        pathMatch: 'full',
        component: MainPageComponent
    },
    { 
        path: 'cities/:id/spots' ,
        pathMatch: 'full',
        component: CitySpotsComponent
    }
];
