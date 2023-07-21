#!/bin/sh
sed -i -e 's/process\.env\.NODE_ENV/\"production\"/g' dist/**/*.js
