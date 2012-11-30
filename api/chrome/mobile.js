// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

define('chrome.mobile.impl', function(require, module) {
  var chrome = window.chrome;
  var exports = module.exports;

  exports.fgWindow = window;
  exports.bgWindow = null;
  exports.eventIframe = null;

  exports.init = function() {
    // Self-destruct so that code in here can be GC'ed.
    exports.init = null;
    var iframe = document.createElement('iframe');
    iframe.src = 'chromebgpage.html';
    iframe.style.display = 'none';
    exports.eventIframe = iframe;
    document.body.appendChild(iframe);
  };

  exports.bgInit = function(bgWnd) {
    // Self-destruct so that code in here can be GC'ed.
    exports.bgInit = null;
    exports.bgWindow = bgWnd;
    bgWnd.chrome = chrome;

    function onLoad() {
      bgWnd.removeEventListener('load', onLoad, false);
      setTimeout(function() {
        chrome.app.runtime.onLaunched.fire();
      }, 0);
    }
    bgWnd.addEventListener('load', onLoad, false);

    var manifestJson = chrome.runtime.getManifest();
    var scripts = manifestJson.app.background.scripts;
    var toWrite = '';
    for (var i = 0, src; src = scripts[i]; ++i) {
      toWrite += '<script src="' + encodeURI(src) + '"></sc' + 'ript>\n';
    }
    bgWnd.document.write(toWrite);
  };
});