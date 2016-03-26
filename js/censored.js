$(function() {
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
	,identify = function(faceIds){
		
		$.ajax({
            url: "https://api.projectoxford.ai/face/v1.0/identify",
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",APIKEY);
            },
            type: "POST",
            // Request body
            data: JSON.stringify({'faceIds':faceIds,"personGroupId":GROUPNAME,"maxNumOfCandidatesReturned":5})
        })
        .done(function(data) {
        	if(typeof data == 'string'){
        		data = JSON.parse(data);
        		
        	}
        	var censord = false;
        	for (var i = 0; i < data.length; i++) {
				var result = data[i];
				if(!result.candidates || result.candidates.length === 0){
					
					censord = true;
				}
			}
        	$('#open').hide();
			if(censord === false){
				$('#not_censored').show();
				
				
			}
			else
			{
				$('#censored').show();
			}
        	
        })
        .fail(function() {
            alert("error");
        });
	}
	,canvas = document.getElementById('canvas')
	,ctx = canvas.getContext('2d')
	,img = document.getElementById('img')
	,w = video.offsetWidth
	,h = video.offsetHeight;			
	

	if(!hasGetUserMedia()) {
		alert("this browser can not use webrtc");
	} else {
		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		navigator.getUserMedia({video: true}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			localMediaStream = stream;
		}, onFail);
	}
	canvas.setAttribute("width", w);
	canvas.setAttribute("height", h);
	ctx.drawImage(video, 0, 0, w, h);
	

	$("#start").click(function() {
		if (localMediaStream) {
				
			
				ctx.drawImage(video, 0, 0, w, h);
				var buf = toBinary(canvas)
				,blob = new Blob([buf.buffer], {
				    type: 'image/png'
				})
				,params = {
			            // Request parameters
			            "returnFaceId": "true",
			            "returnFaceLandmarks": "false",
			            "returnFaceAttributes": "age,gender",
			            
			    }
				,oReq = new XMLHttpRequest();
				
				oReq.open("POST", "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(params), true);
				oReq.onload = function (oEvent) {
					var xmlDoc = $.parseXML(this.responseText)
					  	,$xml = $( xmlDoc )
					  	,faceIds = [];
					$xml.find('faceId').each(function(){
						faceIds.push($(this).text());
						
					});
					/*
					$('#open').hide();
					if(faceIds.length === 1){
						$('#not_censored').show();
						
						
					}
					else
					{
						$('#censored').show();
					}
					*/
					identify(faceIds); 
				};
				oReq.setRequestHeader("Content-Type","application/octet-stream");
		        oReq.setRequestHeader("Ocp-Apim-Subscription-Key",APIKEY);
		        oReq.send(blob);
		        
			   
		
		}
	});
});