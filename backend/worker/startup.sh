#!/bin/sh

npm start & echo OK

cd ..
git clone https://github.com/kevinmingtarja/react-app.git
cd react-app
npm install
npm start