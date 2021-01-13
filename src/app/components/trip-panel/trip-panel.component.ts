import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { TripsService } from '../../services/trips.service';
import { FileUpload } from './../../models/file-upload.model';

@Component({
  selector: 'app-trip-panel',
  templateUrl: './trip-panel.component.html',
  styleUrls: ['./trip-panel.component.scss']
})
export class TripPanelComponent implements OnInit {
  title = "Panel Wycieczek";
  trips: any;
  id: string;
  name: string;
  desc: string;
  date: string;
  days_count: number;
  destination_place: string;
  start_place: string;
  km_arrived: number;
  video_url: string;
  image_url: string;
  isAdd:boolean;
  isEdit:boolean;

  imageNameAdd: string = "Wybierz zdjęcie";
  videoNameAdd: string = "Wybierz video";
  imageName: string = "Wybierz zdjęcie";
  videoName: string = "Wybierz video";
  selectedImages: FileList;
  selectedVideos: FileList;
  currentImageUpload: FileUpload;
  currentVideoUpload: FileUpload;
  percentage_image: number;
  percentage_video: number;

  constructor(private tripsService: TripsService) {  }

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
          video_url: e.payload.doc.data()['video'],
          imageName: "Wybierz zdjęcie",
          videoName: "Wybierz video",
        };
      })
    });
  }

  selectImage(event, record):void {
    this.selectedImages = event.target.files;
    if(this.isEdit == true)
    {
      this.imageName = event.target.files[0].name;
      record['imageName'] = event.target.files[0].name;
    }
    else
    {
      this.imageNameAdd = event.target.files[0].name;
    }
  }

  selectVideo(event, record):void {
    this.selectedVideos = event.target.files;
    if(this.isEdit == true){
      this.videoName = event.target.files[0].name;
      record['videoName'] = event.target.files[0].name;
    } else {
      this.videoNameAdd = event.target.files[0].name;
    }
  }

  uploadImage(id: any, record: any): void {
    const file = this.selectedImages.item(0);
    this.selectedImages = undefined;

    this.currentImageUpload = new FileUpload(file);
    this.tripsService.pushImageToStorage(this.currentImageUpload, id).subscribe(
      percentage => {
        this.percentage_image = Math.round(percentage);
      },
      error => {
        //console.log(error);
      },
      ()=>{
        this.currentImageUpload = undefined;
      }
    );
  }

  uploadVideo(id: any): void {
    const file = this.selectedVideos.item(0);
    this.selectedVideos = undefined;

    this.currentVideoUpload = new FileUpload(file);

    this.tripsService.pushVideoToStorage(this.currentVideoUpload, id).subscribe(
      percentage => {
        this.percentage_video = Math.round(percentage);
      },
      error => {
        //console.log(error);
      },
      ()=>{
        this.currentVideoUpload = undefined;
      }
    );
  }

  CreateRecord() {
    let record = {};
    record['nazwa'] = this.name;
    record['opis'] = this.desc;
    record['data'] = this.date;
    record['miejsce_startu'] = this.start_place;
    record['miejsce_docelowe'] = this.destination_place;
    record['liczba_dni'] = this.days_count;
    record['liczba_km'] = this.km_arrived;

    this.tripsService.create_NewTrip(record).then(resp => {
      this.uploadImage(resp.id, record);
      this.uploadVideo(resp.id);
    })
      .catch(error => {
        //console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.tripsService.delete_Trip(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.name;
    record.EditDesc = record.desc;
    record.EditDate = record.date;
    record.EditStart = record.start_place;
    record.EditDestination = record.destination_place;
    record.EditDaysCount = record.days_count;
    record.EditCountKm = record.km_arrived;

  }

  UpdateRecord(recordRow) {
    let record = {};
    record['nazwa'] = recordRow.name;
    record['opis'] = recordRow.desc;
    record['data'] = recordRow.date;
    record['miejsce_startu'] = recordRow.start_place;
    record['miejsce_docelowe'] = recordRow.destination_place;
    record['liczba_dni'] = recordRow.days_count;
    record['liczba_km'] = recordRow.km_arrived;

    this.tripsService.update_Trip(recordRow.id, record);
    if(this.selectedImages != undefined)
    {
      this.uploadImage(recordRow.id, record);
    }
    
    if(this.selectedVideos != undefined)
    {
      this.uploadVideo(recordRow.id);
    }
    
  }

  checkStatus(record){
    record['isUpdate'] = true;
  }

  showAddPanel(){
    if(this.isAdd == true){
      this.isAdd = false;
    }
    else 
    {
      this.isAdd = true;
    }
  }

  showEditPanel(){
    if(this.isEdit == true){
      this.isEdit = false;
    }
    else 
    {
      this.isEdit = true;
    }

  }
}
