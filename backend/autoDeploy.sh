#!/bin/sh

unset GIT_DIR
DeployPath=/yjdata/www/thinkphp/chinaipo/frontend

echo "======================"
cd $DeployPath

echo "Start deployment"
echo "pulling source code..."
git pull origin master
git checkout master
echo "Finished"
pm2 reload chinaipo
echo "pm2 reload completed"


