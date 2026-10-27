import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth implements CanActivate {
  isLoggedIn = false;
  private _router = inject(Router);
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     return false;
//   }
  canActivate(): boolean {
    if (this.isLoggedIn) {
        return true;
    }else{
        this._router.navigate(['/login']);
        return false;
    }

  }
}
