INC = -I"third_party" -I"third_party/npapi"
WITH_GTK = `pkg-config --cflags gtk+-2.0` `pkg-config --libs gtk+-2.0`

main:
	g++ npapi-thk-nico-dl.cpp -c -fPIC -Wall -DOS_LINUX=1 ${INC} -m32 -O3 ${WITH_GTK}
	g++ file-io.cpp -c -fPIC -Wall -DOS_LINUX=1 ${INC} -m32 -O3 ${WITH_GTK}
	g++ thk.cpp -c -fPIC -Wall -Wno-deprecated -DOS_LINUX=1 ${INC} -m32 -O3 ${WITH_GTK}
	g++ nico-thread.cpp -c -fPIC -Wall -Wno-deprecated -DOS_LINUX=1 ${INC} -m32 -O3 ${WITH_GTK}
	g++ -shared -W1,-soname,npapi-thk-nico-dl-32.so -o npapi-thk-nico-dl-32.so npapi-thk-nico-dl.o file-io.o thk.o -m32 -O3
	cp npapi-thk-nico-dl-32.so ./test/plugin/
	g++ npapi-thk-nico-dl.cpp -c -fPIC -Wall -DOS_LINUX=1 ${INC} -m64 -O3 ${WITH_GTK}
	g++ file-io.cpp -c -fPIC -Wall -DOS_LINUX=1 ${INC} -m64 -O3 ${WITH_GTK}
	g++ thk.cpp -c -fPIC -Wall -Wno-deprecated -DOS_LINUX=1 ${INC} -m64 -O3 ${WITH_GTK}
	g++ nico-thread.cpp -c -fPIC -Wall -Wno-deprecated -DOS_LINUX=1 ${INC} -m64 -O3 ${WITH_GTK}
	g++ -shared -W1,-soname,npapi-thk-nico-dl-64.so -o npapi-thk-nico-dl-64.so npapi-thk-nico-dl.o file-io.o thk.o -m64 -O3
	cp npapi-thk-nico-dl-64.so ./test/plugin/
clean:
	rm -rf *.o *.so
