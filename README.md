# fire-catcher

This project is an automatic system to detect wild fires and send an alarm to the fireman department for early wild fire detection.

### Setting up a Rapberry Pi

Check out [this tutorial](https://geekytheory.com/tutorial-raspberry-pi-1-el-primer-encendido) to get your Raspberry Pi up and running, and [this tutorial](https://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/) to enable wifi connection from the get go (just add the wpa_supplicant.conf file with the network credentials).

To enable ssh create a file named ssh (without extension) at the root of the unit (i.e. touch /Volumes/boot/ssh).

Check out [this tutorial](https://thepihut.com/blogs/raspberry-pi-tutorials/16021420-how-to-install-use-the-raspberry-pi-camera) to install and enable the Raspberry Pi Camera.

#### Option 1

Download this repository and give executable permission to the `install.sh` script like this: `sudo chmod +x ./install.sh`, this script will install all the required modules and configurations.

Check out the **Register a cronjob** section to init fire-catcher.

#### Option 2 (Manual)

Open a terminal inside your Raspberry Pi or connect over ssh, if you don't know what is the pi's ip you can check out [this tutorial](https://itsfoss.com/how-to-find-what-devices-are-connected-to-network-in-ubuntu/).

If you're running a headless raspbian distro install **python-picamera** `sudo apt-get install python-picamera`, if errors arise due to uninstalled dependencies install them with `sudo apt --fix-broken install`.

Install opencv as [described here](https://robologs.net/2014/04/25/instalar-opencv-en-raspberry-pi-2/).

Install imutils with `sudo apt-get install python-pip` and `pip install imutils`.

Install **remote.it** (optional) to connect through ssh over the internet as [described here](https://docs.remote.it/platforms/quick-start-on-raspberry-pi/install-remote.it).

Sync your time with the internet with `sudo timedatectl set-timezone <timezone>`, you can check the available timezones by running `sudo timedatectl list-timezones`, if you want to execute the time sync on start-up you can set a script to run on login as [seen here](https://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up), and put this command in such script `<sudo_password> | sudo -S timedatectl set-timezone <timezone>`, remember to make the script executable `sudo chmod +x <script_name>`.

Check out the **Register a cronjob** section to init fire-catcher.

##### Register a cronjob

Register a cronjob to execute the script every minute, open the crontab with `crontab -e` and a this to the bottom of the file `* * * * * python /path/to/script/main_fire_catcher.py` to run the program every minute, if you want to modify the frequency take a look at the [reference here](https://www.cyberciti.biz/faq/how-do-i-add-jobs-to-cron-under-linux-or-unix-oses/).
You should also configure the clean script `0 0 * * * ./path/to/script/clean_memory.sh` to avoid memory overloading.


### Gcloud configuration

Create a gcloud project as [seen here](https://cloud.google.com/resource-manager/docs/creating-managing-projects).
Install the gcloud sdk and init as [described here](https://cloud.google.com/sdk/install)
Authenticate to gcloud `gcloud auth login` and set your project id `gcloud config set project <your_project_id>`.
You can test your installation by copying a file to your bucket like this: `gsutil cp <path_to_file> <bucket_name>`, [reference here](https://cloud.google.com/storage/docs/gsutil/commands/cp).
