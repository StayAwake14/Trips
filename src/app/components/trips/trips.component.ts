import { Component, OnInit } from '@angular/core';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  title = "Lista wycieczek";
  trips: any;
  //id: number = 0;
  name: string;
  desc: string;
  date: string;
  days_count: number;
  destination_place: string;
  start_place: string;
  km_arrived: number;
  movie_path: string;
  image_url: string;
  video_url: string;

  constructor(private tripsService: TripsService){ }

  ngOnInit() {
    this.tripsService.read_Trips().subscribe(data => {
      this.trips = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['nazwa'],
          desc: e.payload.doc.data()['opis'],
          date: e.payload.doc.data()['data'],
          start_place: e.payload.doc.data()['miejsce_startu'],
          destination_place: e.payload.doc.data()['miejsce_docelowe'],
          days_count: e.payload.doc.data()['liczba_dni'],
          km_arrived: e.payload.doc.data()['liczba_km'],
          image_url: e.payload.doc.data()['obrazek'],
          video_url: e.payload.doc.data()['video']
        };
        
      })
    });
  }


}
