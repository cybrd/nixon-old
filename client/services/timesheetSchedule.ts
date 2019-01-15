import { myFetchJSON } from './myFetch';

export function list(args = {}) {
  return myFetchJSON('/api/timesheetSchedule/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function summary(args = {}) {
  return myFetchJSON('/api/timesheetSchedule/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}
