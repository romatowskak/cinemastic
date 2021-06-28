import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap, mapTo } from 'rxjs/internal/operators';
import * as BookingActions from '../actions/booking.actions';
import { State } from '../reducers';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Injectable()
export class BookingEffects {
  getAuditiorium$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.getAuditoriumRequest),
      map((action) => action.payload),
      switchMap(({ auditoriumId }) =>
        this.bookingService.getAuditorium(auditoriumId).pipe(
          map((response) => BookingActions.getAuditoriumSuccess({ payload: response })),
          catchError((error) => {
            if (error.status === 404) {
              this.router.navigate(['/cinemastic/movies']);
            }
            return of(BookingActions.getAuditoriumFailure({ payload: error }));
          })
        )
      )
    )
  );

  getReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.getReservationsRequest),
      switchMap(() =>
        this.bookingService.getReservations().pipe(
          map((response) => BookingActions.getReservationsSuccess({ payload: response })),
          catchError((error) => of(BookingActions.getReservationsFailure({ payload: error })))
        )
      )
    )
  );

  addReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.addReservationRequest),
      map((action) => action.payload),
      switchMap(({ reservation }) =>
        this.bookingService.addReservation(reservation).pipe(
          map((reservation) => BookingActions.addReservationSuccess({ payload: reservation })),
          catchError((error) => of(BookingActions.addReservationFailure({ payload: error })))
        )
      )
    )
  );

  refreshReservations$ = createEffect(() =>
    this.actions$.pipe(ofType(BookingActions.removeReservationSuccess), mapTo(BookingActions.getReservationsRequest()))
  );

  removeReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.removeReservationRequest),
      map((action) => action.payload),
      switchMap(({ reservationId }) =>
        this.bookingService.removeReservation(reservationId).pipe(
          map(() => BookingActions.removeReservationSuccess()),
          catchError((error) => of(BookingActions.removeReservationFailure({ payload: error })))
        )
      )
    )
  );

  redirectOnReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingActions.addReservationSuccess),
        map((action) => action.payload),
        tap((reservation) => {
          this.router.navigate([`/cinemastic/reservations/${reservation.user.id}`]);
        })
      ),
    { dispatch: false }
  );

  getScreening$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.getScreeningRequest),
      map((action) => action.payload),
      switchMap(({ screeningId }) =>
        this.bookingService.getScreening(screeningId).pipe(
          map((response) => BookingActions.getScreeningSuccess({ payload: response })),
          catchError((error) => {
            if (error.status === 404) {
              this.router.navigate(['/cinemastic/movies']);
            }
            return of(BookingActions.getScreeningFailure({ payload: error }));
          })
        )
      )
    )
  );

  constructor(private actions$: Actions, private bookingService: BookingService, private store: Store<State>, private router: Router) {}
}
