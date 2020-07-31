# ask function
ask() {
    local default reply
    default=Y
    while true; do
        echo -n "$1 Y/n: "
        read reply </dev/tty
        if [ -z "$reply" ]; then
            reply=$default
        fi
        case "$reply" in
            Y*|y*) return 0 ;;
            N*|n*) return 1 ;;
        esac
    done
}

# Install Script
echo "********************************************************************************"
echo "         Welcome to the installation script for fire-catcher!"
echo "      Follow the instructions to install and configure this project."
echo "********************************************************************************"
echo
if ask "Do you want to install the python-picamera?"; then
  sudo apt-get install python-picamera
  echo "Fixing possible broken dependencies..."
  sudo apt -f install
fi
if ask "Do you want to install the opencv?"; then
  sudo apt-get install libopencv-dev python-opencv
  echo "Fixing possible broken dependencies..."
  sudo apt-get -f install
  sudo apt-get install libopencv-dev python-opencv
fi
if ask "Do you want to install the imutils?"; then
  sudo apt-get install python-pip
  pip install imutils
fi
if ask "Do you want to install and configure remote.it? (recommended to connect over the internet)"; then
  sudo apt install connectd
  sudo connectd_installer
fi
echo
echo "Configuring timezone..."
read -p "Introduce your password: " psswd
if ask "Do you want to see the full list of available timezones?"; then
  echo "Look for your timezone, this is the full list (press 'q' to exit): "
  sudo timedatectl list-timezones
read -p "Introduce your timezone <continent>/<city>: " timezone
sudo timedatectl set-timezone $timezone
echo "Time synced."
echo "$psswd | sudo -S timedatectl set-timezone $timezone" >> .bashrc # TODO: check that the time is being synced up at boot time