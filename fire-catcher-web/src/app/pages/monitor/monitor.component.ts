import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  images = {
    previous: '',
    current: '',
    fire: ''
  };
  isActiveFireNow = true;
  timestamp = 0;
  warningTitle = '';

  constructor() {
    this.updateTimestamp();
    const imgName = 'detectedFire/fc-1563069543.png';
    const timestampImg = this.getTimestampFromImageName(imgName);
    console.log('timestamp: ', timestampImg);
    this.updateWarningTitle(timestampImg);
    this.images.previous = 'https://firebasestorage.googleapis.com/v0/b/fire-catcher-242315.appspot.com/o/debugImages%2Ffc-1563069497.png?alt=media'; // tslint:disable-line
    this.images.current = 'https://firebasestorage.googleapis.com/v0/b/fire-catcher-242315.appspot.com/o/debugImages%2Ffc-1563069543.png?alt=media'; // tslint:disable-line
    this.images.fire = 'https://firebasestorage.googleapis.com/v0/b/fire-catcher-242315.appspot.com/o/detectedFire%2Ffc-1563069543.png?alt=media'; // tslint:disable-line

  }

  ngOnInit() {
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

  rejectAlarm() {
    
  }
  
  acceptAlarm() {

  }

}
