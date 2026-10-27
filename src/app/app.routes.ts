import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        loadComponent:()=>import('../app/components/user-list/user-list').then(m=>m.UserList),
        title:'User List | Crud'
    }
];
