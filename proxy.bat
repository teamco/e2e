@echo off
SETLOCAL

set PROXY=http://genproxy:8080
set HTTP_PROXY=%PROXY%
set HTTPS_PROXY=%PROXY%

npm config set proxy %PROXY%
npm config set https-proxy %PROXY%

yarn config set proxy %PROXY%
yarn config set https-proxy %PROXY%