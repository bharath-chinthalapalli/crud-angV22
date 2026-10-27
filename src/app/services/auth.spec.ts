import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { Router } from '@angular/router';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('blocks access before login and redirects to login', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    expect(service.canActivate()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('allows access after login', () => {
    service.isLoggedIn = true;

    expect(service.canActivate()).toBe(true);
  });
});
