/*****************************************************************************
The MIT License (MIT)
Copyright © 2013 BoRu Su (kilfu0701), https://github.com/kilfu0701,
                                      http://kilfu0701.blogspot.tw/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*****************************************************************************/
/**
 * THK Class and some basic functions, constants. (Load this script at top) 
 * ( THK class, 基本函式, 常數 )
 *
 * @Dependency: 
 * 
 * author: kilfu0701, kilfu0701@gmail.com
**/

/* For debug. */
var G_DEBUG = false;

/* Global Vars */
var G_VERSION = '0.0.4',
    G_RELEASE = '2013/8/30';
    
/**
 * Bulid THK class object.
**/
(function(window, undefined) {
    var document = window.document,
        navigator = window.navigator,
        location = window.location;
        
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    this.Class = function(){};

    Class.extend = function(prop) {
        var _super = this.prototype;
    
        initializing = true;
        var prototype = new this();
        initializing = false;
    
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && 
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
                return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);        
                    this._super = tmp;
                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }
    
        function Class() {
            if ( !initializing && this.init )
                this.init.apply(this, arguments);

            var ret = [],
                _T = {};

            if(arguments.length==1) {
                switch(typeof arguments[0]) {
                    case "object":
                        break;

                    case "string":
                        // parse with dom element selector.
                        ret = THK.selector(arguments[0]);
                        break;

                    default:
                        break;
                }
            }

            _T.elements = ret;

            for(var i in THK.prototype.constructor) 
                _T[i] = THK.prototype.constructor[i];

            return _T;
        }
    
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
    
        return Class;
    };

    
    /**
     * for Debug
    **/
    if(G_DEBUG==undefined) 
        var G_DEBUG = false;
    
    if(_D==undefined) {
        function _D(object){
            try { 
                if(G_DEBUG==false)
                    return ;
                
                throw Error('') 
            } catch(err) {
                var caller_line = err.stack.split("\n")[3];
                var index = caller_line.indexOf("at ");
                var clean = caller_line.slice(index+2, caller_line.length);
                console.log("%o  "+clean, object);
            }
        }
    }
    
    /**
     * Build THK Class
     */
    if(typeof THK=='undefined'){
        var THK = Class.extend({});
        THK.debug = false;
        
        THK.init = function() {
            _D("Init THK...");
        }
        
        THK.checkHaveAttr = function(str) {
            var n = str.match(/^[\.|\#]?(\w+)\[(.+=.+)\]/);
            if( n!=null && n.length==3 ) {
                return n;
            } else {
                return ;
            }
        }

        // { url:'', async:'', method:'', done:'', error:'' }
        THK.request = function(s) {
            var _async = s.async || false,
                _method = s.method || "GET",
                _url = s.url;

            var myXHR = new createStandardXHR();

            myXHR.onreadystatechange = function() {
                if (myXHR.readyState === 4) {
                    if(myXHR.status == 200) {
                        var result = myXHR.responseText;
                        if(s.done!=undefined && typeof s.done=="function") {
                            s.done(result);
                        }
                    } else {
                        if(s.error!=undefined && typeof s.error=="function") {
                            s.error(result);
                        }
                    }
                }
            }

            myXHR.open(_method, _url, _async);
            myXHR.send();
        }

        THK.bind = function(elem, eventName, func, bubble) {
            if(typeof elem==="object") {
                if(elem.length!=undefined) {
                    for(var i=0; i<elem.length; i++) 
                        THK._addEventListener(elem, eventName, func, bubble);
                } else {
                    THK._addEventListener(elem, eventName, func, bubble);
                }
            } else {
                return "First args is not a DOM element!";
            }

            return "no error";
        }

        THK._addEventListener = function(elem, evName, func, bubble) {
            bubble = bubble || false;

            if (typeof window.addEventListener != "undefined") {
                elem.addEventListener(evName, func, bubble);
            } else {
                elem.attachEvent(evName, func)
            }
        }

        THK.get = function(type, str) {
            var ret;

            switch(type) {
                case "id":
                    ret = document.getElementById(str);
                    break;

                case "class":
                    ret = document.getElementsByClassName(str);
                    break;

                case "tag":
                    ret = document.getElementsByTagName(str);
                    break;

                case "name":
                    ret = document.getElementsByName(str);
                    break;

                case "tagNS":
                    ret = document.getElementsByTagNameNS(str);
                    break;

                default:
                    break;
            }

            return ret;
        }

        /**
         * @param: 
         *   element (optional).
         */
        THK.html = function(text, element) {
            if(element==undefined) {
                element = this.elements;
            } else if(typeof element=="object" && element.length==undefined) {
                element = new Array(element);
            }

            for(var i=0; i<element.length; i++) {
                while (element[i].firstChild!==null)
                    element[i].removeChild(element[i].firstChild);

                element[i].appendChild(document.createTextNode(text));
            }
        }

        THK.val = function(value, element) {
            if(element==undefined) {
                element = this.elements;
            } else if(typeof element=="object" && element.length==undefined) {
                element = new Array(element);
            }

            for(var i=0; i<element.length; i++) {
                element[i].value = value;
            }
        }

        THK.load = function(func, element) {
            if(element==undefined) {
                element = this.elements;
            } else if(typeof element=="object" && element.length==undefined) {
                element = new Array(element);
            }

            for(var i=0; i<element.length; i++) {
                element[i].onload = func;
            }
        }

        THK.selector = function(str) {
            var first_char = str.substring(0, 1),
                name = str.substr(1),
                result = new Array(),
                tmp;

            switch(first_char) {
                case "#":
                    tmp = THK.get("id", name);
                    break;

                case ".":
                    tmp = THK.get("class", name);
                    break;

                default:
                    tmp = THK.get("tag", str);
                    break;
            }

            switch(typeof tmp) {
                case "undefined":
                    break;

                case "object":
                    if(tmp===null) 
                        break;

                    if(tmp.length==undefined) {
                        result.push(tmp);
                    } else {
                        for(var i=0; i<tmp.length; i++) {
                            result.push(tmp[i]);
                        }
                    }
                    break;

                default:
                    break;
            }

            return result;
        };

        /**
         * Creates an object from URL encoded data
         */
        THK.createObjFromURI = function() {
            var uri = decodeURI(location.search.substr(1));
            var chunks = uri.split('&');
            var params = Object();

            for (var i=0; i < chunks.length ; i++) {
                var chunk = chunks[i].split('=');
                if(chunk[0].search("\\[\\]") !== -1) {
                    if( typeof params[chunk[0]] === 'undefined' ) {
                        params[chunk[0]] = [chunk[1]];

                    } else {
                        params[chunk[0]].push(chunk[1]);
                    }


                } else {
                    params[chunk[0]] = chunk[1];
                }
            }

            return params;
        };

        THK.newElement = function(type, attr, cont, html) {
            var ne = document.createElement(type);
            if (!ne)
                return 0;
        
            for (var a in attr)
                ne[a] = attr[a];
    
            var t = typeof(cont);
    
            if(t=="string" && !html)
                ne.appendChild( document.createTextNode(cont) );
            else if(t=="string" && html)
                ne.innerHTML = cont;
            else if(t=="object")
                ne.appendChild(cont);

            return ne;
        };

        THK.newText = function(text) {
            return document.createTextNode(text);
        };

        THK.remove = function(name) {
            var e = THK.selector(name);

            for(var i=0; i<e.length; i++) {
                e[i].parentNode.removeChild(e[i]);
            }
        };

        THK.parseJson = function(data) {
            if(typeof data=="string") {
                data = data.trim();
            } else {
                return data;
            }

            if(data==null || data=="")
                return {};

            if( window.JSON && window.JSON.parse ) {
                return window.JSON.parse( data );
            }

            return eval('(' + data + ')');
        };

        THK.offset = function (e) {
            var obj = e;
            var curleft = 0;
            
            if (obj.offsetParent) {
                while (obj.offsetParent) {
                    curleft += obj.offsetLeft;
                    obj = obj.offsetParent;
                }
            } else if (obj.x) {
                curleft += obj.x;
            }

            var obj = e;
            var curtop = 0;
            if (obj.offsetParent) {
                while (obj.offsetParent) {
                    curtop += obj.offsetTop;
                    obj = obj.offsetParent;
                }
            } else if (obj.y) {
                curtop += obj.y;
            }

            return {x:curleft, y:curtop};
        };

        /**
         * function alias for THK.*
         */
        THK.in_array = in_array;
        THK.LoadScript = LoadScript;
        THK.str_repeat = str_repeat;
        THK.sprintf = sprintf;
        THK.getTimestamp = getTimestamp;
        THK.getDate = getDate;
        THK.addCommas = addCommas;
        THK.trace = trace;
        THK._D = _D;

    } // end of THK

    window.THK = THK;
    if ( typeof define === "function" ) {
        define( "THK", [], function () { 
                return THK; 
            } 
        );
    }
    
})( window );






/* Load javascript file into html */
function LoadScript(scriptName) {
    var elm = document.createElement('script');
    elm.type = "text/javascript";
    elm.src = scriptName;
    document.body.appendChild(elm);
}

function str_repeat(i, m) {
    for (var o = []; m > 0; o[--m] = i);
    return o.join('');
}

function sprintf() {
    var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
    while (f) {
        if (m = /^[^\x25]+/.exec(f)) {
            o.push(m[0]);
        }
        else if (m = /^\x25{2}/.exec(f)) {
            o.push('%');
        }
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
            if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                throw('Too few arguments.');
            }
            if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                throw('Expecting number but found ' + typeof(a));
            }
            switch (m[7]) {
                case 'b': a = a.toString(2); break;
                case 'c': a = String.fromCharCode(a); break;
                case 'd': a = parseInt(a); break;
                case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                case 'o': a = a.toString(8); break;
                case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                case 'u': a = Math.abs(a); break;
                case 'x': a = a.toString(16); break;
                case 'X': a = a.toString(16).toUpperCase(); break;
            }
            a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
            c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
            x = m[5] - String(a).length - s.length;
            p = m[5] ? str_repeat(c, x) : '';
            o.push(s + (m[4] ? a + p : p + a));
        } else {
            throw('Huh ?!');
        }
        f = f.substring(m[0].length);
    }
    return o.join('');
}    

function getTimestamp(strip) {
    if(strip==true)
        return Math.round(new Date().getTime() / 1000);
    else
        return new Date().getTime();
}

function getDate(ts) {
    var timestamp = ts || getTimestamp() || 1301090400,
        date = new Date(timestamp * 1000),
        datevalues = [
             date.getFullYear()
            ,date.getMonth()+1
            ,date.getDate()
            ,date.getHours()
            ,date.getMinutes()
            ,date.getSeconds()
         ];
    
    return datevalues;
}

function trace(msg) {
    if (THK.debug) {
        if (window.console) {
            console.log(msg);
        } else if ( typeof( jsTrace ) != 'undefined' ) {
            jsTrace.send( msg );
        } else {}
    }
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * for Debug
**/
function _D(object){
    try { 
        if(G_DEBUG==false)
            return ;
        
        throw Error('') 
    } catch(err) {
        var caller_line = err.stack.split("\n")[3];
        var index = caller_line.indexOf("at ");
        var clean = caller_line.slice(index+2, caller_line.length);
        console.log("%o  "+clean, object);
    }
}

function in_array (needle, haystack, argStrict) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: vlado houba
    // +   input by: Billy
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true
    // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    // *     returns 2: false
    // *     example 3: in_array(1, ['1', '2', '3']);
    // *     returns 3: true
    // *     example 3: in_array(1, ['1', '2', '3'], false);
    // *     returns 3: true
    // *     example 4: in_array(1, ['1', '2', '3'], true);
    // *     returns 4: false
    var key = '',
        strict = !! argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}

function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

if (!String.prototype.trim) {
    String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};
}
