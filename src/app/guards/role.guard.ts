import { CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const requiredRoles = route.data?.['roles'] as string[];

  if (requiredRoles && requiredRoles.length > 0) {
    const authService = new AuthService(); // Consider injecting this dependency in the constructor

    // Check if isAuthenticated method exists on the authService
    if (typeof authService.isAuthenticated !== 'function' || !authService.isAuthenticated()) {
      // Redirect to login page or show an alert for unauthenticated users
      alert("You Don't Have Access here");
      // You might want to navigate to a login page or display an alert here
      return false;
    }

    const hasAccess = authService.hasAccess(requiredRoles);

    if (!hasAccess) {
      // Redirect to unauthorized page or show an alert
      alert('Unauthorized access. Redirecting...');
      // You might want to navigate to an unauthorized page or display an alert here
      return false;
    }
  }

  return true;
}

