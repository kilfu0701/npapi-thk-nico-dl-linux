#include "file-io.h"
#include "npapi-thk-nico-dl.h"
#include "thk.h"
#include "nico-thread.h"
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <sstream>
#include <iostream>
#include <fstream>
#include <vector>
#include <curl/curl.h>

void vlog(std::string str);
//char VLOG_PATH[260];
char COOKIE_PATH[260];

int CUR_DOWNLOADS = 0;
bool CMT_LOCK = false;
NPP g_npobj;

int GetUrl(DownLoad *dl)  
{  
    char url[256] = {0};
    strcpy(url, NICO_WATCH_URL);
    strcat(url, dl->data.vid);

    vlog("test-url:");
    vlog(url);
    vlog("");

    // 初始化libcurl  
    CURLcode return_code;  
    return_code = curl_global_init(CURL_GLOBAL_WIN32);  
    if (CURLE_OK != return_code)  
        return 0;  
    CURL *easy_handle = curl_easy_init();  
    if (NULL == easy_handle)  
    {    
        curl_global_cleanup();  
        return 0;  
    }  
    // 设置easy handle属性  
    curl_easy_setopt(easy_handle, CURLOPT_USERAGENT,"Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8");   
    curl_easy_setopt(easy_handle, CURLOPT_FOLLOWLOCATION, TRUE);   
    curl_easy_setopt(easy_handle, CURLOPT_URL, url);  
    //curl_easy_setopt(easy_handle, CURLOPT_WRITEFUNCTION, write_callback);  
    //curl_easy_setopt(easy_handle, CURLOPT_WRITEDATA, buffer);  
    curl_easy_setopt(easy_handle, CURLOPT_COOKIE, dl->data.cookie);  // set cookie
    curl_easy_setopt(easy_handle, CURLOPT_COOKIEFILE, COOKIE_PATH);  
    curl_easy_setopt(easy_handle, CURLOPT_COOKIEJAR, COOKIE_PATH);  
    curl_easy_perform(easy_handle);   
    curl_easy_cleanup(easy_handle);  
    curl_global_cleanup();  
    return 1;  
}  

size_t write_data2( void *ptr, size_t size, size_t nmemb, void *stream) {
    std::ofstream &ofs = *(std::ofstream *)stream;
    ofs.write((char *)ptr, size*nmemb);
    return size*nmemb;
}

int progress_func(void* ptr, double TotalToDownload, double NowDownloaded, double TotalToUpload, double NowUploaded) {
/*
    static time_t prevtime;
    time_t currtime;
    double dif;
    static int first = 1;
    if(first) {
        time(&prevtime);
        first = 0;
    }
    time(&currtime);
    dif = difftime(currtime, prevtime);
    if(dif < 0.8)
        return 0;

    prevtime = currtime;

    double fractiondownloaded = 0.0;
    char percent[32];

    if(TotalToDownload!=0.0)
        fractiondownloaded = NowDownloaded / TotalToDownload * 100;
    
    sprintf_s(percent, 32, "%3.2f\n", fractiondownloaded);
        
    char *_ptr = (char*) ptr;
    char *buf = new char[strlen(_ptr)+1];
    //char *buf = (char*) malloc(sizeof(char)*64);
    strcpy(buf, _ptr);

    std::stringstream ss;
    std::vector<std::string> pam;
    pam.push_back(buf);
    pam.push_back(percent);
    ss = callback("DLProgress", pam);
    NPN_GetURL(g_npobj, ss.str().c_str(), "_self"); 
    
    delete[] buf;
*/
    return 0;
}

void iThread(DownLoad *dl) { 
    PMYDATA pDataArray[MAX_THREADS];
    int i = 0;
}

