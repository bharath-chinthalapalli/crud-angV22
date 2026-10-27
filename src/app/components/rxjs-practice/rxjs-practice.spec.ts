import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RxjsPractice } from './rxjs-practice';

describe('RxJS practice behavior', () => {
  let component: RxjsPractice;

  beforeEach(() => {
    vi.useFakeTimers();
    component = new RxjsPractice();
  });

  afterEach(() => {
    component.ngOnDestroy();
    vi.useRealTimers();
  });

  it('transforms the price and keeps tap values unchanged', () => {
    component.runMap();
    component.runTap();
    expect(component.mapOutput()).toBe('Final price: 900');
    expect(component.tapOutput()).toEqual(['Before map: 1000', 'After map: 900', 'Subscriber received: 900']);
  });

  it('recovers from failure and also demonstrates success', () => {
    component.runRequest(true);
    vi.advanceTimersByTime(800);
    expect(component.errorOutput()).toBe('Fallback: No users available. Server unavailable');
    component.runRequest(false);
    vi.advanceTimersByTime(800);
    expect(component.errorOutput()).toBe('Loaded users: Bharath, Sita');
  });

  it('only delivers the latest pending search', () => {
    component.search('A');
    vi.advanceTimersByTime(500);
    component.search('Angular');
    vi.advanceTimersByTime(1000);
    expect(component.searchOutput()).toBe('Searching for Angular...');
    vi.advanceTimersByTime(500);
    expect(component.searchLog()).toEqual(['Input: A', 'Input: Angular', 'Results for Angular']);
  });

  it('waits for each save to finish before starting the next', () => {
    component.queueSave();
    component.queueSave();
    expect(component.saveLog()).toEqual(['Queued save 1', 'Started save 1', 'Queued save 2']);
    vi.advanceTimersByTime(1500);
    expect(component.saveLog().slice(-2)).toEqual(['Finished save 1', 'Started save 2']);
    vi.advanceTimersByTime(1500);
    expect(component.saveLog().at(-1)).toBe('Finished save 2');
  });

  it('stops pending work when the page is destroyed', () => {
    component.search('Angular');
    component.queueSave();
    component.ngOnDestroy();
    vi.advanceTimersByTime(3000);
    expect(component.searchOutput()).toBe('Searching for Angular...');
    expect(component.saveLog()).not.toContain('Finished save 1');
  });
});
