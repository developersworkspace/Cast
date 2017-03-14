# -- BUILD AND INSTALL CAST --

# Update machine package indexes
sudo apt-get update

# Download and run script to install node 7
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

# Install node 7
sudo apt-get install -y nodejs

# Install 'typescript' node package
npm install -g typescript

# Install 'gulp' node package
npm install -g gulp

# Install 'forever' node package
npm install forever -g

# Clone 'Cast' repository
git clone https://github.com/developersworkspace/Cast.git

# Change directory to 'agent'
cd ./Cast/agent

# Install node packages for 'agent'
npm install

# Build 'agent'
npm run build

# Create bin directory
mkdir /castAgent

# Copy dist to bin directory
cp -R ./dist /castAgent

# Change to bin directory
cd /castAgent

# Install node packages for 'agent'
npm install

# Add cron job
crontab -l | { cat; echo "@reboot /usr/bin/sudo -H /usr/bin/forever start /castAgent/app.js"; } | crontab -



