import { TestBed } from '@angular/core/testing';
import { AllUsers } from './all-users';

describe('AllUsers', () => {
  let service: AllUsers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllUsers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
