#!/bin/bash

# need to install node first to be able to install yarn (as at prebuild no node is present yet)
sudo curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum -y install nodejs

# install yarn
if which yarn > /dev/null
    then
        echo "yarn is installed, skipping..."
    else
        sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
        sudo yum -y install yarn
    fi

# install
cd /var/app/staging/

yarn install --prod

chown -R webapp:webapp node_modules/ || true # allow to fail

if [[ -z "${PRODUCTION_BUILD}" ]]; then
    echo "Running in development mode"
else
    echo "Building for production"
    yarn run build
fi
