import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// set storage permission to allow read: true
export const triggerAlarm = functions.storage.object().onFinalize(async (object) => {
  const metadata = <any>object.metadata;
  const bucket = object.bucket;
  const filePath = <any>object.name;
  const contentType = object.contentType;
  const isWildFire = metadata.iswildfire !== 'False';
  if (contentType && !contentType.startsWith('image/')) {
    return 'This is not an image.';
  }
  if (isWildFire) {
    await updateAlarm(metadata, bucket, filePath);
    console.log('Alarm triggered! at:', metadata.timestamp);
  }
  return ;
});

async function updateAlarm(metadata: any, bucket: string, filePath: string) {
  const station = metadata.station;
  const timestamp = metadata.timestamp;
  const url = getImageUrl(bucket, filePath);
  const imgUrl1 = getImageUrl(bucket, metadata.previousimagebucketpath);
  const imgUrl2 = getImageUrl(bucket, metadata.currentimagebucketpath);
  const alarm = {
    status: 'IN_REVIEW',
    fireStorage: filePath,
    previousStorage: metadata.previousimagebucketpath,
    currentStorage: metadata.currentimagebucketpath,
    station: station,
    timestamp: parseInt(timestamp),
    previousUrl: imgUrl1,
    currentUrl: imgUrl2,
    fireUrl: url
  };
  await Promise.all([
    admin.firestore().collection('alert').doc('status').set(alarm),
    admin.firestore().collection('station-' + station).doc(timestamp).set(alarm)
  ]);
  return;
}

function getImageUrl(bucket: string, filePath: string): string {
  // if download link stops working check out and implement this: 
  // https://stackoverflow.com/questions/53189911/how-to-get-public-download-link-within-a-firebase-storage-trigger-function-onf 
  const fileUrlPath = filePath.replace(/\//g, '%2F');
  return 'https://firebasestorage.googleapis.com/v0/b/' + bucket + '/o/' + fileUrlPath + '?alt=media';
}