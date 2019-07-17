import { Component } from '@angular/core';
import { Alarm } from '../../shared/models/alarm';
import { Image } from '../../shared/models/image';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import * as firebase from 'firebase';
@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent {

  images = {
    previous: new Image(),
    current: new Image(),
    fire: new Image()
  };
  status = '';
  timestamp = 0;
  warningTitle = '';
  alarm = new Alarm();
  audio = new Audio();

  constructor(private spinner: NgxSpinnerService) {
    this.listenAlarmTrigger();
  }

  listenAlarmTrigger() {
    firebase.firestore().collection('alert').doc('status').onSnapshot(snapshot => {
      this.updateTimestamp();
      this.extractDataFromDocument(snapshot.data());
    }, err => {
      console.log(`Encountered error: ${err}`);
    });
  }

  extractDataFromDocument(doc: any) {
    this.updateStatus(doc.status);
    if (doc.status === 'IN_REVIEW' || doc.status === 'CONFIRMED') {
      this.alarm = Object.assign(new Alarm(), doc);
      const fireTimestamp = this.getTimestampFromImageName(doc.fireStorage);
      this.setImage('current', doc.currentUrl, doc.currentStorage);
      this.setImage('fire', doc.fireUrl, doc.fireStorage);
      this.setImage('previous', doc.previousUrl, doc.previousStorage);
      this.updateWarningTitle(fireTimestamp);
      this.soundAlarm('WARNING');
    }
  }

  setImage(name: string, url: string, storage: string) {
    this.images[name].url = url;
    this.images[name].timestamp = this.getTimestampFromImageName(storage);
  }

  updateTimestamp() {
    this.timestamp = new Date().getTime();
  }

  updateWarningTitle(timestamp: number) {
    const time = moment(timestamp).format('HH:mm:SS A');
    this.warningTitle = 'Se ha detectado un posible incendio hoy a las ' + time + '.';
  }

  getTimestampFromImageName(name: string): number {
    const paths = name.split('/');
    const timestamp = paths[paths.length - 1].replace('fc-', '').replace('.png', '');
    return parseInt(timestamp, 10);
  }

  async soundAlarm(type: string) {
    if (type !== 'SILENT') {
      const src = type === 'FIRE' ? '../../../assets/audio/woop-woop.mp3' : '../../../assets/audio/smoke-alarm.mp3';
      this.audio.src = src;
      this.audio.loop = true;
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  rejectAlarm() {
    this.updateStatus('');
    this.updateFirestoreAlarm('REJECTED');
    this.soundAlarm('SILENT');
  }

  acceptAlarm() {
    this.updateStatus('CONFIRMED');
    this.updateFirestoreAlarm('CONFIRMED');
    this.soundAlarm('FIRE');
  }

  updateFirestoreAlarm(newStatus: string) {
    const station = 'station-' + this.alarm.station;
    const docId = this.alarm.timestamp.toString();
    try {
      Promise.all([
        firebase.firestore().collection('alert').doc('status').update('status', newStatus),
        firebase.firestore().collection(station).doc(docId).update('status', newStatus)
      ]);
    } catch (error) {
      console.log('promise error:', error);
    }
  }

  restore() {
    this.updateStatus('');
    this.soundAlarm('SILENT');
  }

  updateStatus(status: string) {
    this.status = status;
    if (status === '' || status === 'REJECTED') {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

}
