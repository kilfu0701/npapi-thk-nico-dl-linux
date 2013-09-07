nicoDLM npapi plugin for Linux
=====

*npapi thk build for debian/ubuntu*
<code>
sudo apt-get install g++
sudo apt-get install g++-multilib
sudo apt-get install libc6-dbg libc6-dev-i386
sudo apt-get install libx11-dev
sudo apt-get install libgtk2.0-dev
sudo apt-get install libcurl4-gnutls-dev
</code>

*IF curl build error on 64-bit OS. See about ./misc/ folder.*
<code>
cd /usr/include/curl/
sudo mv curlbuild.h curlbuild-64.h
sudo cp curlbuild-64.h curlbuild-32.h
sudo sed -i 's/#define CURL_SIZEOF_LONG 8/#define CURL_SIZEOF_LONG 4/g' curlbuild-32.h
</code>

*add new a file 'curlbuild.h'*
<code>
vim curlbuild.h
</code>

<code>
#include <bits/wordsize.h>

#if __WORDSIZE == 32
#include "curlbuild-32.h"
#elif __WORDSIZE == 64
#include "curlbuild-64.h"
#else
#error "Unknown word size"
#endif
</code>

*how to build*
git https://github.com/kilfu0701/npapi-thk-nico-dl-linux.git
cd npapi-thk-nico-dl
make

*test in chrome*
Open chrome extension manager, and enable developer mode.
Select load from unpack files and choose /test/ folder.

