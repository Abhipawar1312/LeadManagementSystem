import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  if (sessionStorage.getItem("isLoginUser") === "true") {
    return true;
  }
  else {
    return false;
  }
};


