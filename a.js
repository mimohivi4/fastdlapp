var os = function() {
	var ua = navigator.userAgent,
	isWindowsPhone = /(?:Windows Phone)/.test(ua),
	isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone, 
	isAndroid = /(?:Android)/.test(ua), 
	isFireFox = /(?:Firefox)/.test(ua), 
	isChrome = /(?:Chrome|CriOS)/.test(ua),
	isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
	isPhone = /(?:iPhone)/.test(ua) && !isTablet,
	isPc = !isPhone && !isAndroid && !isSymbian && !isTablet;
	return {
		isTablet: isTablet,
		isPhone: isPhone,
		isAndroid : isAndroid,
		isPc : isPc
	};
}();

function bulo(code)
{


if (code=="wechat"){// wechat
document.writeln('<div class="fixBox"><a id="goTop" href="javascript:scroll(0,0)" title="top">top</a></div>');
}
if (code=="picSide"){// picSide
document.writeln('<div class="endCon"><div class="endShare">');
document.writeln('<div class="endBtn clearfix">');
document.writeln('<a id="rePlayBut" href="javascript:;" class="btnReplay fl" onclick="showpic(\'next\', 1);">å†çœ‹ä¸€æ¬¡</a>');
document.writeln('<a id="nextPicsBut" class="btnEnter fr"  href="/photo/">è¿›å…¥å›¾ç‰‡ä¸­å¿ƒ</a></div>');
document.writeln('</div>');
}
if (code=="so"){// baidu so
document.writeln('<div class="fr pt10"><form action="http://so.qibuluo.com/cse/search" method="get" target="_blank" autocomplete="off" id="bdcs-search-form">');
document.writeln('<input type="hidden" name="s" value="12012157383957534870">');
document.writeln('<input type="hidden" name="entry" value="1">');
document.writeln('<input type="text" name="q" class="bdcs-search-form-input" id="bdcs-search-form-input" placeholder="è¿™é‡Œæœç´¢..." >');
document.writeln('<input type="submit" class="bdcs-search-form-submit " id="bdcs-search-form-submit" value="æœç´¢">');
document.writeln('</form></div>');
}

}//bulo(code) end
//goTop JS code
function toTopHide(){
document.documentElement.scrollTop+document.body.scrollTop>400?document.getElementById("goTop").style.display="block":document.getElementById("goTop").style.display="none";
}
window.onscroll=toTopHide
//ä¸»å‡½æ•°
var picShow=function(){
var interv=7000; //åˆ‡æ¢é—´éš”æ—¶é—´
var interv2=10; //åˆ‡æ¢é€Ÿé€Ÿ
var opac1=70; //æ–‡å­—èƒŒæ™¯çš„é€æ˜Žåº¦
var source="fade" //ç„¦ç‚¹è½®æ¢å›¾ç‰‡å®¹å™¨çš„idåç§°
//èŽ·å–å¯¹è±¡
function getTag(tag,obj){if(obj==null){return document.getElementsByTagName(tag)}else{return obj.getElementsByTagName(tag)}}
function getid(id){return document.getElementById(id)};
var opac=0,j=0,t=63,num,scton=0,timer,timer2,timer3;var id=getid(source);id.removeChild(getTag("div",id)[0]);var li=getTag("li",id);var div=document.createElement("div");var title=document.createElement("div");var span=document.createElement("span");var button=document.createElement("div");button.className="button";for(var i=0;i<li.length;i++){var a=document.createElement("a");a.innerHTML=i+1;a.onclick=function(){clearTimeout(timer);clearTimeout(timer2);clearTimeout(timer3);j=parseInt(this.innerHTML)-1;scton=0;t=63;opac=0;fadeon();};a.className="b1";a.onmouseover=function(){this.className="b2"};a.onmouseout=function(){this.className="b1";sc(j)};button.appendChild(a);}
//æŽ§åˆ¶å›¾å±‚é€æ˜Žåº¦
function alpha(obj,n){if(document.all){obj.style.filter="alpha(opacity="+n+")";}else{obj.style.opacity=(n/100);}}
//æŽ§åˆ¶ç„¦ç‚¹æŒ‰é’®
function sc(n){for(var i=0;i<li.length;i++){button.childNodes[i].className="b1"};button.childNodes[n].className="b2";}
title.className="num_list";title.appendChild(span);alpha(title,opac1);id.className="d1";div.className="d2";id.appendChild(div);id.appendChild(title);id.appendChild(button);
//æ¸æ˜¾
var fadeon=function(){opac+=5;div.innerHTML=li[j].innerHTML;span.innerHTML=getTag("img",li[j])[0].alt;alpha(div,opac);if(scton==0){sc(j);num=-2;scrolltxt();scton=1};if(opac<100){timer=setTimeout(fadeon,interv2)}else{timer2=setTimeout(fadeout,interv);};}
//æ¸éš
var fadeout=function(){opac-=5;div.innerHTML=li[j].innerHTML;alpha(div,opac);if(scton==0){num=2;scrolltxt();scton=1};if(opac>0){timer=setTimeout(fadeout,interv2)}else{if(j<li.length-1){j++}else{j=0};fadeon()};}
//æ»šåŠ¨æ–‡å­—
var scrolltxt=function(){t+=num;span.style.marginTop=t+"px";if(num<0&&t>3){timer3=setTimeout(scrolltxt,interv2)}else if(num>0&&t<62){timer3=setTimeout(scrolltxt,interv2)}else{scton=0}};
fadeon();
}
