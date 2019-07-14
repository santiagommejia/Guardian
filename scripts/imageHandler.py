# -*- coding: utf-8 -*-
import picamera
import cv2
import imutils
import numpy as np 
import os, time, json

with open('../configs/config.json') as json_data_file:
    configs = json.load(json_data_file)

fire_path = configs['fire_path']
photos_path = configs['photos_path']
bucket = configs['bucket']
fire_bucket_path = configs['fire_bucket_path']
debug_bucket_path = configs['debug_bucket_path']
station = configs['station']

def takePhoto(filePath):
  camera = picamera.PiCamera()
  camera.hflip = True
  camera.led = False
  camera.capture(filePath)

def findWildFire(previousImageName, currentImageName):
  threshold = 25
  previousImagePath = photos_path + previousImageName 
  currentImagePath = photos_path + currentImageName 
  img1 = cv2.imread(previousImagePath, cv2.IMREAD_UNCHANGED)
  img2 = cv2.imread(currentImagePath, cv2.IMREAD_UNCHANGED)
  diff = cv2.subtract(img2,img1)
  blue_diff = diff[:, :, 0]
  (thresh, bw_diff) = cv2.threshold(blue_diff, threshold, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
  bw_diff = removeNoise(bw_diff)
  contours = cv2.findContours(bw_diff,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
  cnts = imutils.grab_contours(contours)
  isWildFire = True if len(cnts) else False
  for c in cnts:
    # draw rectangle
    x,y,w,h = cv2.boundingRect(c)
    cv2.rectangle(img2,(x,y),(x+w,y+h),(0,0,255),3)
    # draw silhouette
    # cv2.drawContours(img2, [c], 0, (0, 0, 255), 3)  
  if isWildFire:
    cv2.imwrite(fire_path + currentImageName, img2)
  return isWildFire, currentImageName

def removeNoise(bw):
  kernel = np.ones((17,11), np.uint8) 
  erosion = cv2.erode(bw, kernel, iterations=1) 
  dilation = cv2.dilate(erosion, kernel, iterations=1) 
  return dilation

def uploadPhoto(imageData):
  local_path = imageData['local_path']
  bucket_path = imageData['bucket_path']
  metadata = getMetadata(imageData)
  uploadFileCmd = 'gsutil' + metadata + ' cp ' + local_path + ' ' + bucket_path + '/'
  os.system(uploadFileCmd)

def getMetadata(imageData):
  metadataOption = ''
  del imageData['local_path']
  for key, value in imageData.iteritems():
    metadataOption +=  ' -h x-goog-meta-' + key + ':' + value 
  return metadataOption 

def getImageData(name, isWildFire, previous = '', current = ''):
  bucket_path = fire_bucket_path if isWildFire else debug_bucket_path
  local_path = fire_path if isWildFire else photos_path
  previousImageBucketPath = debug_bucket_path + previous if previous != '' else previous
  currentImageBucketPath = debug_bucket_path + current if current != '' else current
  data = {
    'name': name,
    'timestamp': name.replace('.png','').replace('fc-',''),
    'isWildFire': str(isWildFire),
    'local_path': local_path + name,
    'bucket_path': bucket + bucket_path,
    'station': station,
    'previousImageBucketPath': previousImageBucketPath,
    'currentImageBucketPath': currentImageBucketPath
  }
  return data
