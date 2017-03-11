#!/bin/sh

unset GIT_DIR
FrontPath=/yjdata/www/thinkphp/chinaipo/frontend
BackPath=/yjdata/www/thinkphp/chinaipo/backend

echo "======================"
echo "Start deployment"
echo "pulling source code..."
git pull origin master
git checkout master
echo "Pull finished"
cd $DeployPath
cnpm install
webpack -p
echo "webpack build completed"
cd $BackPath
cnpm install
pm2 reload chinaipo
echo "pm2 reload completed"


