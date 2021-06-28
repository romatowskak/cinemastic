import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/core/store/reducers';
import { getSignedInUserSelector } from 'src/app/core/store/reducers/auth.reducer';
import { User } from 'src/app/shared/models/User';
import { MovieReservation } from '../../../shared/models/MovieReservation';
import { Subscription } from 'rxjs';
import { getReservationsRequest, removeReservationRequest } from 'src/app/core/store/actions/booking.actions';
import { getReservationsSelector } from 'src/app/core/store/reducers/booking.reducer';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.scss'],
})
export class UserReservationsComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<MovieReservation>;
  reservationsSubscription: Subscription;
  userSubscription: Subscription;
  displayedColumns: string[];
  userReservations: MovieReservation[];
  user: User;

  constructor(private store: Store<State>, private currentRoute: ActivatedRoute) {}

  ngOnInit() {
    const { userId } = this.currentRoute.snapshot.params;
    this.displayedColumns = ['reservation', 'movie', 'auditorium', 'seat', 'day', 'hour', 'reservationCancelButton'];
    this.dataSource = new MatTableDataSource<MovieReservation>([]);
    this.store.dispatch(getReservationsRequest());

    this.reservationsSubscription = this.store.select(getReservationsSelector).subscribe((reservations: MovieReservation[]) => {
      this.dataSource.data = reservations.filter((reservation: MovieReservation) => reservation.user.id === +userId);
    });

    this.userSubscription = this.store.select(getSignedInUserSelector).subscribe((user: User) => {
      this.user = user;
    });
  }

  cancelReservation(reservationId: number) {
    this.store.dispatch(removeReservationRequest({ payload: { reservationId } }));
  }

  ngOnDestroy() {
    this.reservationsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
