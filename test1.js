var canvas
var ctx
var video;
var webcamWidth;
var webcamHeight;

var start;
var end;

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

function startWebcam() {
   canvas = document.getElementById("myCanvas")
   video = document.getElementById('video')
  
  ctx = canvas.getContext('2d')
  const mediaSource = new MediaSource();

  if (navigator.getUserMedia) {
    navigator.getUserMedia (
      {
        video: true,
        audio: false
      },

      function(stream) {
        webcamWidth = stream.getVideoTracks()[0].getSettings().width
        webcamHeight = stream.getVideoTracks()[0].getSettings().height
        canvas.setAttribute('width', webcamWidth);
        canvas.setAttribute('height', webcamHeight);

        // video.src = window.URL.createObjectURL(localMediaStream);
        video.srcObject = stream
        video = document.getElementById('video');

        if (navigator.mediaDevices.getUserMedia) {
            
            video.srcObject = stream;
          } else {
            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL.createObjectURL(stream);
          }
          video.play();
      },

      function(err) {
        console.log( err);
      }
    );
  } else {
  console.log("getUserMedia not supported by your browser");
  }
}

function getCurrentFrame() {
  ctx.drawImage(video, 0,0, webcamWidth, webcamHeight)
  const img_dataURI = canvas.toDataURL('image/png');

  
  document.getElementById("myCanvas").src = img_dataURI
  console.log("here");

  console.log(ctx);
  const image=ctx.getImageData(0,0,webcamWidth,webcamHeight);
  console.log(image);
  


    realiseProcess(image);


}
/*
function takepicture() {
    const context = canvas.getContext("2d");
    if (webcamWidth && webcamHeight) {
      canvas.width = webcamWidth;
      canvas.height = webcamHeight;
      context.drawImage(video, 0, 0, webcamWidth, webcamHeight);

      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
    } else {
      clearphoto();
    }
  }*/

function realiseProcess(image){

    start = new Date();

    console.log("je suis ici!");

    //let src = cv.imread(image);
    let src = cv.imread("myCanvas");
    console.log(src);
    let dst = new cv.Mat();
    let dsize = new cv.Size(300, 300);

    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
    
    
    cv.cvtColor(dst, dst, cv.COLOR_BGR2GRAY, 0);
    cv.cvtColor(dst, dst, cv.COLOR_BGR2RGB, 0);


    let ksize = new cv.Size(5, 5);
    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);


    let M = cv.Mat.ones(5, 5, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);

  //cv.threshold(dst,dst,200, 177,cv.THRESH_OTSU);
    // You can try more different parameters
    //cv.erode(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

    cv.cvtColor(dst, dst, cv.COLOR_BGR2GRAY, 0);
    cv.Canny(dst, dst, 60, 35, 3, false);
    cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY);
    //let hierarchy = new cv.Mat();
    //You can try more different parameters

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    for (let i = 0; i < contours.size(); ++i) {
        let red = Math.floor(Math.random() * (Math.floor(255) - Math.ceil(0) + 1) + Math.ceil(0));
        let green = Math.floor(Math.random() * (Math.floor(255) - Math.ceil(0) + 1) + Math.ceil(0));
        let blue = Math.floor(Math.random() * (Math.floor(255) - Math.ceil(0) + 1) + Math.ceil(0)); 

        //console.log(contours.get(i));
        //console.log("R."+red+" G."+green+" B."+blue);
        let color2 =  new cv.Scalar(red,green, blue);  
        

        cv.drawContours(dst, contours, i, color2, 1, cv.LINE_8, hierarchy, 0);
    
    }

        
    cv.imshow("myCanvas2", dst);

    end = new Date();

    console.log(end-start);
}