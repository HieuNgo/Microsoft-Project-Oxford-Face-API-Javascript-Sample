$(function() {
	'use strict';
	var toBinary = function(canvas) {
	    var base64 = canvas.toDataURL('image/png'),
	        bin = atob(base64.replace(/^.*,/, '')),
	        buffer = new Uint8Array(bin.length);
	    for (var i = 0; i < bin.length; i++) {
	        buffer[i] = bin.charCodeAt(i);
	    }
	    return buffer;
	}
	
	,video = document.getElementById('camera')
	,localMediaStream = null
	,hasGetUserMedia = function() {
		return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	}
	,onFail = function(e) {
		console.log(e);
	}
	,canvas = document.getElementById('canvas')
	,ctx = canvas.getContext('2d')
	,img = document.getElementById('img')
	,w = video.offsetWidth
	,h = video.offsetHeight
	,$parsonId
	,updateParsonList = function(){
		$.ajax({
            url: 'https://api.projectoxford.ai/face/v1.0/persongroups/' +  GROUPNAME +'/persons',
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",APIKEY);
            },
            type: "GET",
            dataType:'json'
            
        })
        .done(function(results) {
        	var html = ''
        		,$parsed;      	
        	for (var i = 0; i < results.length; i++) {
				var result = results[i]
				    ,html =  html  + '<option value="' + result.personId + '">' + result.name + '</option>';
				
				
			}
        	$parsed = $.parseHTML(html);
        	
        	getParsonId().empty().append($parsed);
        	
        	
        })
        .fail(function() {
            alert("error");
        });
		
		
	}
	,getParsonId = function(){
		
		if(!$parsonId){
    		$parsonId = $('[name=parsonId]'); 
    	}
		return $parsonId;
	};

	if(!hasGetUserMedia()) {
		alert("this browser can not use webrtc");
	} else {
		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		navigator.getUserMedia({video: true}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			localMediaStream = stream;
		}, onFail);
		updateParsonList();
		
	}
	canvas.setAttribute("width", w);
	canvas.setAttribute("height", h);
	
	$("#create_parson").click(function(){
		$.ajax({
            url: 'https://api.projectoxford.ai/face/v1.0/persongroups/' +  GROUPNAME +"/persons" ,
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",APIKEY);
            },
            type: "POST",
            // Request body
            data: JSON.stringify({'name':$('[name=name]').val()})
        })
        .done(function(data) {
        	updateParsonList();
        })
        .fail(function() {
            alert("error");
        });
		
		
	})
	
	$("#addParsonFace").click(function() {
		if (localMediaStream) {
				ctx.drawImage(video, 0, 0, w, h);
				var buf = toBinary(canvas)
				,blob = new Blob([buf.buffer], {
				    type: 'image/png'
				})
				
				,oReq = new XMLHttpRequest();
				
				oReq.open("POST", "https://api.projectoxford.ai/face/v1.0/persongroups/" + GROUPNAME + "/persons/" + getParsonId().val()  + "/persistedFaces" , true);
				oReq.onload = function (oEvent) {
					  console.log(this.responseText);
				};
				oReq.setRequestHeader("Content-Type","application/octet-stream");
		        oReq.setRequestHeader("Ocp-Apim-Subscription-Key",APIKEY);
		        oReq.send(blob);
		        
			   
		
		}
	});
});