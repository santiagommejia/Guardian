# Guardian

This project is an automatic system to detect wild fires and send an alarm to the fire station for early wild fire detection.

This is accomplished by taking the following steps:
1. Take a picture with a Raspberry Pi (using a Raspberry Pi Camera module).
2. Run a computer vision algorithm to detect changes between two consecutive pictures.
3. If a fire is detected, the two original pictures and the marked picture are uploaded to a firebase storage bucket.
4. A cloud function is triggered when an image is storaged in the bucket, with the information in the image metada, the cloud functions update a document in the firestore database.
5. A web page or an app can be set to listen for a change in the alarm path set by the cloud function, when this listener is triggered an alarm can sound in the fire station to alert the firemen.

### Setting up a Rapberry Pi

Check out [this tutorial](https://geekytheory.com/tutorial-raspberry-pi-1-el-primer-encendido) to get your Raspberry Pi up and running, and [this tutorial](https://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/) to enable wifi connection from the get go (just add the wpa_supplicant.conf file with the network credentials, check out this file in the configs folder).

To enable ssh create a file named ssh (without extension) at the root of the unit (i.e. touch /Volumes/boot/ssh).

Check out [this tutorial](https://thepihut.com/blogs/raspberry-pi-tutorials/16021420-how-to-install-use-the-raspberry-pi-camera) to install and enable the Raspberry Pi Camera.

#### Option 1

Download this repository and give executable permission to the `install.sh` script like this: `sudo chmod +x ./install.sh`, this script will install all the required modules and configurations.

Check out the **Register a cronjob** section to init fire-catcher.

#### Option 2 (Manual)

Open a terminal inside your Raspberry Pi or connect over ssh, if you don't know what's the pi's IP address you can check out [this tutorial](https://itsfoss.com/how-to-find-what-devices-are-connected-to-network-in-ubuntu/).

If you're running a headless raspbian distro install **python-picamera** `sudo apt-get install python-picamera`, if errors pop up due to uninstalled dependencies install them with `sudo apt --fix-broken install`.

Install opencv as [described here](https://robologs.net/2014/04/25/instalar-opencv-en-raspberry-pi-2/).

Install imutils with `sudo apt-get install python-pip` and `pip install imutils`.

Install **remote.it** (optional) to connect through ssh over the internet as [described here](https://docs.remote.it/platforms/quick-start-on-raspberry-pi/install-remote.it).

Sync your time with the internet with `sudo timedatectl set-timezone <timezone>`, you can check the available timezones by running `sudo timedatectl list-timezones`, if you want to execute the time sync on start-up you can set a script to run on login as [seen here](https://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up), and put this command in that script `<sudo_password> | sudo -S timedatectl set-timezone <timezone>`, remember to make the script executable `sudo chmod +x <script_name>`.

Check out the **Register a cronjob** section to init fire-catcher.

#### Register a cronjob

Register a cronjob to execute the script every minute, open the crontab with `crontab -e` and add this to the bottom of the file `* * * * * python /path/to/script/main_fire_catcher.py` to run the program every minute, if you want to modify the frequency take a look at the [reference here](https://www.cyberciti.biz/faq/how-do-i-add-jobs-to-cron-under-linux-or-unix-oses/).
You should also configure the clean script `0 0 * * * ./path/to/script/clean_memory.sh` to avoid memory overflow.


### Gcloud configuration

Create a gcloud project as [seen here](https://cloud.google.com/resource-manager/docs/creating-managing-projects).
Install the gcloud sdk and init as [described here](https://cloud.google.com/sdk/install)
Authenticate to gcloud `gcloud auth login` and set your project id `gcloud config set project <your_project_id>`.
You can test your installation by copying a file to your bucket like this: `gsutil cp <path_to_file> <bucket_name>`, [reference here](https://cloud.google.com/storage/docs/gsutil/commands/cp).

### Firebase Configuration

Create a new firebase project **from the gcloud project you've already created**, this means that when you're creating a new firebase project you should select your gcloud project under the 'project name' field, this will allow you to use the `gsutil cp` command and copy files to your **firebase bucket**, this is important because the cloud functions will listen for changes in that bucket.

Init Firestore Database, Storage and Functions.

Set your Storage rules to:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow write: if request.auth != null;
      allow read;
    }
  }
}
```
This will allow the photo download url generated in the cloud functions to be valid.

