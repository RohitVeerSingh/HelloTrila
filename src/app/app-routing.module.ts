import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './auth/login-guard';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate:[AuthGuard]
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'project/:id',
    loadChildren: () => import('./pages/project/project.module').then( m => m.ProjectPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
