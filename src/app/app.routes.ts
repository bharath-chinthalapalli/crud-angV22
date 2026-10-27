import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Auth } from './services/auth';

export const routes: Routes = [
    {
        path: 'rxjs-practice',
        loadComponent: () => import('./components/rxjs-practice/rxjs-practice').then(m => m.RxjsPractice),
        title: 'RxJS Practice',
    },
    {
        path:"", pathMatch:'full',redirectTo:'login',
    },
    {
        path:"login",
        component:Login,
        title:'Login | Crud'
    },
    {
        path:"userList",canActivate:[Auth],
        loadComponent:()=>import('../app/components/user-list/user-list').then(m=>m.UserList),
        title:'User List | Crud'
    }
];
