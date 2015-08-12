JavaScript Hashlib
==================

:Date: 2015/08/12

.. contents::

*参考代码*: 

    http://www.movable-type.co.uk/scripts/sha256.html
    http://www.movable-type.co.uk/scripts/sha1.html
    https://github.com/chrisveness/crypto

*SHA家族代码范例*:
    
    `NIST SHA1 <http://csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA1.pdf>`_

    `NIST SHA256 <http://csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA256.pdf>`_

*NIST文档*:
    
    `NIST FIPS-202 SHA3 Standard <http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf>`_

    `NIST FIPS-180-4 <http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf>`_


支持的摘要算法
------------------------

*   MD5
*   SHA1
*   SHA256


用例
--------------

1.  引入 hashlib.js 至你的页面当中

.. code:: html

    <script type="text/javascript" src="hashlib.js"></script>

2.  调用相关摘要算法

.. code:: javascript
    
    // MD5 
    var md5 = new hashlib.md5();
    md5.update("plain text");
    b = md5.digest();   // binary
    hex_code = md5.hexdigest();   // hex code.
    // 929a7c70a035679bc39d5d0555362ab3a86dbd254db168691181fbfc971ae4b1

    // SHA1
    var sha1 = new hashlib.sha1(); // Or var sha1 = new hashlib.sha1( "Plain Text" );
    sha1.update("plain text");
    b = sha1.digest();   // binary
    hex_code = sha1.hexdigest();   // hex code.
    // 929a7c70a035679bc39d5d0555362ab3a86dbd254db168691181fbfc971ae4b1

    // SHA256
    var sha256 = new hashlib.sha256();
    sha256.update("plain text");
    b = sha256.digest();   // binary
    hex_code = sha256.hexdigest();   // hex code.
    // 929a7c70a035679bc39d5d0555362ab3a86dbd254db168691181fbfc971ae4b1

