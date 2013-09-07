/*
 * Basic functions
 */
#include "file-io.h"
#include "npapi-thk-nico-dl.h"
#include "thk.h"
#include "third_party/build/build_config.h"

#include <dirent.h>
#include <stdio.h>
#include <cstring>
#include <sstream>
#include <vector>
#include <string>
#include <algorithm>
#include <iostream>
#include <fstream>

// for Debug. log some info to file.
bool g_FILELOCK = false;

// write logs into a file. (UTF-8)
void vlog(std::string str) {
    if(!VLOG)
        return;

    // wait for open log file
    while(g_FILELOCK) {
        sleep(500);
    }
    
    g_FILELOCK = true;

    // open log file
    std::ofstream ofs(VLOG_PATH, std::ios::out | std::ios::app | std::ios::binary); 

    if(!ofs.is_open()) {
        g_FILELOCK = false;
        return;
    }

    ofs << str;
    ofs.close();

    g_FILELOCK = false;
}

char* trimFilename(const char *str) {
    char special[10] = "<>:\"/\\|?*";
    char *result = new char[strlen(str)+1];

    std::string s(str);
    for(int i=0; i<9; i++) {
        std::replace( s.begin(), s.end(), special[i], ' ' );
    }

    strcpy(result, s.c_str());

    return result;
}
