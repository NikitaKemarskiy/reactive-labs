import * as config from 'config';
import * as moment from 'moment';
import {
  interval,
  of,
  mergeMap,
  catchError,
  EMPTY,
} from 'rxjs';
import models from '../model';

const dbConfig: {
  backupIntervalMinutes: number,
// @ts-ignore
} = config.db;

interval(moment.duration(dbConfig.backupIntervalMinutes, 'hour').asMilliseconds())
  .pipe(
    mergeMap((item) => of(item)
      .pipe(
        mergeMap(models.createBackup),
        catchError((err) => {
          console.error(err);
          
          return EMPTY;
        })
      )
    ),
  )
  .subscribe({
    next: () => console.log('Backup created'),
    error: console.error,
    complete: () => console.log('Stop creating backups'),
  });
