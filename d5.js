"user strict";


const videoElem = document.getElementById("video");
const video = document.getElementById("recorder");
var container  = document.getElementsByClassName("container");
var result = document.getElementById("result");
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

/*文字输入框核按钮*/
var text = document.getElementById("text");
var btn = document.getElementById("btn");

/*开始、关闭桌面共享*/
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");


var mousedownx,
    mousedowny,
    mouseDownX,
    mouseDownY,
    scrollTop,
    scrollLeft,
    InputTop,
    InputLeft,
    canvasX,
    canvasY,
    canvasTop,
    canvasLeft;

/*录制开始、关闭和下载按钮*/
var recordButton = document.querySelector('button#record');
var playButton = document.querySelector('button#play');
var downloadButton = document.querySelector('button#download');
recordButton.onclick = toggleRecording;
playButton.onclick = play;
downloadButton.onclick = download;


var recording = null;
var data;
var data1;

startElem.addEventListener("click", function(evt) {
    startCapture();

}, false);

stopElem.addEventListener("click", function(evt) {
    stopCapture();
}, false);

btn.addEventListener("click",function(){
    console.log("submit")
    playCanvas(videoElem,ctx,data,data1,sx,sy,rangeW,rangeH);
},false);



function toggleRecording() {
    if (recordButton.textContent === 'Start Recording') {

        startRecording();
    } else {

        stopRecording();
        recordButton.textContent = 'Start Recording';
        playButton.disabled = false;
        downloadButton.disabled = false;
    }
}



/*共享桌面*/
async function startCapture() {
    try {
        console.log('Start capturing.');
        if (navigator.getDisplayMedia) {
            videoElem.srcObject = await navigator.getDisplayMedia({video: {
                    width: 1280,
                    height: 720
                },audio:true});

        } else if (navigator.mediaDevices.getDisplayMedia) {
            videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia({video:  {
                    width: 1280,
                    height: 720
                },audio:true});
        } else {
            videoElem.srcObject = await navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});

        }
    } catch(err) {
        console.error("Error: " + err);
    }
}

function stopCapture(evt) {
    console.log('Stop capturing.');
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;

}
/////////////////////////




$(document).ready(function(){
    $('#container').frameSelection({
        mask:true,
        callback:function(){
            console.log('rendering!!!');
        },
        done:function(result){
            console.log('rendering done',result);
        }
    }) ;
})

var width,height,rangeW,rangeH,sx,sy;

function finish() {

    var videoHeight = videoElem.videoHeight;
    var videoWidth = videoElem.videoWidth;

    width = Math.abs(window.endPositionX - window.startPositionX);
    height = Math.abs( window.endPositionY - window.startPositionY);
    rangeW = videoWidth * (width / videoElem.offsetWidth);
    rangeH = videoHeight * (height / videoElem.offsetHeight);
    canvas.height = rangeH;
    canvas.width  = rangeW;


     sx = (window.startPositionX-window.startLeftX) ;
     sy = (window.startPositionY-window.startTopY);


    ctx.clearRect(0, 0, videoWidth, videoHeight);
    // console.warn("Video width: ", videoWidth);
    // console.warn("Video height: ", videoHeight);
    // console.warn("startPositionX: ", window.startPositionX);
    // console.warn("startPositionY: ", window.startPositionY);
    // console.warn("endPositionX: ", window.endPositionX);
    // console.warn("endPositionY: ", window.endPositionY);
    // console.warn("startLeftX: ", window.startLeftX);
    // console.warn("startTopY: ", window.startTopY);
    // console.warn("endleftX(sx): ", sx);
    // console.warn("endleftY(sy): ", sy);
    // console.warn('width: ', width);
    // console.warn("height： ", height);
    // console.warn('range width: ', rangeW);
    // console.warn("range height： ", rangeH);
    //
    // console.warn("window.rectWidth:",window.rectWidth);
    // console.warn("window.rectHeight:",window.rectHeight);
    //
    // console.warn("container.width:", container.offsetWidth);
    // console.warn("container.height:",container.offsetHeight);

    // ctx.drawImage(videoElem, sx, sy, rangeW, rangeH, 0, 0, canvas.width, canvas.height);
    // requestAnimationFrame(() => {
    //     finish();
    // })
    console.log(" start finish")
    playCanvas(videoElem,ctx,data,data1,sx,sy,rangeW,rangeH);

}
    /*
* videoElem视频转换到canvas中
* */
function playCanvas(videoElem,ctx,data,data1,sx,sy,rangeW,rangeH){

  // canvas.height = "400";
  // canvas.width = "712";

    canvas.height = rangeH;
    canvas.width = rangeW;
    console.log("rangeH:",rangeH);
    console.log("rangeW:",rangeW)
    data = div.value;
    data1 = text.value;
    console.log("data:",data);
    console.log("data1:",data1);
    var tw1 = ctx.measureText(data1).width;
    var tw = ctx.measureText(data).width;
    ctx.drawImage(videoElem, sx, sy, rangeW, rangeH, 0, 0, canvas.width, canvas.height);
   canvas.style.border = "none";
    ctx.fillStyle = "#05a0ff";
    ctx.font = "italic 30px 黑体";
    ctx.textBaseline = 'middle';//更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
    ctx.textAlign = 'center';



    var ftop =  mousedowny ;
    var fleft =  mousedownx;
    console.log("ftop:",ftop)
    console.log("fleft:",fleft)
    ctx.fillText(data,fleft,ftop);

    var fftop = canvas.height/2+120;
    var ffleft = canvas.width/2;
    // ctx.fillText("追逐",150,140);
    ctx.fillText(data1,ffleft,fftop);

    requestAnimationFrame(() => {
        playCanvas(videoElem,ctx,data,data1,sx,sy,rangeW,rangeH);
           //playCanvas(videoElem,ctx,data,data1,sx,sy,rangeW,rangeH,mousedownx,mousedowny)
    })
}









////////////////////////////////////////////////
/*
* 随机输入文字
* */

function videoToCanvas(canvas,x,y){
    var bbox = canvas.getBoundingClientRect();
    return {
        x:x,
        y:y,
        l:bbox.left,
        m:bbox.top
    }
}

var div = document.createElement('textarea');
canvas.onclick = function(e){
    var loc = videoToCanvas(canvas,e.clientX,e.clientY) ;//获取鼠标点击在canvas的坐标
    e.preventDefault();
    canvasLeft  = canvas.getBoundingClientRect().left;
    canvasTop = canvas.getBoundingClientRect().top;
    canvasX = loc.l;
    canvasY = loc.m;
    scrollTop  = document.documentElement.scrollTop ||  document.body.scrollTop;
    scrollLeft = document.documentElement.scrollLeft ||document.body.scrollLeft;
    InputLeft = loc.x;
    InputTop  = loc.y;
    mouseDownX = scrollLeft + e.clientX;
    mouseDownY = scrollTop +  e.clientY;
    mousedownx = mouseDownX- canvasLeft /*- loc.l*/;
    mousedowny = mouseDownY - canvasTop/* - loc.m*/;
    console.warn("点击时X的坐标:",e.clientX);
    console.warn("点击时Y的坐标:",e.clientY);

    var divId = 0;
    // divId = divId + 1;
    div.id = 'edit_' + divId;
    div.contentEditable = true;
    div.onclick = function(e) {
        e.preventDefault();
    }
    div.style.width = '200px';
    div.style.height = '50px';
    div.style.border = 'solid 1px #f50';
    div.style.cursor ="move";

    div.style.top = e.y + 'px';
    div.style.left = e.x + 'px';
    div.style.position = 'fixed';
    div.style.display = 'black';

    document.body.appendChild(div);


};

div.onmouseleave = function(ev){
    // var loc= videoToCanvas(canvas,e.clientY,e.clientY);
    div.style.border = 'none';
    // div.style.dispaly = "none";
    // console.warn("canvasX:", canvasX);
    // console.warn("canvasY:", canvasY);
    //
    // console.warn("canvasLeft:",canvasLeft);
    // console.warn("canvasTop:", canvasTop);
    //
    //
    // console.warn("loc.x",InputLeft);
    // console.warn("loc.y",InputTop);
    //
    // console.warn("ev.clientX",ev.clientX);
    // console.warn("ev.clientY",ev.clientY);
    //
    // console.warn("scrollLeft: ",scrollLeft);
    // console.warn("scrollTop: ", scrollTop);
    //
    // console.warn("mouseDownX: ",mouseDownX);
    // console.warn("mouseDownY: ", mouseDownY);
    //
    // console.warn("mousedownx: ", mousedownx);
    // console.warn("mousedowny: ", mousedowny);
    // console.warn("fleft:",fleft );
    // console.warn("ftop:",ftop);

    // console.warn("canvasTop:", canvasTop)
    document.body.removeChild(div);
    console.log("let's go")
};


///////////////////////////////////////////////////////////

// var mediaSource = new MediaSource();
// mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
// var mediaRecorder;
// var recordedBlobs;
// var sourceBuffer;
// var audioBuffer;
//
// function handleSourceOpen(event) {
//     console.log('MediaSource opened');
//     sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
//     audioBuffer = mediaSource.addSourceBuffer("audio/webm; ");
//     console.log('Source buffer: ', sourceBuffer);
// }


      /*录制视频 */
function startRecording() {
    var options = {
             mimeType: 'video/webm;codecs=vp9',
             audioBitsPerSecond : 128000,  // 音频码率
             videoBitsPerSecond : 500000,  // 视频码率
             ignoreMutedMedia: true
            };
    //var options = {mimeType: 'video/webm;codecs=vp9'};
        recordedBlobs = [];
    var audioBuffer;
    const stream = canvas.captureStream(60);
    try {
        mediaRecorder = new MediaRecorder(stream, options);
    } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', options, e0);
        try {
            options = {mimeType: 'video/webm;codecs=vp8',
                audioBitsPerSecond : 128000,  // 音频码率
                videoBitsPerSecond : 500000,  // 视频码率
              };
           // options = {mimeType: 'video/webm;codecs=vp8'};
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e1) {
            console.log('Unable to create MediaRecorder with options Object: ', options, e1);
            try {
                options = 'video/mp4';
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e2) {
                alert('MediaRecorder is not supported by this browser.');
                console.error('Exception while creating MediaRecorder:', e2);
                return;
            }

        }
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;

    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
}

function handleStop(event) {
    console.log('Recorder stopped: ', event);
}
function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function stopRecording() {
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    video.controls = true;
}


function play() {
    var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    video.src = window.URL.createObjectURL(superBuffer);
    video.play();



    video.onloadedmetadata = function (event) {
        console.warn("video: ", event)
        console.warn("video.height",video.videoHeight);
        console.warn("video.width:",video.videoWidth);
        window.videoheight = video.videoHeight +"px";
        window.videowidth = video.videoWidth +"px";
        window.videoH = video.offsetHeight ;
        window.videoW = video.offsetWidth ;

        console.log("videoh",video.offsetHeight);
        console.log("videoW",video.offsetWidth);

        console.log("window.videoheight:",window.videoheight );
        console.log(" window.videowidth:", window.videowidth);
        console.log("windowvideoH1:",window.videoH );
        console.log(" windowvideoW1:",  window.videoW);


       // document.getElementById('result').style.cssText = 'height:' + window.height + "width:" + window.width;
        result.style.height =  window.videoH +"px";
        result.style.width =    window.videoW +"px";
        // result.height = window.videoheight;
        // result.width = window.videowidth;
        console.log("imgWidth1:",result.width);
        console.log("imgHeight1:",result.height);

        playControl = true;
    }
}

function download() {
    var blob = new Blob(recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}





