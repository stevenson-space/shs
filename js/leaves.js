var speed=40; // lower number for faster
var leaves=5; // number of leaves falling at a time
var untidy=4; // how often do you want the leaves tidied up (high number is less often)

/****************************\
*Falling Autumn Leaves Effect*
*  (c)2013 mf2fm web-design  *
*  http://www.mf2fm.com/rv   *
* DO NOT EDIT BELOW THIS BOX *
\****************************/

var boddie;
var dx=new Array();
var xp=new Array();
var yp=new Array();
var am=new Array();
var dy=new Array();
var le=new Array();
var swide=480;
var shigh=320;
var sleft=0;
var starty=0;
var offset=0;
var tidying=0;
var deeex=0;
var has_focus=true;
var ie_version=(navigator.appVersion.indexOf("MSIE")!=-1)?parseFloat(navigator.appVersion.split("MSIE")[1]):false;
var plow=document.createElement("img");
plow.src='data:image/png;base64,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'+
'SuQmCC';
var leafy=new Array();
var leaf_image=new Array();
leaf_image[0]='data:image/png;base64,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'+
'AAAABJRU5ErkJggg==';
leaf_image[1]='data:image/png;base64,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';
leaf_image[2]='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAADAFBMVE'+
'XP3IapxXCVuC50nCp1pVeouD90pkKCo1d7mFt7dk9KahirxXjQ2Y/s8Yd2o0N+l0DQ2WyHn13+/M'+
'1yjyxchDOIrlNvjj+buG+EsFSXqmvf7LfK4G7k7oHx+IX2+o7//4KVwWhtn0GNrnKjyoF/n1C7yo'+
'zC04GXt3aTr2xojz+auWy3zY2muHSYwnWasmqPpG2Ipk2TtFlrjTnCz3bY6H+Do02Ho1Ou1IWAo1'+
'LN1bLO43HN32/X6XrW5H3Z6njR4nuvxHmYsG7k7aLR45yhrn/a7JfN3Je+zJa+0H4AAAAABQOLyi'+
'1ypESemi9vkiVPdgBkgThepCBst1R4l0AVTAAZKgsvRg94tDJcgyE3bAJXqiRHiS10tE1KnjBUpR'+
'FitT4vjgJtoB+JtUFCnCdosFIwgQSvyWp6p0g6XhNYrARyvjpepRs7eQ9KogVltUVEkyNEeBFvqD'+
'RAbAUyYQt4wEo/bRU8hgJcox9nth1DggFksS8/lg5wvkuBw2JLhwhXpzVnoiYzhA56pDuHtWRjnR'+
'RaoA9EiRdQqgs9dBRbnyRInxRXqB1kuhVttDBLkQZtukNTmCRFhQtVjDVpq0JZnj1bmCYpdAE7cw'+
'JNmxdjlyVrlzA5dwlijC1SmARgrTRgtSBUsBRMixRorjZpvD5NnCFarRtVkxVVni9AdAZRlyJEgB'+
'JQkCtroENfoDlUgx0oZQBWkCZgjhxPiwRJlhVdsQ5FdBFUohdPmyVTkg9dpydZqxVTph1dkxRVix'+
'k9kAU+hRRSmSxgrRdjrR9qsz1NqRVfthJjsig/fRxJeiRjsDp8uFlerCxOoBhRoR5jqkJXmyBQkx'+
'xMlCFMfg1YlDFOgxVcriVFkwpdqR9MkwxNkhdWmylWoSNGhRBMjA9YqwxipypRmhM7ewBeqDNMgh'+
'tHmg1LjyQ7hQtXhxRcmBtFiwhRniBUnhlgni9FiB5JfBZDfglSjh9WlhxOnxFSoSlAfhFLhg5PhS'+
'VBihBHkhFMjhxOmRtMiBxTlSlHlhtgqTtIjhhIkUTwAAAASnRSTlNzvWvD4Fj9/t7W9NDm6MTy/r'+
'CB/tfvRkLW+17eypNdifvczLc3QZBxXPmwbp6chZRnvY1SVbHQipoKcZx9t42oGysbJVBFEDQDAA'+
'ym4CEAAAdgSURBVHja5dd3VFvXGQDwnjQ5bdM2qbNn4yzvHRsDNsZgG3itOzK84j2DbbzZYPbee2'+
'/M3ggQS0whQEyBBBqAttDee1bGSUxToydO+K/3j3fu+d49v/Pefffd+32/Adao/f9Cx/64RpDj8c'+
'NrA335g+XaQBvHYWsDfZ6SvXtNoE+T+OlOawEFyGuzLdYAcqrSUnmPjvx6yF4xzVO5//Droc/Tqo'+
'SqBMYuMOXo5j+Yhjbreuon8MIsk4M2vZWTSd5gGkrqwcsJZT3XV36kY+vqmVkPSPtMv9rWQDpdHs'+
'nVahtefP/wpsuNZOaDoFNBIHP0GaOiqioBr9UKT//vTat1WQ3S+cXOAO6DTLDJfrlb2zMtZOPr5W'+
'kfLH+QdwBgp0XtYuciGgaDNWSGWIJByfe0KdNU+qSwvnvPsvC04WiORqhJZcI6YbXC0s4skM9/pA'+
'ZaVlaTYlCpVKmanOfx3dfDNBXcem1q53wnDF3a2XgUBPrsKn26LKU6VTk5qal8Dm3/DqdGEYjy+s'+
'zLc3z+fGurHGxBbp/uqefqqzWlRmhKYPdTuNnFIBRN4FOZwokpt6lSmNc2UOg8Bc8tGk/CTYoq+e'+
'Vf/hj9dx1fxWFW0NkilaZ5SraITgfAoP1X84qGx1OSCkXCufvNXzwLbvjOxaDCTUBRnAR5RGKjjH'+
'rmPXDonl4/XHwxia+SCQR1js+C0mxZhmESBVWrh9CJrHn01L+sQKEPevT9xbeKU/iyRNncmY1LMY'+
's06fwYRM0m6HhSFlYmmxLsNOPv9/Ufjr/lnUT1k/Hv85cWkqOLrNAAHeWUYAalCtZc4lwlNccOHD'+
'o+Ml5c3H/WJVEmqKxb+jbyQJUaBeXQJbwIhsowXyitvP/wVXDoNX/9xbu+3Oap+cTF9B3GwLuBPN'+
'ykpAwHPT/IUOgUhZXo++UPHcCh/Vf1+vH44ocsLGuubisAOMjD2GyUxF93b6gbojPg5gWC8rp3AX'+
'DI4ZoRSr7rLIhjLX21oUCUji0py+Od1VZUsCdEOEF5+k6zttr3xvV5wxdry+OMT7QRqL5UgdI9gU'+
'ruyaEdBI8EFIrHT98DmAXt979bNDwcke7nh03btDENj38igY6dH8R/jxlp01bRNXPN5m7+3PHhfr'+
'2bwA/b6vV6iEFCYEt0T87S8xEjI5Qarla1CJiCrJyWHbTs4eI8Ktk9rpXFFLExxLYK+BA9H4Npo9'+
'TU9Bgdk9CfkMHBwcePb3naf4NGyUOoyOTGuFKP25joMYncTR41hkAM6yn66Uywc+1GMPJccnUZ18'+
'K4Zk+NFHkPppPdG0P7+jBt7aShIYw6Y6QouZ/SE+QIBh1BBiPHaygJIiX6t6di+79XlJO9ckNnZ0'+
'uI6sEw+Gh0b178OJ67w4yTdj3yMXKzBBoJwbF6b92KrCz3aswtxcT0Rg8NFYRjSxBFvtce2Jl1ZC'+
'ORj137q6hSJSkkNq8v1I2cmxvZNwAfonZ0cFpv9xVd22Lm2e/4GOnr6kpBQ5Sdt4lE8SNyY0ifp2'+
'7QUEBa6C1pI2VsNTuJ2HvuG1fXuxRNc2Ejs0/0yD23d6CAN5rfEr5woYXN3bSabOTxN/H9/Yhoqp'+
'Q0W3/G/WaTaDBqYKC9vWS0JXN1ac163/j4fmJvLySiMOxR3AJpkCO+2dQ04Nn+O2B10OH1yHP+E1'+
'+3qJrRzifDwyLgTU0LTTED+SWbdzmsOtHadiXAI1QcdeKEi3PMwIWmgZiBGM/8jK7CTy3tVp2MOr'+
'z0Wojz307CF26GLzR5erbnI0YhyjF9cvLr25xWXdR8cvqE2wx25s5N8cLCbIeY1BI9S0mYYZZmOa'+
'0O+vMnTs4npQaFoqur6w4tSkzLUHM4kbc9PHANb9otg8Ad4HC+4k5BwahOqZhj+NB8aEpxSxuH83'+
'UADBtkPvTRMeNf7OnDWmhvhxeU6HRSfnYEwwfOIXFm+yaYrVfMhWyOPb3+PVyW29TbVxAN74B3Mx'+
'hSqaZbzWYTZpkwVpB50IElB9hHIynuhPZGEzrGRiG0cBptUsqja3vaIpkivzfNgOwP2f+Yt1+60D'+
'3zdEsijGVEKWlisXh0DGpML1VMpoj8LSi098BPvXVdYiWDFhcQ66OGRCmV4o72FslIbGwevep0rZ'+
'C8HwSytvm5a8kSk6TYmbeA7akzXTqIOuPCLKbNOxZBJHIb/tkgszIJ2Wx43t9xHatkKGamlmpT5S'+
'WIerQN4e1NjCQSCZf/kQprMAHZ2+5dXgEoDDRc94zXUvr6hcUE6omOIKFQuibe3nLU6Urh1M4VoY'+
'MH/qu4fkXBU2B5CsZTaMnatXvL2/ssdzzbB77K6bRfAbK1+cW5gg4zzFMNmndWmIbdji+E/nroq1'+
'+GmgNxrRpDrdNqCj+Hj2xfUEzxwwqnDVnAKqCPjYv5BW1fGq+m+/dg0PK3sl6hLsmmVtc6mgtZH7'+
'RdcZyc/u37gHnQx4cOmphMi8EbVuZARz60sTY5bs/79gA4dOig7V6QevwNBwAMsv7wgPGdQJpxZY'+
'FBf7mxNAi0gUPA2rT/AKZl/rtuiW+IAAAAAElFTkSuQmCC';
leaf_image[3]='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAADAFBMVE'+
'X25ZLg2O/jxJHl3NXvuGz78Vvt12zu5mPv5I/YtV/KqlnUx6Lr0nX33Knnx0jr3STpx0Ht0GTht0'+
'/99Ifp0Gv3493135vq1qDs3Dv14Mv301jwyzjv2bT34MLp2Zj16Wf66nnw31/653337//t3s/26L'+
'/bpmj76WzduXDw1Fnqy2bx1X757PH55Jr103f36rr652r666z58q/y40/ktif65pT77L3dw5zu11'+
'Dz5d/t2jTivYzksnD76qv66bTy4Ij66qb54JDnwSLmvIj55J3467zx16T66Yfx66Hs3dHdrXz445'+
'vyzo/05LD45Z346p/x5nrauXfky3v02Jrsy1vjunj35+Hx2rn756r36ML058zkvIj14r/346705L'+
'bw2acAAADbqxHlupblrhP00aHy4tXy22zYow29ihzfqRj97k7+9jaXeEW1kjF5XhnBsYHpzmn0zA'+
'n564r52l7z0S3+9Dr80jv83Bj91jW6lFMhDgD30CH97SvtuBnz30D57VT+9y7++Bv70UT8yiP3wB'+
'L81xb5ySD96QX+5wT44nv1vQn60D3+1gj94RX+4hv81Db+0TL96R7+6z/5xwX8ySrxtgX8zgT02p'+
'P8zhH98Br92UL6yRb811L852v96iX65F/86jT93yT+9yP+8SH+8An9yQzytwD5xAz90wP98xP+3Q'+
'X7xhL90Cj+7RP+8gz+8gT3wQD91Sv90R395DP92w/3vgX7zAP6xAX1vAL80gH9zxf+5Az9zwn9zg'+
'390Ab7ygL9ygX80AL91gT96gD+0AT90gr+4QL+7wT9zQb+0hD5xAD+8gD/7QH9yAP8xgD94gL+7A'+
'H92AL/5gH9zAH+0QL+1QL92wL8xgP8zgH6wgP+7QP+4AH+4wD9ygL96AH+6wL+1wD+5AL+1AL/6g'+
'D+3wH+5QD90wH+8AD+2gD+zQP+7gD+4gD/4QD+2QH/6gD+0QH/7QD+5AD+1gD+3QD+0wH/7AD+5Q'+
'H+zwH+zQH/6wD+6gD/6QD/6AH+6QD+5gD/5wCaoVpLAAAAYXRSTlO89PTvb13u5ty8/X3rafL789'+
'TxVf5Edcvvloy9tX3ptZDSeFVmfixy38XlwRZzpIuceZ3L5I12iP6n5EyDX2/KhYT3lX5FYV0SBo'+
'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';

function addLoadEvent(funky) {
  var oldonload=window.onload;
  if (typeof(oldonload)!='function') window.onload=funky;
  else window.onload=function() {
    if (oldonload) oldonload();
    funky();
  }
}

addLoadEvent(september_21);

function september_21() { if (document.getElementById) {
  var i;
  if (ie_version) {
    document.onfocusin=function(){has_focus=true;};
    document.onfocusout=function(){has_focus=false;};
  } 
  else {
    window.onfocus=function(){has_focus=true;};
    window.onblur=function(){has_focus=false;};
  }
  window.onscroll=set_scroll;
  window.onresize=set_width;
  document.onmousemove=mouse;
  boddie=document.createElement("div");
  boddie.style.position="fixed";
  boddie.style.bottom="0px";
  boddie.style.left="0px";
  boddie.style.width="100%";
  boddie.style.overflow="visible";
  boddie.style.backgroundColor="transparent";
  boddie.style.pointerEvents="none";
  boddie.style.zIndex="0";
  document.body.insertBefore(boddie, document.body.firstChild); 
  set_width();
  plow.style.position="absolute";
  plow.style.overflow="hidden";
  plow.style.zIndex=9999;
  plow.style.bottom="0px";
  plow.style.left="-144px";
  boddie.appendChild(plow);
  for (i=0; i<leaves; i++) start_leaf(Math.random()*shigh*3/4);
  offset=0;
  setInterval("autumn_leaves()", speed);
}}

function start_leaf(whyp) {
  starty++;
  offset++;
  var f, size;
  size=start_fall(starty, whyp);
  f=document.createElement("img");
  f.src=leaf_image[starty%leaf_image.length];
  f.width=size;
  f.style.height="auto";
  f.style.position="absolute";
  f.style.zIndex=1000+starty;
  f.style.top=yp[starty]+"px";
  f.style.left=xp[starty]+"px";
  leafy[starty]=f;
  boddie.appendChild(f);
}
  
function start_fall(i, whyp) {
  var size=72-Math.floor(36*Math.random());
  dx[i]=Math.random();
  am[i]=8+Math.random()*24;
  dy[i]=1+Math.random()*2;
  xp[i]=Math.random()*(swide-size);
  yp[i]=whyp-size;
  le[i]='falling';
  return size;
}

function set_width() {
  var sw, sh;
  if (typeof(window.innerWidth)=='number' && window.innerWidth) {
    sw=window.innerWidth;
    sh=window.innerHeight;
  }
  else if (document.compatMode=="CSS1Compat" && document.documentElement && document.documentElement.clientWidth) {
    sw=document.documentElement.clientWidth;
    sh=document.documentElement.clientHeight; 
  }
  else {
    sw=document.body.clientWidth;
	sh=document.body.clientHeight;
  }
  if (sw && sh && has_focus) {
    swide=sw;
    shigh=sh;
  }
  boddie.style.height=shigh+"px";
}

function autumn_leaves() {
  var i;
  var c=0;
  for (i=0; i<starty; i++) {
    if (leafy[i] && le[i]!='tidying') {
		if (yp[i]>shigh || xp[i]>swide || xp[i]<-leafy[i].width) {
		  if (offset>0) offset--;
		  boddie.removeChild(leafy[i]);
		  leafy[i]=false;
		}
		else if (yp[i]+untidy*offset/leaves<shigh-leafy[i].height/2) {
		  yp[i]+=dy[i];
		  dx[i]+=0.025+Math.random()/10;
		  xp[i]+=deeex;
		  leafy[i].style.top=(yp[i]-am[i]/2*Math.abs(Math.sin(dx[i])))+"px";
		  leafy[i].style.left=(xp[i]+am[i]*Math.sin(dx[i]))+"px";
		}
		else if (le[i]=='falling') le[i]='landed';
	}
	if (leafy[i] && le[i]=='falling') c++;
  }
  if (c<leaves) start_leaf(0);
  if (offset>untidy*leaves && !tidying && Math.random()<.05) tidy_leaves();
}

function tidy_leaves() {
  var i;
  tidying=true;
  for (i=swide; i>=-146; i-=2) setTimeout('plough('+i+')', speed*(swide-i));
  setTimeout('tidying=false; offset=0;', speed*(swide-i));
}

function plough(x) {
  var i, p;
  plow.style.left=x+"px";
  for (i=0; i<starty; i++) {
    if (leafy[i] && le[i]!='falling') {
	  p=xp[i]+leafy[i].width+am[i]*Math.sin(dx[i])-dy[i];
	  if (p<0) {
	    boddie.removeChild(leafy[i]);
		leafy[i]=false;
	  }
	  else if (p>x && p<x+3) {
	    le[i]='tidying';
	    xp[i]-=2;
	    leafy[i].style.left=(xp[i]+am[i]*Math.sin(dx[i]))+"px";
	    if (Math.random()<.1) {
		  yp[i]-=1;
		  leafy[i].style.top=(yp[i]-am[i]/2*Math.abs(Math.sin(dx[i])))+"px";
	    }
	  }
	  else if (p>x+144 && yp[i]<shigh-leafy[i].height/2) {
  	    yp[i]+=dy[i];
		dx[i]+=0.02+Math.random()/10;
		leafy[i].style.top=(yp[i]-am[i]/2*Math.abs(Math.sin(dx[i])))+"px";
		leafy[i].style.left=(xp[i]+am[i]*Math.sin(dx[i]))+"px";
	  }
	}
  }
}

function set_scroll() {
  if (typeof(self.pageXOffset)=='number' && self.pageXoffset) sleft=self.pageXOffset;
  else if (document.body && document.body.scrollLeft) sleft=document.body.scrollLeft;
  else if (document.documentElement && document.documentElement.scrollLeft) sleft=document.documentElement.scrollLeft;
  else sleft=0;
}

function mouse(e) {
  var x;
  if (e) x=e.pageX;
  else {
	x=event.x;
    set_scroll();
    x+=sleft;
  }
  deeex=has_focus?Math.floor(-1.5+4*(x-sleft)/swide):0;
}