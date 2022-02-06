#!/bin/bash

cd server/adminPanel
yarn
yarn build
cd ..
yarn
yarn start