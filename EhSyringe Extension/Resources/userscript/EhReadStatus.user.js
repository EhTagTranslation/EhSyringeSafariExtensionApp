// ==UserScript==
// @name         eh阅读状态
// @namespace    com.xioxin.EhTagReadStatus
// @version      0.1
// @description  利用css ":visited" 特性在标题前增加阅读状态指示
// @author       xioxin
// @include     *://exhentai.org/*
// @include     *://e-hentai.org/*
// @grant    GM_addStyle
// ==/UserScript==

function GM_addStyle(script){
    var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = script
	document.getElementsByTagName("HEAD").item(0).appendChild(style); 
}

function GM_setValue(key, val) {localStorage.setItem(key, JSON.stringify(val))}

function GM_getValue(key, val) {return JSON.parse(localStorage.getItem(key)||'null') || val }


document.addEventListener('DOMContentLoaded',async function(){
    GM_addStyle(`
    .itg a .glink::before {
        content: "●";
        color: #1a9317;
        padding-right: 4px;
    }
    .itg a:visited .glink::before {
        color: #aaa;
    }`);
});
