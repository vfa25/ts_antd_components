#!/bin/bash

set -e

cmpDir="../antd_show/node_modules/antd-enterprise"
if [ -d "$cmpDir" ]; then
    rm -rf "$cmpDir/es"
    rm -rf "$cmpDir/lib"
    rm "$cmpDir/package.json"
    echo "旧目录删除成功"
else
    mkdir $cmpDir
    echo "新目录创建成功"
fi

if [ ! -d "es" ]; then
    echo "请先执行编译：npm run compile"
    exit
fi

cp -r ./es "$cmpDir/"
cp -r ./lib "$cmpDir/"
cp ./package.json "$cmpDir/"
echo "拷贝完成"

read -p "In that direction execute cnpm install - are you sure? (y/n)" -n 1 -r
echo  # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd $cmpDir
    cnpm i
fi
