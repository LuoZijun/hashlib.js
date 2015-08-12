
// Just Like Python Range function.
function range (start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);
    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }
    return range;
}

// Like python .....
function unichr (code){
    return String.fromCharCode(parseInt(code));
};
function ord(char){
    return char.charCodeAt(0);
}

function repr(s) {
    var bytes = s.bytes();
    var hex_codes = [];
    var is_unicode = bytes.every(function (byte, i){
        console.log( byte );
        var hex_code = byte.toString(16);
        hex_codes.push( hex_code );
        return hex_code == parseInt(hex_code).toString();
    });
    if ( is_unicode == true ) {
        return hex_codes.join("\\u");
    } else {
        return hex_codes.join("\\x");
    }
}

// Like Rust.
String.prototype.to_utf8 = function (){
    // http://monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
    return unescape(encodeURIComponent(this));
};
String.prototype.from_utf8 = function (){
    try{
        return decodeURIComponent(escape(this));
    }catch(e){
        console.warn("invalid UTF-8 ...");
        return this;
    }
};
String.prototype.chars = function (){
    var self = this;
    return range(this.length).map(function (i){
        return self[i];
    });
};
String.prototype.bytes = function (){
    var self = this;
    return range(this.length).map(function (i){
        return ord(self[i]);
    });
};



// 摘要算法 集合
if ( !this.hashlib ) hashlib = {};

/*
    摘要算法: MD5
    参考: https://raw.githubusercontent.com/blueimp/JavaScript-MD5/master/js/md5.js
    
*/
hashlib.md5 = function (message){
    this.version = 0.1;
    this.name = "md5";
    this.message = "";    // UTF-8 Strings
    this.data = "";
    this.update(message);
};
hashlib.md5.prototype.update = function (message){
    if ( !message ) var message;
    if ( typeof message != "string" ) message = "";
    // Encode a string as utf-8
    this.message += message.to_utf8();

};
hashlib.md5.prototype.run = function (){
    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    var rstr2binl = function (input){
        var i, output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    };

    /*
    * Convert an array of little-endian words to a string
    */
    var binl2rstr = function (input){
        var i, output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += unichr((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    };
    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    var safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    var bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    var md5_cmn = function (q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    };
    var md5_ff = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    var md5_gg = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    var md5_hh = function (a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    var md5_ii = function (a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    var binl_md5 = function (x, len){
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    };

    // RAW MD5
    return binl2rstr( binl_md5(rstr2binl(this.message), this.message.length * 8) );
};
hashlib.md5.prototype.digest = function (){
    return this.run();
};
hashlib.md5.prototype.hexdigest = function (){
    return this.run().bytes().map(function (byte, i){
        var hex_code = byte.toString(16);
        if ( hex_code.length == 1 ) return "0"+hex_code;
        else return hex_code;
    }).join("");
};


/*
    摘要算法: SHA1
    参考: 
        https://github.com/kazuho/sha1.min.js/blob/master/src/sha1.js
        http://pajhome.org.uk/crypt/md5/sha1.html
*/
hashlib.sha1 = function (message){
    this.version = 0.1;
    this.name = "sha1";
    this.message = "";    // UTF-8 Strings
    this.data = "";
    this.update(message);
};
hashlib.sha1.prototype.update = function (message){
    if ( !message ) var message;
    if ( typeof message != "string" ) message = "";
    // Encode a string as utf-8
    this.message += message.to_utf8();
};
hashlib.sha1.prototype.run = function (){
    
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    var safe_add = function (x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    var bit_rol = function (num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    };
    /*
     * Determine the appropriate additive constant for the current iteration
     */
    var sha1_kt = function (t) {
      return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
             (t < 60) ? -1894007588 : -899497514;
    };
    /*
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    var sha1_ft = function (t, b, c, d) {
      if(t < 20) return (b & c) | ((~b) & d);
      if(t < 40) return b ^ c ^ d;
      if(t < 60) return (b & c) | (b & d) | (c & d);
      return b ^ c ^ d;
    };

    /*
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    var binb_sha1 = function (x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << (24 - len % 32);
      x[((len + 64 >> 9) << 4) + 15] = len;

      var w = [];
      var a =  1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d =  271733878;
      var e = -1009589776;

      for(var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for(var j = 0; j < 80; j++) {
          if(j < 16) w[j] = x[i + j];
          else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
          var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                           safe_add(safe_add(e, w[j]), sha1_kt(j)));
          e = d;
          d = c;
          c = bit_rol(b, 30);
          b = a;
          a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
      }
      return [a, b, c, d, e];
    };
    /*
     * Convert a raw string to an array of big-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    var rstr2binb = function (input){
      var output = [];
      for(var i = 0; i < input.length * 8; i += 8)
        output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
      return output;
    };
    /*
     * Convert an array of big-endian words to a string
     */
    var binb2rstr = function (input) {
        var output = "";
        for(var i = 0; i < input.length * 32; i += 8)
            output += unichr((input[i>>5] >> (24 - i % 32)) & 0xFF);
        return output;
    };
    // /*
    //  * Convert a raw string to a hex string
    //  */
    // var rstr2hex = function (input){
    //   var output = "";
    //   var x;
    //   for(var i in input) {
    //     x = input.charCodeAt(i);
    //     output += ((x >> 4) & 0x0F).toString(16)
    //            +  ( x        & 0x0F).toString(16);
    //   }
    //   return output;
    // };
    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    // var str2rstr_utf8 = function (input){
    //   var output = "";
    //   var i = -1;
    //   var x, y;

    //   while(++i < input.length) {
    //     /* Decode utf-16 surrogate pairs */
    //     x = input.charCodeAt(i);
    //     y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    //     if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
    //       x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
    //       i++;
    //     }
    //     /* Encode output as utf-8 */
    //     if(x <= 0x7F)
    //       output += fromCharCode(x);
    //     else if(x <= 0x7FF)
    //       output += fromCharCode(0xC0 | ((x >> 6 ) & 0x1F),
    //                                     0x80 | ( x         & 0x3F));
    //     else if(x <= 0xFFFF)
    //       output += fromCharCode(0xE0 | ((x >> 12) & 0x0F),
    //                                     0x80 | ((x >> 6 ) & 0x3F),
    //                                     0x80 | ( x         & 0x3F));
    //     else if(x <= 0x1FFFFF)
    //       output += fromCharCode(0xF0 | ((x >> 18) & 0x07),
    //                                     0x80 | ((x >> 12) & 0x3F),
    //                                     0x80 | ((x >> 6 ) & 0x3F),
    //                                     0x80 | ( x         & 0x3F));
    //   }
    //   return output;
    // };

    /*
     * Convert a raw string to a hex string
     */
    var rstr2hex = function (input){
      var output = "";
      var x;
      for(var i in input) {
        x = input.charCodeAt(i);
        output += ((x >> 4) & 0x0F).toString(16)
               +  ( x        & 0x0F).toString(16);
      }
      return output;
    };
    // RAW SHA1
    return binb2rstr( binb_sha1(rstr2binb(this.message), this.message.length * 8) );
};
hashlib.sha1.prototype.digest = function (){
    return this.run();
};
hashlib.sha1.prototype.hexdigest = function (){
    return this.run().bytes().map(function (byte, i){
        var hex_code = byte.toString(16);
        if ( hex_code.length == 1 ) return "0"+hex_code;
        else return hex_code;
    }).join("");
};

/*
    摘要算法: SHA 256
    参考: 
        https://github.com/chrisveness/crypto/blob/master/sha256.js
        http://www.movable-type.co.uk/scripts/sha256.html
        http://csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA256.pdf
*/
hashlib.sha256 = function (message){
    this.version = 0.1;
    this.name = "sha256";
    this.message = "";    // UTF-8 Strings
    this.data = "";
    this.update(message);
};
hashlib.sha256.prototype.update = function (message){
    if ( !message ) var message;
    if ( typeof message != "string" ) message = "";
    // Encode a string as utf-8
    this.message += message.to_utf8();
};
hashlib.sha256.prototype.run = function (){
    var msg = this.message;
    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     */
    var ROTR = function(n, x) {
        return (x >>> n) | (x << (32-n));
    };
    /**
     * Logical functions [§4.1.2].
     */
    var Σ0  = function(x) { return ROTR(2,  x) ^ ROTR(13, x) ^ ROTR(22, x); };
    var Σ1  = function(x) { return ROTR(6,  x) ^ ROTR(11, x) ^ ROTR(25, x); };
    var σ0  = function(x) { return ROTR(7,  x) ^ ROTR(18, x) ^ (x>>>3);  };
    var σ1  = function(x) { return ROTR(17, x) ^ ROTR(19, x) ^ (x>>>10); };
    var Ch  = function(x, y, z) { return (x & y) ^ (~x & z); };
    var Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };

    // constants [§4.2.2]
    var K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];

     // initial hash value [§5.3.1]
    var H = [ 0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

    // PREPROCESSING 
    msg += unichr(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
                      (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

    // HASH COMPUTATION [§6.1.2]
    var W = new Array(64); var a, b, c, d, e, f, g, h;
    for (var i=0; i<N; i++) {
        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<64; t++) W[t] = (σ1(W[t-2]) + W[t-7] + σ0(W[t-15]) + W[t-16]) & 0xffffffff;
        // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
        a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];
        // 3 - main loop (note 'addition modulo 2^32')
        for (var t=0; t<64; t++) {
            var T1 = h + Σ1(e) + Ch(e, f, g) + K[t] + W[t];
            var T2 =     Σ0(a) + Maj(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) & 0xffffffff;
        }
         // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H[0] = (H[0]+a) & 0xffffffff;
        H[1] = (H[1]+b) & 0xffffffff; 
        H[2] = (H[2]+c) & 0xffffffff; 
        H[3] = (H[3]+d) & 0xffffffff; 
        H[4] = (H[4]+e) & 0xffffffff;
        H[5] = (H[5]+f) & 0xffffffff;
        H[6] = (H[6]+g) & 0xffffffff; 
        H[7] = (H[7]+h) & 0xffffffff; 
    }


    var toHexStr = function(n) {
        // note can't use toString(16) as it is implementation-dependant,
        // and in IE returns signed numbers when used on full words
        var s="", v;
        for (var i=7; i>=0; i--) { 
            v = (n>>>(i*4)) & 0xf;
            s += v.toString(16);
        }
        return s;
    };
    /*
        CODE:  SHA256

        String: hi, 我是ABC.
        Bin: \x92\x9a|p\xa05g\x9b\xc3\x9d]\x05U6*\xb3\xa8m\xbd%M\xb1hi\x11\x81\xfb\xfc\x97\x1a\xe4\xb1
            map( lambda s: ord(s), list(bin) )
                [
                    146, 154, 124, 112, 160, 53, 103, 155, 
                    195, 157, 93, 5, 85, 54, 42, 179, 168, 
                    109, 189, 37, 77, 177, 104, 105, 17, 
                    129, 251, 252, 151, 26, 228, 177
                ]

        Hex:
            929a7c70a035679bc39d5d0555362ab3a86dbd254db168691181fbfc971ae4b1 (Python)
            929a7c70a035679bc39d5d0555362ab3a86dbd254db168691181fbfc971ae4b1

    
        0XF:
            [9, 2, 9, 10, 7, 12, 7, 0]
            [10, 0, 3, 5, 6, 7, 9, 11]
            [12, 3, 9, 13, 5, 13, 0, 5]
            [5, 5, 3, 6, 2, 10, 11, 3]
            [10, 8, 6, 13, 11, 13, 2, 5]
            [4, 13, 11, 1, 6, 8, 6, 9]
            [1, 1, 8, 1, 15, 11, 15, 12]
            [9, 7, 1, 10, 14, 4, 11, 1]

        0XFF:
            [9, 146, 41, 154, 167, 124, 199, 112]
            [10, 160, 3, 53, 86, 103, 121, 155]
            [12, 195, 57, 157, 213, 93, 208, 5]
            [5, 85, 83, 54, 98, 42, 171, 179]
            [10, 168, 134, 109, 219, 189, 210, 37]
            [4, 77, 219, 177, 22, 104, 134, 105]
            [1, 17, 24, 129, 31, 251, 191, 252]
            [9, 151, 113, 26, 174, 228, 75, 177]

    */
    var wordsToString = function (H){
        return H.map(function (w, i){
            var i, v;
            var s = [];
            for (i=7; i>=0; i--) {
                v =  (w>>>(i*4)) & 0xFF;
                s.push( unichr(v) );
            }
            return s.map(function (b, i){
                if ( (i+1) % 2 == 0) return b;
                else return undefined;
            }).filter(function (v){
                return v != undefined;
            }).join("");
        }).join("");
    };

    return wordsToString(H);
};
hashlib.sha256.prototype.digest = function (){
    return this.run();
};
hashlib.sha256.prototype.hexdigest = function (){
    return this.run().bytes().map(function (byte, i){
        var hex_code = byte.toString(16);
        if ( hex_code.length == 1 ) return "0"+hex_code;
        else return hex_code;
    }).join("");
};