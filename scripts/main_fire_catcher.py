# -*- coding: utf-8 -*-
import time, os, os.path, json
import imageHandler

with open('../configs/config.json') as json_data_file:
    configs = json.load(json_data_file)

# configurations
day_light_start_hour = configs['day_light_start_hour']
day_light_end_hour = configs['day_light_end_hour']
photos_path = configs['photos_path']
timestamp = int(time.time())
current_hour = int(time.strftime("%H"))

# if current_hour > day_light_start_hour and current_hour < day_light_end_hour:

# take photo
# imageName = 'fc-' + str(timestamp) + '.png'
# imagePath = photos_path + imageName
# imageHandler.takePhoto(imagePath)

imageList = os.listdir(photos_path)
imageList = [k for k in imageList if '.png' in k]
filesCount = len(imageList)
if filesCount > 1:
  currentImageName = imageList[filesCount-1]
  previousImageName = imageList[filesCount-2]
  isWildFire, fireImageName = imageHandler.findWildFire(previousImageName, currentImageName)
  if isWildFire:
    previousImageData = imageHandler.getImageData(previousImageName, False)
    currentImageData = imageHandler.getImageData(currentImageName, False)
    fireImageData = imageHandler.getImageData(fireImageName, True, previousImageName, currentImageName)
    
    imageHandler.uploadPhoto(previousImageData)
    imageHandler.uploadPhoto(currentImageData)
    imageHandler.uploadPhoto(fireImageData)
  