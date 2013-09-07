#ifndef NICO_THREAD_H_
#define NICO_THREAD_H_

#define MAX_THREADS 2
#define BUF_SIZE 255
#define USER_AGENT "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11"
#define NICO_BASE_URL "http://www.nicovideo.jp/"
#define NICO_WATCH_URL "http://www.nicovideo.jp/watch/"
#define NICO_FLAPI_URL "http://flapi.nicovideo.jp/api/getflv"

//typedef DWORD WINAPI MyThreadFunction( LPVOID lpParam );
//typedef void ErrorHandler(LPTSTR lpszFunction);
void iThread(DownLoad *dl);
void cmtThread(DownLoad *dl);

typedef struct MyData {
    int val1;
    int val2;
} MYDATA, *PMYDATA;

#endif // NICO_THREAD_H_
