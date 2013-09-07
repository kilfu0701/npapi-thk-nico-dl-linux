#ifndef THK_H_
#define THK_H_

#define COOKIE_MAX_LENGTH 4096
#define VLOG true

/* 
    dl @overwrite = 0 is no overwrite, save into new file.  
                    1 is overwrite.
    
    dlComment @overwirte = 0 is download only JP
                           1 is download only EN
                           2 is download only TW
*/
struct THK{
    double precent;
    double size;
    double current;
    int overwrite;  
    char url[256];
    char fname[256];
    char ext[8];
    char dir[512];
    char cookie[COOKIE_MAX_LENGTH];
    char vid[64];
};

struct DownLoad {
    NPP instance;
    THK data;
};

static const char *VLOG_PATH = "/tmp/vlog.txt";

#endif
