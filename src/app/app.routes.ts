import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainPageComponent } from './features/main/main-page.component';
import { CitySpotsComponent } from './features/city/city-spots/city-spots.component';
import { SpotDetailsComponent } from './features/spot/spot-details/spot-details.component';
import { AddSpotComponent } from './features/spot/add-spot/add-spot.component';
import { PendingSubmissionsComponent } from './features/submission/pending-submissions.component/pending-submissions.component';
import { authGuard } from './core/auth/auth.guard';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';

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
    },
    {
        path: 'cities/:id/spots/add',
        pathMatch: 'full',
        component: AddSpotComponent,
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Owner'] }
    },
    {
        path: 'spots/:id',
        pathMatch: 'full',
        component: SpotDetailsComponent
    },
    {
        path: 'submissions/pending',
        pathMatch: 'full',
        component: PendingSubmissionsComponent,
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Owner'] }
    },
    {
        path: 'forbidden',
        pathMatch: 'full',
        component: ForbiddenComponent
    },
];
