// ==UserScript==
// @name         eh漫画语言快捷按钮
// @namespace    com.xioxin.translatedJump
// @version      0.6
// @description  快速跳转到其他漫画语言版本
// @author       xioxin
// @include     *://exhentai.org/g/*
// @include     *://e-hentai.org/g/*
// @grant    GM_addStyle
// ==/UserScript==

function GM_addStyle(script){
    var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML=script
	document.getElementsByTagName("HEAD").item(0).appendChild(style); 
}

function GM_setValue(key, val) {localStorage.setItem(key, JSON.stringify(val))}

function GM_getValue(key, val) {return JSON.parse(localStorage.getItem(key)||'null') || val }


const languagePriority = ['chinese', 'japanese', 'english'];
const languages = `
albanian 阿尔巴尼亚语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
arabic 阿拉伯语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
bengali 孟加拉语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
catalan 加泰罗尼亚语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
cebuano 宿务语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
chinese 汉语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjM0IiByPSIxLjc1IiBmaWxsPSIjZjFiMzFjIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMS43NSIgZmlsbD0iI2YxYjMxYyIvPjxjaXJjbGUgY3g9IjI4IiBjeT0iMzEiIHI9IjEuNzUiIGZpbGw9IiNmMWIzMWMiLz48Y2lyY2xlIGN4PSIyOCIgY3k9IjI2IiByPSIxLjc1IiBmaWxsPSIjZjFiMzFjIi8+PHBhdGggZmlsbD0iI2YxYjMxYyIgc3Ryb2tlPSIjZjFiMzFjIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xMy41MjggMzIuNDQ1bDIuNDcyLTggMi40NzMgOEwxMiAyNy41aDhsLTYuNDcyIDQuOTQ1eiIvPjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik01IDE3aDYydjM4SDV6Ii8+PC9nPjwvc3ZnPg==
czech 捷克语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
danish 丹麦语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
dutch 荷兰语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
english 英语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzFlNTBhMCIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDAgMjguODU2VjMyaDEwLjE4MUw2NyAyMS42OTFWMTdoLTcuNjU0TDQwIDI4Ljg1NnoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNjcgMTdoLTMuODI3TDQwIDMxLjIwM1YzMmgzLjQ4Mkw2NyAxNy41ODZWMTd6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTU5LjM0NyA1NUg2N3YtNC42OTJMNTAuMTgyIDQwSDQwdjMuMTQzTDU5LjM0NyA1NXoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNjcgNTV2LTIuMzQ3TDQ2LjM1NSA0MGgtNC43ODdsMjQuNDc0IDE1SDY3eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMiA0My4xNDRWNDBIMjEuODE5TDUgNTAuMzA5VjU1aDcuNjU0TDMyIDQzLjE0NHoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNSA1NWgzLjgyN0wzMiA0MC43OTdWNDBoLTMuNDgyTDUgNTQuNDE0VjU1eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi42NTMgMTdINXY0LjY5MkwyMS44MTggMzJIMzJ2LTMuMTQzTDEyLjY1MyAxN3oiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNSAxN3YyLjM0N0wyNS42NDYgMzJoNC43ODZMNS45NTggMTdINXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNSAzMWg2MnYxMEg1eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMSAxN2gxMHYzOEgzMXoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNSAzM2g2MnY2SDV6Ii8+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTMzIDE3aDZ2MzhoLTZ6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
esperanto 世界语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzYiIGN5PSIzNiIgcj0iMjgiIGZpbGw9IiM5MkQzRjUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjM2IiBjeT0iMzYiIHI9IjI4Ii8+PHBhdGggZD0iTTM2IDh2NTZjLTguNTYgMC0xNS41LTEyLjUzNi0xNS41LTI4UzI3LjQ0IDggMzYgOGM4LjU2IDAgMTUuNSAxMi41MzYgMTUuNSAyOFM0NC41NiA2NCAzNiA2NE02NCAzNkg4TTYwIDIySDEyTTYwIDUwSDEyIi8+PC9nPjwvc3ZnPg==
estonian 爱沙尼亚语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBkPSJNNSAzMGg2MnYxMkg1eiIvPjxwYXRoIGZpbGw9IiMxZTUwYTAiIGQ9Ik01IDE3aDYydjEzSDV6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
finnish 芬兰语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjMWU1MGEwIiBzdHJva2U9IiMxZTUwYTAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNjcgMzNIMzBWMTdoLTZ2MTZINXY2aDE5djE2aDZWMzloMzd2LTZ6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
french 法语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjMWU1MGEwIiBkPSJNNSAxN2gyMXYzOEg1eiIvPjxwYXRoIGZpbGw9IiNkMjJmMjciIGQ9Ik00NiAxN2gyMXYzOEg0NnoiLz48Zz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvZz48L3N2Zz4=
german 德语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjMWU1MGEwIiBkPSJNNSAxN2gyMXYzOEg1eiIvPjxwYXRoIGZpbGw9IiNkMjJmMjciIGQ9Ik00NiAxN2gyMXYzOEg0NnoiLz48Zz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvZz48L3N2Zz4=
greek 希腊语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjMWU1MGEwIiBkPSJNNSAzNGg2MnY0SDV6TTUgMjUuNzVoNjJ2NEg1ek01IDQyLjI1aDYydjRINXpNNSA1MGg2MnY1SDV6TTUgMTdoNjJ2NUg1eiIvPjxwYXRoIGZpbGw9IiMxZTUwYTAiIGQ9Ik01IDE3aDIydjIxSDV6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE0LjUgMTdoNHYyMmgtNHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNSAyNS43NWgyMnY0SDV6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
hebrew 希伯来语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
hindi 印地语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
hungarian 匈牙利语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzVjOWUzMSIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNSAxN2g2MnYxM0g1eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01IDMwaDYydjEySDV6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
indonesian 印尼语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNSAzNmg2MnYxOUg1eiIvPjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik01IDE3aDYydjM4SDV6Ii8+PC9nPjwvc3ZnPg==
italian 意大利语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjNWM5ZTMxIiBkPSJNNSAxN2gyMXYzOEg1eiIvPjxwYXRoIGZpbGw9IiNkMjJmMjciIGQ9Ik00NiAxN2gyMXYzOEg0NnoiLz48Zz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvZz48L3N2Zz4=
japanese 日语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48Y2lyY2xlIGN4PSIzNiIgY3k9IjM2IiByPSI5IiBmaWxsPSIjZDIyZjI3Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
korean 韩语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48Y2lyY2xlIGN4PSIzNiIgY3k9IjM2IiByPSI5IiBmaWxsPSIjZDIyZjI3Ii8+PGcgZmlsbD0iIzFlNTBhMCI+PHBhdGggZD0iTTI4LjEyNyAzMS42NzZBNC40OTIgNC40OTIgMCAwIDAgMzYgMzZjLjAyMy0uMDQuMDM0LS4wODMuMDU1LS4xMjNsLjAyNC4wMTRhNC40OTMgNC40OTMgMCAwIDEgNy43MjQgNC41OWwuMDAzLjAwMmE4Ljk5MiA4Ljk5MiAwIDAgMS0xNS42OC04LjgwN3pNMjguMzMxIDMxLjI4N2wuMDIuMDExYy0uMDMuMDQ2LS4wNjcuMDg1LS4wOTUuMTMzLjAyNy0uMDQ3LjA0Ny0uMDk4LjA3NS0uMTQ0eiIvPjwvZz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTI0LjIzMiA0MS45MDJsMyA1LjE5Nk0yMC43NjggNDMuOTAybDMgNS4xOTZNMjIuNSA0Mi45MDJsMSAxLjczMk0yNC41IDQ2LjM2NmwxIDEuNzMyIi8+PGc+PHBhdGggZD0iTTQ1LjUgNDguMDk4bDEtMS43MzJNNDcuNSA0NC42MzRsMS0xLjczMk00Ny4yMzIgNDkuMDk4bDEtMS43MzJNNDkuMjMyIDQ1LjYzNGwxLTEuNzMyTTQzLjc2OCA0Ny4wOThsMS0xLjczMk00NS43NjggNDMuNjM0bDEtMS43MzIiLz48L2c+PGc+PHBhdGggZD0iTTIwLjc2OCAyOC4wOThsMy01LjE5Nk0yMi41IDI5LjA5OGwzLTUuMTk2TTI0LjIzMiAzMC4wOThsMy01LjE5NiIvPjwvZz48Zz48cGF0aCBkPSJNNDQuNzY4IDI0LjkwMmwxIDEuNzMyTTQ2Ljc2OCAyOC4zNjZsMSAxLjczMk00OC4yMzIgMjIuOTAybDEgMS43MzJNNTAuMjMyIDI2LjM2NmwxIDEuNzMyTTQ2LjUgMjMuOTAybDMgNS4xOTYiLz48L2c+PC9nPjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik01IDE3aDYydjM4SDV6Ii8+PC9nPjwvc3ZnPg==
mongolian 蒙古语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzFlNTBhMCIgZD0iTTUuMjI3IDE3aDYydjM4aC02MnoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNS4yMjcgMTdoMjF2MzhoLTIxek00Ni4yMjcgMTdoMjF2MzhoLTIxeiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMjkiIHI9IjEiIGZpbGw9IiNmY2VhMmIiIHN0cm9rZT0iI2ZjZWEyYiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjQxIiByPSIxIiBmaWxsPSIjZmNlYTJiIiBzdHJva2U9IiNmY2VhMmIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZmlsbD0iI2ZjZWEyYiIgc3Ryb2tlPSIjZmNlYTJiIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE3IDI0YTEgMSAwIDAgMS0yIDBsMS0xek0xNSAzM2gybC0xIDEtMS0xek0xNSA0OGgybC0xIDEtMS0xek0xNSAzN2gyTTE1IDQ1aDJNMTEgMzNoMXYxNmgtMXpNMjAgMzNoMXYxNmgtMXoiLz48Zz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvZz48L3N2Zz4=
norwegian 挪威语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjMWU1MGEwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNjcgMzNIMzBWMTdoLTZ2MTZINXY2aDE5djE2aDZWMzloMzd2LTZ6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
polish 波兰语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNNSAzNmg2MnYxOUg1eiIvPjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik01IDE3aDYydjM4SDV6Ii8+PC9nPjwvc3ZnPg==
portuguese 葡萄牙语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjNWM5ZTMxIiBkPSJNNSAxN2gyMXYzOEg1eiIvPjxjaXJjbGUgY3g9IjI2IiBjeT0iMzYiIHI9IjEyIiBmaWxsPSJub25lIiBzdHJva2U9IiNmY2VhMmIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmNlYTJiIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yNiAyNHYyNE0yNiAzOS41TDE3IDQ0aDE4bC05LTQuNXpNMjYgMzMuNWw5LTUuNS04LjUgMS41TDE3IDI4bDkgNS41eiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZjZWEyYiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMzggMzZsLTEyIDUtMTItNSAxMi01IDEyIDV6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZDIyZjI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTIwLjIgMjloMTEuNnYxMC4xYzAgMi41LTIuNiA0LjYtNS44IDQuNi0zLjIgMC01LjgtMi4xLTUuOC00LjZWMjl6Ii8+PGNpcmNsZSBjeD0iMjYiIGN5PSIzMi44IiByPSIuNyIgZmlsbD0iIzFlNTBhMCIgc3Ryb2tlPSIjMWU1MGEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48Y2lyY2xlIGN4PSIyNiIgY3k9IjM4LjciIHI9Ii43IiBmaWxsPSIjMWU1MGEwIiBzdHJva2U9IiMxZTUwYTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjI2IiBjeT0iMzUuNyIgcj0iLjciIGZpbGw9IiMxZTUwYTAiIHN0cm9rZT0iIzFlNTBhMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PGNpcmNsZSBjeD0iMjkiIGN5PSIzNS43IiByPSIuNyIgZmlsbD0iIzFlNTBhMCIgc3Ryb2tlPSIjMWU1MGEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48Y2lyY2xlIGN4PSIyMyIgY3k9IjM1LjciIHI9Ii43IiBmaWxsPSIjMWU1MGEwIiBzdHJva2U9IiMxZTUwYTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik01IDE3aDYydjM4SDV6Ii8+PC9nPjwvc3ZnPg==
romanian 罗马尼亚语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2YxYjMxYyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjMWU1MGEwIiBkPSJNNSAxN2gyMXYzOEg1eiIvPjxwYXRoIGZpbGw9IiNkMjJmMjciIGQ9Ik00NiAxN2gyMXYzOEg0NnoiLz48Zz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvZz48L3N2Zz4=
russian 俄语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNSAxN2g2MnYxM0g1eiIvPjxwYXRoIGZpbGw9IiMxZTUwYTAiIGQ9Ik01IDMwaDYydjEySDV6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
slovak 斯洛伐克语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZDBjZmNlIiBkPSJNNSAxN2g2MnYxM0g1eiIvPjxwYXRoIGZpbGw9IiMxZTUwYTAiIGQ9Ik01IDMwaDYydjEySDV6Ii8+PHBhdGggZmlsbD0iI2QyMmYyNyIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yMy44MzMgNDVzNi43NS0yLjI1IDYuNzUtOXYtOWgtMTMuNXY5YzAgNi43NSA2Ljc1IDkgNi43NSA5eiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0yMy44MzMgMjkuNXYxMk0yMS44MzMgMzEuNWg0TTIwLjMzMyAzNC41aDciLz48Y2lyY2xlIGN4PSIyMy44MzMiIGN5PSI0MS41IiByPSIzLjE2NyIgZmlsbD0iIzFlNTBhMCIvPjxwYXRoIGZpbGw9IiMxZTUwYTAiIGQ9Ik0xOS4yNSAzOS4zMzNhMi4xNDYgMi4xNDYgMCAwIDAtMS4zMjcuNDY1IDkuNTggOS41OCAwIDAgMCAyLjcwMyAzLjM2MyAyLjE1OCAyLjE1OCAwIDAgMC0xLjM3Ni0zLjgyOHpNMjguNDE3IDM5LjMzM2EyLjE1OCAyLjE1OCAwIDAgMC0xLjM3NiAzLjgyOCA5LjU4IDkuNTggMCAwIDAgMi43MDItMy4zNjMgMi4xNDYgMi4xNDYgMCAwIDAtMS4zMjYtLjQ2NXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTIzLjgzMyA0NXM2Ljc1LTIuMjUgNi43NS05di05aC0xMy41djljMCA2Ljc1IDYuNzUgOSA2Ljc1IDl6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
slovenian 斯洛文尼亚语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNSAxN2g2MnYxM0g1eiIvPjxwYXRoIGZpbGw9IiMxZTUwYTAiIGQ9Ik01IDMwaDYydjEySDV6Ii8+PHBhdGggZmlsbD0iIzFlNTBhMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yMi41ODMgMjJ2OWMwIDYuNzUtNi43NSA5LTYuNzUgOXMtNi43NS0yLjI1LTYuNzUtOXYtOXM2Ljg5Ni0zLjQwNiAxMy41IDB6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0xMS45NjMgMzMuMzUybDcuOTc1LjMzOUE2LjgxNiA2LjgxNiAwIDAgMSAxNiAzOGMtMyAxLTQuMDM3LTQuNjQ5LTQuMDM3LTQuNjQ5Ii8+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0xNC41IDMzLjVsMS0yIDIuMjY1IDIuNTg0TDE0LjUgMzMuNSIvPjxjaXJjbGUgY3g9IjEzIiBjeT0iMjQiIHI9IjEiIGZpbGw9IiNmY2VhMmIiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMjEgMzVsLTEtMy0yIDMtMi01LTIgNS0yLTMtMSAzczQgOSAxMCAweiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMjYiIHI9IjEiIGZpbGw9IiNmY2VhMmIiLz48Y2lyY2xlIGN4PSIxOSIgY3k9IjI0IiByPSIxIiBmaWxsPSIjZmNlYTJiIi8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDIyZjI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0yMi41ODMgMjJ2OWMwIDYuNzUtNi43NSA5LTYuNzUgOXMtNi43NS0yLjI1LTYuNzUtOXYtOXM2Ljg5Ni0zLjQwNiAxMy41IDB6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
spanish 西班牙语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2YxYjMxYyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZDIyZjI3IiBkPSJNMjMgMzN2N2EyLjAwNiAyLjAwNiAwIDAgMS0yIDJoLTRhMi4wMDYgMi4wMDYgMCAwIDEtMi0ydi03TTUgMTdoNjJ2OUg1ek01IDQ2aDYydjlINXoiLz48cGF0aCBmaWxsPSIjZjFiMzFjIiBkPSJNMTkgMzNoNHY0aC00eiIvPjxjaXJjbGUgY3g9IjE5IiBjeT0iMzciIHI9IjEuNSIgZmlsbD0iIzZhNDYyZiIvPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZhNDYyZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0yNyAzM3Y5TTExIDMzdjlNMTUgMzBhOC41NjggOC41NjggMCAwIDEgNC0xTTIzIDMwYTguNTY4IDguNTY4IDAgMCAwLTQtMU0xNSAzM2g4TTIzIDMzdjdhMi4wMDYgMi4wMDYgMCAwIDEtMiAyaC00YTIuMDA2IDIuMDA2IDAgMCAxLTItMnYtN00xMCA0MmgyTTI2IDQyaDIiLz48L2c+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
swedish 瑞典语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzFlNTBhMCIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZmNlYTJiIiBzdHJva2U9IiNmY2VhMmIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNjcgMzNIMzBWMTdoLTZ2MTZINXY2aDE5djE2aDZWMzloMzd2LTZ6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
tagalog 他加禄语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==
thai 泰语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjMWU1MGEwIiBkPSJNNSAzMGg2MnYxMkg1eiIvPjxwYXRoIGZpbGw9IiNkMjJmMjciIGQ9Ik01IDUwaDYydjVINXpNNSAxN2g2MnY1SDV6Ii8+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48L2c+PC9zdmc+
turkish 土耳其语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZmZmIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTQwLjY0IDMzLjA1bDMuMDUyIDQuMDE5LTQuOTM0LTEuNTMyIDQuOTMyLTEuNTQxLTMuMDQ2IDQuMDI1LS4wMDQtNC45NzJNMzEuMjkgNDQuNjRhOC42NDMgOC42NDMgMCAxIDEgMy45NTgtMTYuMzQgMTEgMTEgMCAxIDAgMCAxNS4zOCA4LjcxNSA4LjcxNSAwIDAgMS0zLjk1OC45NXoiLz48Zz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvZz48L3N2Zz4=
ukrainian 乌克兰语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzYxYjJlNCIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZmNlYTJiIiBkPSJNNSAzNmg2MnYxOUg1eiIvPjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik01IDE3aDYydjM4SDV6Ii8+PC9nPjwvc3ZnPg==
vietnamese 越南语 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSIjZjFiMzFjIiBzdHJva2U9IiNmMWIzMWMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTI4Ljg5IDQ3bDcuMzAzLTIyIDYuMjk1IDIxLjY2M0wyNSAzMy42MWwyMi0uNTQzTDI4Ljg5IDQ3eiIvPjxnPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik01IDE3aDYydjM4SDV6Ii8+PC9nPjwvc3ZnPg==
speechless 无言 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzYiIGN5PSIzNS44IiByPSIyMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkNFQTJCIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMS44Ii8+PHBhdGggZmlsbD0iI0ZDRUEyQiIgZD0iTTQ2LjggNTYuM2MxMS4zLTYgMTUuNy0yMC4yIDkuNy0zMS41cy0yMC0xNS41LTMxLjMtOS41LTE1LjUgMjAtOS41IDMxLjNjMi4zIDQuMiA1LjggNy43IDEwLjEgOS44IDAgMS42LjcgMy4yIDEuOCA0LjQgMS40IDEuNiA4LjUgMy4zIDEyLjItLjIgMS4xLTEgNy4zLTQuMiA3LTQuM3oiLz48Zz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNTEuNSA1Mi44YzkuNC04LjYgMTAuMS0yMy4xIDEuNS0zMi41cy0yMy4xLTEwLjEtMzIuNS0xLjVTMTAuNCA0MS45IDE5IDUxLjNjLjkuOSAxLjggMS44IDIuOCAyLjYiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMjEuNCAyMy42Yy43LTEuNCAxLjktMi40IDMuMy0yLjkgMS4zLS43IDIuOS0uOCA0LjMtLjRNNTAuNyAyMy42Yy0xLjUtMi43LTQuNi00LTcuNi0zLjNNMzQgNDEuNWMtMS40LS4yLTIuOC0uNy00LTEuNU00Mi4xIDQwYy0xLjMuNy0yLjcgMS4yLTQuMiAxLjVNMzcuOCAzOC42YzAtMS0uOS0xLjktMS45LTEuOXMtMS45LjktMS45IDEuOU0zNCA0Ny40di04LjhNMzcuOCAzOC42djguOSIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0zNy4yIDQ3LjRjMS43IDAgMyAxLjMgMyAzdjEuOGg0LjFjMS4zLS4xIDIuNS43IDIuOCAycy0uMyAyLjYtMS40IDMuMmMtLjUuMy0xLjEuNi0xLjYuOS0yIDEuMS00LjEgMi4yLTYuMiAzLjMtMS45IDEtNCAxLjQtNi4xIDEtMy42LS42LTYtNC01LjQtNy43LjItMS41LjUtMyAxLTQuNC42LTEuOCAyLjMtMy4xIDQuMi0zLjFoNS42eiIvPjxwYXRoIGQ9Ik0zMCAyNy44YzAgMS43LTEuMyAzLTMgM3MtMy0xLjMtMy0zIDEuMy0zIDMtM2MxLjYgMCAzIDEuMyAzIDIuOXYuMU00OCAyNy44YzAgMS43LTEuMyAzLTMgM3MtMy0xLjMtMy0zIDEuMy0zIDMtM2MxLjYgMCAzIDEuMyAzIDIuOXYuMSIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTM2LjIgNTEuOGMtMS4zIDAtMiAuNy0yLjUgMS41LS42LjkgMCAyLjIgMSAyLjJIMzljLjcgMCAxLjItLjYgMS4yLTEuNFY1Mi4yIi8+PC9nPjwvc3ZnPg==
text_cleaned 文字清除 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik01OS4wMzUgNjBoLTQ2LjA3YS45NjguOTY4IDAgMCAxLS45NjUtLjk2NXYtNDYuMDdhLjk2OC45NjggMCAwIDEgLjk2NS0uOTY1aDQ2LjA3YS45NjguOTY4IDAgMCAxIC45NjUuOTY1djQ2LjA3YS45NjguOTY4IDAgMCAxLS45NjUuOTY1eiIvPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTMyLjA3IDQyLjU3OGE1LjMxNCA1LjMxNCAwIDAgMS0zLjUzOCAxLjM0MyA1LjMzNCA1LjMzNCAwIDAgMS01LjMzNC01LjMzNHYtNC4yNjhhNS4zMzQgNS4zMzQgMCAwIDEgNS4zMzQtNS4zMzQgNS4zMTMgNS4zMTMgMCAwIDEgMy41MzggMS4zNDNNNDIuNDAxIDI5LjA0OXYxNC45MzZoNi40MDEiLz48L2c+PHBhdGggZmlsbD0iI2QyMmYyNyIgZD0iTTU5LjAzNSA2MC40NTNoLTQ2LjA3YS45NjguOTY4IDAgMCAxLS45NjUtLjk2NXYtNDYuMDdhLjk2OC45NjggMCAwIDEgLjk2NS0uOTY1aDQ2LjA3YS45NjguOTY4IDAgMCAxIC45NjUuOTY1djQ2LjA3YS45NjguOTY4IDAgMCAxLS45NjUuOTY1eiIvPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJNNTkuMDM1IDYwaC00Ni4wN2EuOTY4Ljk2OCAwIDAgMS0uOTY1LS45NjV2LTQ2LjA3YS45NjguOTY4IDAgMCAxIC45NjUtLjk2NWg0Ni4wN2EuOTY4Ljk2OCAwIDAgMSAuOTY1Ljk2NXY0Ni4wN2EuOTY4Ljk2OCAwIDAgMS0uOTY1Ljk2NXoiLz48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0zMi4wNyA0Mi41NzhhNS4zMTQgNS4zMTQgMCAwIDEtMy41MzggMS4zNDMgNS4zMzQgNS4zMzQgMCAwIDEtNS4zMzQtNS4zMzR2LTQuMjY4YTUuMzM0IDUuMzM0IDAgMCAxIDUuMzM0LTUuMzM0IDUuMzEzIDUuMzEzIDAgMCAxIDMuNTM4IDEuMzQzTTQyLjQwMSAyOS4wNDl2MTQuOTM2aDYuNDAxIi8+PC9nPjwvc3ZnPg==
rewrite 重写 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTE2LjQwNSAxMS4zNzhINTUuOTd2NDkuMDY2SDE2LjQwNXoiLz48cGF0aCBmaWxsPSIjZjRhYTQxIiBkPSJNMzkuOTMxIDQwLjIyMmwxMS4yOTQtMTEuMjk0IDcuMzc2IDcuMzc2LTExLjE5OCAxMS4xOTgiLz48cGF0aCBmaWxsPSIjYTU3OTM5IiBkPSJNMzcuOTQxIDQ2LjgxOWwxLjk2MS01LjY0OSA2LjQ1NCA2LjQ1NC01LjY0OCAxLjk2Ii8+PHBhdGggZmlsbD0iI0VBNUE0NyIgZD0iTTU0LjYwOSAyNS4wNTJsMy45NzgtMy45NzkgNy44NTkgNy44NTktMy45NDUgMy45NDUiLz48cGF0aCBmaWxsPSIjZDBjZmNlIiBkPSJNNTAuNDk0IDI5LjY2bDQuNjA4LTQuNjA4IDcuMzc1IDcuMzc1LTQuNTY4IDQuNTY5Ii8+PGc+PHBhdGggZD0iTTM4LjA3IDQ3LjE5MWwyLjM4NiAyLjM4Ni0zLjQ2NCAxLjI4eiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTIyLjMyMiAxOS44NzVoMjdNMjIuMzIyIDI3Ljg3NWgyNS42TTIyLjMyMiAzNS44NzVoMTcuMTA5TTIyLjMyMiA0My44NzVoMTIuMjA2TTIyLjMyMiA1MS44NzVoMTAuMTQ2Ii8+PHBhdGggZD0iTTM4LjA3IDQ3LjE5MWwyLjM4NiAyLjM4Ni0zLjQ2NCAxLjI4eiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTQwLjY5MiA0OS41OTFsNS42NjQtMS45NjcgMTUuNTktMTUuNTktNi40NTQtNi40NTQtMTUuNTkgMTUuNTktMS45NzQgNS42NzF6TTU4LjA4NiAyMi45ODZsMS41NTUtMS41NTUgNi40NTQgNi40NTQtMS42MzIgMS42MzJNNDAuMjc5IDQwLjc5M2w2LjQ1NCA2LjQ1NCIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTM3LjkzMiA0Ni44MjhsLTEuMzgzIDQuMTQ5IDQuMTU5LTEuMzkyTTUxLjMwMiAzMC4xNTdsNi4yMDIgNi4yMDIiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIuMDIxIiBkPSJNNTUuMzIyIDQ0LjIyOHYxNS42NDdoLTM5di00OGgzOXY4LjQ1NiIvPjwvZz48L3N2Zz4=
unknown 未知 data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUgMTdoNjJ2MzhINXoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNSAxN2g2MnYzOEg1eiIvPjwvc3ZnPg==`.trim().split('\n').map(v => {
    const [value, name, icon] = v.split(' ');
    return {value: value.replace('_', ' '), name, icon};
});

async function getDataList(name) {
    let searchUrl = `${window.location.origin}/?f_search=${encodeURIComponent(`"${name}"`)}`;
    const response = await fetch(searchUrl);
    const html = await response.text();
    const safeHtml = html.replace(/^.*<body>(.*)<\/body>.*$/igms,"$1").replace(/<script.*?>(.*?)<\/script>/igms, '');
    const dom = document.createElement('div')
    dom.innerHTML = safeHtml;
    const list = [...dom.querySelectorAll('.itg>tbody>tr,.gl1t')];
    let dataList = list.map(e => {
        if(e.querySelector('.glname') == null) return null;
        const pagesElement = e.querySelector('div.gl3e div:nth-child(5), div.gl5t > div:nth-child(2) > div:nth-child(2)');
        const linkElement = e.querySelector('.gl1e a,.glname a,.gl2e a,.gl1t>a');
        const torrentElement = e.querySelector('.gldown a');
        const titleElement = e.querySelector('.glink');
        return {
            distance: minDistance(cleanBookName(titleElement.textContent), name),
            href: linkElement.href,
            title: titleElement.textContent,
            pages: pagesElement ? pagesElement.textContent : null,
            torrentHref: torrentElement ? torrentElement.href : null,
            tags: [...e.querySelectorAll('.gt')].map(e2 => e2.title)
        }
    }).filter(v => v);
    return dataList;
}


function cleanBookName(name) {
    name = name.replace(/\[.*?\]/gi, '');
    name = name.replace(/\(.*?\)/gi, '');
    name = name.replace(/\sCh\.[0-9-]+/gi, '');
    name = name.replace(/\s第[0-9-]+話/gi, '');
    name = name.replace(/\s第[0-9-]+话/gi, '');
    name = name.trim();
    return name;
}

function minDistance(s1, s2) {
    const len1 = s1.length
    const len2 = s2.length
    let matrix = []
    for (let i = 0; i <= len1; i++) {
        matrix[i] = new Array()
        for (let j = 0; j <= len2; j++) {
            if (i == 0) {
                matrix[i][j] = j
            } else if (j == 0) {
                matrix[i][j] = i
            } else {
                let cost = 0
                if (s1[i - 1] != s2[j - 1]) {
                    cost = 1
                }
                const temp = matrix[i - 1][j - 1] + cost

                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, temp)
            }
        }
    }
    return matrix[len1][len2]
}


document.addEventListener('DOMContentLoaded',async function(){
    
    GM_addStyle(`
    .tj-box {
        text-align: left;
        font-size: 12px;
        font-weight: 400;
        position: absolute;
        top: -1px;
        right: -1px;
        z-index: 99999999;
        background: inherit;
        border: inherit;
        padding: 0 8px;
    }
    .tj-box .tj-lang-icon{
        background: inherit;
        display: inline-block;
        border: inherit;
        border-width: 0;
    }
    .tj-box .tj-lang-icon>a>img {
        width: 24px;
    }
    .tj-box .tj-lang-icon ul {
        display: none;
        white-space: nowrap;
        background: inherit;
        margin: 0;
        padding: 8px;
        border: inherit;
        border-width: 1px;
        position: absolute;
        top: 24px;
        right: -1px;
        list-style: none;
    }
    .tj-box .tj-lang-icon:hover ul {
        display: block;
    }
    .tj-box .tj-lang-icon ul li {
        padding: 2px 0;
    }
    .tj-box a {
        text-decoration: none;
    }
    .tj-box ul a.title::before {
        content: "●";
        color: #1a9317;
        padding-right: 4px;
    }
    .tj-box ul a.title:visited::before {
        color: #aaa;
    }
    `);

    
    const title1 = document.querySelector("#gn").textContent;
    const title2 = document.querySelector("#gj").textContent;
    const cleanTitle1 = cleanBookName(title1);
    const cleanTitle2 = cleanBookName(title2);
    console.log("搜索相似:", cleanTitle1, '&', cleanTitle2);
    const dataList = [];
    const urlSet = new Set([window.location.origin + window.location.pathname]);
    if(cleanTitle1) {
        (await getDataList(cleanTitle1)).forEach(v => {
            if(!urlSet.has(v.href)) {
                dataList.push(v);
                urlSet.add(v.href);
            }
        });
    }
    if(cleanTitle2) {
        (await getDataList(cleanTitle2)).forEach(v => {
            if(!urlSet.has(v.href)) {
                dataList.push(v);
                urlSet.add(v.href);
            }
        });
    }

    dataList.sort((a,b) => a.distance - b.distance);

    dataList.forEach(v => {
        for(let lang of languages) {
            if(v.tags.length && v.tags.includes(`language:${lang.value}`)) {
                v.language = lang;
                break;
            }
        }
        if(v.language) return;

        // 两个循环是因为优先判断tag
        for(let lang of languages) {
            if(v.title.toLowerCase().includes(lang.value)) {
                v.language = lang;
                break;
            }
        }
        if(v.language) return;

        // 没有找到语言的 并且没翻译的默认为日语
        if(v.tags.length && !v.tags.includes(`language:translated`)) {
            v.language = languages.find(v => v.value == 'japanese');
        } else {
            v.language = languages.find(v => v.value == 'unknown');
        }
    });

    const languageGroupMap = {};
    const languageGroup = [];
    dataList.forEach(v => {
        if(!languageGroupMap[v.language.value]) {
            languageGroupMap[v.language.value] = {language: v.language, list: []};
            languageGroup.push(languageGroupMap[v.language.value]);
        }
        languageGroupMap[v.language.value].list.push(v);
    });

    languageGroup.sort((a,b) => {
        let pa = languagePriority.indexOf(a.language.value);
        let pb = languagePriority.indexOf(b.language.value);
        if(pa == -1) pa = 999;
        if(pb == -1) pb = 999;
        return pa - pb;
    });

    const box = document.createElement('div');
    box.className = `tj-box`;
    document.querySelector(".gm").appendChild(box);

    if(languageGroup.length) {
        box.innerHTML = languageGroup.map(group => `
        <div class="tj-lang-icon">
            <a href="${group.list[0].href}" title="${group.language.name}"><img src="${group.language.icon}"></a>
            <ul>
                ${group.list.map(item => `
                <li>
                    <a href="${item.href}" class="title" target="_blank">${item.title}</a>
                    <span>${item.pages}</span> ${item.torrentHref ? `<a href="${item.torrentHref}" width=15 onclick="return popUp('${item.torrentHref}', 610, 590)" target="_blank"><img src="https://exhentai.org/img/t.png" alt="T" title="Show torrents"></a>` : ''}
                </li>
                `).join('')}
            </ul>
        </div>
        `).join('');
    }else {
        box.innerHTML = "未找到";
    }
    console.log("dataList", dataList, languageGroup);
});
