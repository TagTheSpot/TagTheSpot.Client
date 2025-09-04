import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MainPageComponent } from './features/main/main-page.component';
import { CitySpotsComponent } from './features/city/city-spots/city-spots.component';
import { SpotDetailsComponent } from './features/spot/spot-details/spot-details.component';
import { AddSpotComponent } from './features/spot/add-spot/add-spot.component';
import { PendingSubmissionsComponent } from './features/submission/pending-submissions/pending-submissions.component';
import { authGuard } from './core/auth/auth.guard';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { MySubmissionsComponent } from './features/submission/my-submissions/my-submissions.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { SubmissionDetailsComponent } from './features/submission/submission-details/submission-details.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '',
        pathMatch: 'full',
        component: MainPageComponent
    },
    {
        path: 'cities/:id/spots',
        component: CitySpotsComponent
    },
    {
        path: 'cities/:id/spots/add',
        component: AddSpotComponent,
        canActivate: [authGuard]
    },
    {
        path: 'spots/:id',
        component: SpotDetailsComponent
    },
    {
        path: 'submissions/pending',
        component: PendingSubmissionsComponent,
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Owner'] }
    },
    {
        path: 'submissions',
        component: MySubmissionsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'submissions/:id',
        component: SubmissionDetailsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent
    },
    {
        path: 'server-error',
        component: ServerErrorComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
