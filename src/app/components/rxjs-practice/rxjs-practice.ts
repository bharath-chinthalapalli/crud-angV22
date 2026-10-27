import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, concatMap, delay, map, of, Subject, Subscription, switchMap, tap, throwError, timer } from 'rxjs';

@Component({
  selector: 'app-rxjs-practice',
  imports: [RouterLink],
  templateUrl: './rxjs-practice.html',
  styleUrl: './rxjs-practice.scss',
})
export class RxjsPractice implements OnDestroy {
  mapOutput = signal('Click Run map');
  tapOutput = signal<string[]>([]);
  errorOutput = signal('Choose success or failure');
  searchOutput = signal('Click a search button');
  searchLog = signal<string[]>([]);
  saveLog = signal<string[]>([]);

  private searches = new Subject<string>();
  private saves = new Subject<number>();
  private subscriptions = new Subscription();
  private saveNumber = 0;

  constructor() {
    // Every new search unsubscribes from the previous delayed search.
    this.subscriptions.add(this.searches.pipe(
      tap(term => {
        this.searchOutput.set('Searching for ' + term + '...');
        this.searchLog.update(log => [...log, 'Input: ' + term]);
      }),
      switchMap(term => of('Results for ' + term).pipe(delay(1500))),
    ).subscribe(result => {
      this.searchOutput.set(result);
      this.searchLog.update(log => [...log, result]);
    }));

    // concatMap waits for each save to complete before starting the next one.
    this.subscriptions.add(this.saves.pipe(
      concatMap(id => {
        this.saveLog.update(log => [...log, 'Started save ' + id]);
        return of('Finished save ' + id).pipe(delay(1500));
      }),
    ).subscribe(result => this.saveLog.update(log => [...log, result])));
  }

  runMap() {
    // map changes each emitted value: price 1000 becomes discounted price 900.
    of(1000).pipe(
      map(price => price - price * 10 / 100),
    ).subscribe(price => this.mapOutput.set('Final price: ' + price));
  }

  runTap() {
    this.tapOutput.set([]);
    of(1000).pipe(
      tap(price => this.tapOutput.update(log => [...log, 'Before map: ' + price])),
      map(price => price - price * 10 / 100),
      tap(price => this.tapOutput.update(log => [...log, 'After map: ' + price])),
    ).subscribe(price => this.tapOutput.update(log => [...log, 'Subscriber received: ' + price]));
  }

  runRequest(shouldFail: boolean) {
    this.errorOutput.set('Loading mock request...');
    this.subscriptions.add(timer(800).pipe(
      // A fake request: no backend or existing CRUD data is used.
      switchMap(() => shouldFail
        ? throwError(() => new Error('Server unavailable'))
        : of('Loaded users: Bharath, Sita')),
      catchError(error => of('Fallback: No users available. ' + error.message)),
    ).subscribe(result => this.errorOutput.set(result)));
  }

  search(term: string) {
    this.searches.next(term);
  }

  queueSave() {
    this.saveNumber++;
    this.saveLog.update(log => [...log, 'Queued save ' + this.saveNumber]);
    this.saves.next(this.saveNumber);
  }

  ngOnDestroy() {
    // Stop pending demos when leaving this page.
    this.subscriptions.unsubscribe();
    this.searches.complete();
    this.saves.complete();
  }
}
