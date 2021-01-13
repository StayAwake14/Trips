import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';


@Injectable({
  providedIn: 'root'
})
export class TripsService {

  private basePathImages = '/TripsImages';
  private basePathMovies = '/TripsMovies';

  constructor(private db: AngularFireDatabase, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  create_NewTrip(record: any) {
    return this.firestore.collection('wycieczki').add(record);
  }

  read_Trips() {
    return this.firestore.collection('wycieczki').snapshotChanges();
  }

  update_Trip(recordID : any, record : any){
    this.firestore.doc('wycieczki/' + recordID).update(record);
  }

  delete_Trip(record_id : any) {
    this.firestore.doc('wycieczki/' + record_id).delete();
  }

  saveFileData(fileUpload: FileUpload, recordID : any): void {
   // this.firestore.collection('wycieczki').add(fileUpload);
    let record = {};
    record['obrazek'] = fileUpload.url;
    this.firestore.doc('wycieczki/'+recordID).update(record);
  }

  saveVideoData(fileUpload: FileUpload, recordID : any): void {
    // this.firestore.collection('wycieczki').add(fileUpload);
     let record = {};
     record['video'] = fileUpload.url;
     this.firestore.doc('wycieczki/'+recordID).update(record);
   }

  pushImageToStorage(fileUpload: FileUpload, id: any): Observable<number> {
    const filePath = `${this.basePathImages}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(fileUpload, id);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  pushVideoToStorage(fileUpload: FileUpload, id: any): Observable<number> {
    const filePath = `${this.basePathMovies}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveVideoData(fileUpload, id);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }
  
}
