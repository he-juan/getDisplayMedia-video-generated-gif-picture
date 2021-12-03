
let  videoContainer = document.getElementById("videoContainer")
let videoElem = document.getElementById("video")
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
var width,height,rangeW,rangeH,sx,sy;


/*共享桌面*/
async function startCapture() {
    try {
        console.log('Start capturing.');
        if (navigator.getDisplayMedia) {
            videoElem.srcObject = await navigator.getDisplayMedia({video: {
                    width: 720,
                    height: 360
                },audio:true});

        } else if (navigator.mediaDevices.getDisplayMedia) {
            videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia({video:  {
                    width: 720,
                    height: 360
                },audio:true});
        } else {
            videoElem.srcObject = await navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});

        }

        videoElem.onloadedmetadata = function(){
            videoElem.play()
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

    console.log(" start finish")
    playCanvas(videoElem,ctx,sx,sy,rangeW,rangeH);

}
/*
* videoElem视频转换到canvas中
* */
function playCanvas(videoElem,ctx,sx,sy,rangeW,rangeH){

    canvas.height = rangeH;
    canvas.width = rangeW;

    ctx.drawImage(videoElem, sx, sy, rangeW, rangeH, 0, 0, canvas.width, canvas.height);
    canvas.style.border = "none";
    ctx.fillStyle = "#05a0ff";
    ctx.font = "italic 30px 黑体";
    ctx.textBaseline = 'middle';//更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
    ctx.textAlign = 'center';


    requestAnimationFrame(() => {
        playCanvas(videoElem,ctx,sx,sy,rangeW,rangeH);
        //playCanvas(videoElem,ctx,data,data1,sx,sy,rangeW,rangeH,mousedownx,mousedowny)
    })
}


$(document).ready(function(){
    $('#videoContainer').frameSelection({
        mask:true,
        callback:function(){
            console.log('rendering!!!');
        },
        done:function(result){
            console.log('rendering done',result);
        }
    }) ;
})