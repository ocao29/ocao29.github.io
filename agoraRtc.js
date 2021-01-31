localStorage["state"] = "stop";

let handlefail = function(err){
    console.log(err)
}

let appId = "6375fbbc160b4b96b715e3000e89682f";
let globalStream;
let isAudioMuted = false;
let isVideoMuted = false;

let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
})

client.init(appId,() => console.log("AgoraRTC Client Connected"),handlefail
)

function removeMyVideoStream(streamId) {
    globalStream.stop();
}

function removeVideoStream(evt) {
    let stream = evt.stream;
    stream.stop;
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
}


function addVideoStream(streamId){
    localStorage["numPeople"]++;
    console.log()
    let remoteContainer = document.getElementById("bottom");
    let raceContainer = document.getElementById("positions");
    let remoteData = document.getElementById("remoteData");

    let streamDiv = document.createElement("div");
    let spaceDiv = document.createElement("div");
    let characterDiv = document.createElement("div");
    let distance = document.createElement("span");
    let distanceSpace = document.createElement("span");

    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "35vh";
    streamDiv.style.width = "17vw";
    streamDiv.style.textAlign = "left";
    streamDiv.style.marginTop = "20px";
    streamDiv.style.justifySelf = "center";

    characterDiv.style.height = "30px";
    characterDiv.style.width = "30px";

    if(localStorage["numPeople"] % 4 === 1) {
        streamDiv.style.border = "2px solid #DC143C";
        characterDiv.style.backgroundColor = "#DC143C";
        distance.innerHTML = "0.7 mi";
        characterDiv.style.marginLeft = "80vw";
    }
    else if(localStorage["numPeople"] % 4 === 2) {
        streamDiv.style.border = "2px solid #9932CC";
        characterDiv.style.backgroundColor = "#9932CC";
        distance.innerHTML = "0.62 mi";
        characterDiv.style.marginLeft = "50vw";
    }
    else if(localStorage["numPeople"] % 4 === 3) {
        streamDiv.style.border = "2px solid #DAA520";
        characterDiv.style.backgroundColor = "#DAA520";
        distance.innerHTML = "0.65 mi";
        characterDiv.style.marginLeft = "60vw";
    }
    else {
        streamDiv.style.border = "2px solid #F5DEB3";
        characterDiv.style.backgroundColor = "#F5DEB3";
        distance.innerHTML = "0.5 mi";
        characterDiv.style.marginLeft = "30vw";
    }

    spaceDiv.style.width = "3vw";
    distanceSpace.style.marginRight = "17vw";

    remoteContainer.appendChild(spaceDiv);
    remoteContainer.appendChild(streamDiv);
    remoteData.appendChild(distanceSpace);
    remoteData.appendChild(distance);
    raceContainer.appendChild(characterDiv);
} 

document.getElementById("leave").onclick = function () {
    client.leave(function() {
        console.log("Left!")
    },handlefail
    )
    removeMyVideoStream();
    window.location.href = "index.html";
}

let channelName = localStorage["channelName"];
let Username = localStorage["username"];

client.join(
    null,
    channelName,
    Username,
    () =>{
        var localStream = AgoraRTC.createStream({
            video: true,
            audio: true,
        })

        localStream.init(function(){
            localStream.play("SelfStream")
            console.log(`App id: ${appId}\nChannel id: ${channelName}`)
            client.publish(localStream)
        })

        globalStream = localStream
        localStorage["numPeople"] = 0;
    }
)


client.on("stream-added", function (evt){
    console.log("Added Stream");
    client.subscribe(evt.stream,handlefail)
})

client.on("stream-subscribed", function(evt){
    console.log("Subscribed Stream");
    let stream = evt.stream;
    addVideoStream(stream.getId());  
    stream.play(stream.getId());
})

client.on("peer-leave", function(evt) {
    console.log("Peer has left")
    removeVideoStream(evt)
}) 



document.getElementById("video-mute").onclick = function(evt){
    if(!isVideoMuted){
        globalStream.muteVideo()
        isVideoMuted = true;
        console.log("mute video")
    } 
    else {
        globalStream.unmuteVideo();
        isVideoMuted = false;
        console.log("unmute video")

    }
}

document.getElementById("audio-mute").onclick = function(){
    if(!isAudioMuted){
        globalStream.muteAudio()
        isAudioMuted = true;
        console.log("mute audio")

    } 
    else {
        globalStream.unmuteAudio();
        isAudioMuted = false;
        console.log("unmute audio")

    }
}

localStorage["seconds"] = 0;
localStorage["minutes"] = 0;
localStorage["hours"] = 0;
localStorage["isReset"] = "false";

let displaySeconds;
let displayMinutes;
let displayHours;
let state = "stop";

window.setInterval(everyoneReset, 100);

function stopWatch() {
    if(localStorage["state"] !== "stop") {
        localStorage["seconds"]++;

        if(localStorage["seconds"] / 60 === 1) {
            localStorage["seconds"] = 0;
            localStorage["minutes"]++;
        }
        if(localStorage["minutes"] / 60 === 1) {
            localStorage["minutes"] = 0;
            localStorage["hours"]++;
        }

        if(localStorage["seconds"] < 10) {
            displaySeconds = "0" + localStorage["seconds"].toString();
        }
        else{
            displaySeconds = localStorage["seconds"];
        }

        if(localStorage["minutes"] < 10) {
            displayMinutes = "0" + localStorage["minutes"].toString();
        }
        else{
            displayMinutes = localStorage["minutes"];
        }

        if(localStorage["hours"] < 10) {
            displayHours = "0" + localStorage["hours"].toString();
        }
        else{
            displayHours = localStorage["hours"];
        }

        document.getElementById("stopWatch").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;   
    }
    
}

function remoteStopWatch() {
    if(localStorage["seconds"] / 60 === 1) {
        localStorage["seconds"] = 0;
        localStorage["minutes"]++;
    }
    if(localStorage["minutes"] / 60 === 1) {
        localStorage["minutes"] = 0;
        localStorage["hours"]++;
    }

    if(localStorage["seconds"] < 10) {
        displaySeconds = "0" + localStorage["seconds"].toString();
    }
    else{
        displaySeconds = localStorage["seconds"];
    }

    if(localStorage["minutes"] < 10) {
        displayMinutes = "0" + localStorage["minutes"].toString();
    }
    else{
        displayMinutes = localStorage["minutes"];
    }

    if(localStorage["hours"] < 10) {
        displayHours = "0" + localStorage["hours"].toString();
    }
    else{
        displayHours = localStorage["hours"];
    }

        document.getElementById("stopWatch").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
}

function startStop() {
    if(state==="stop") {
        if(localStorage["state"]==="start") {
            interval = window.setInterval(remoteStopWatch, 1);
        }
        else {
            interval = window.setInterval(stopWatch, 1000);
        }
        state = "start";
        localStorage["state"] = state;
        document.getElementById("startStop").innerHTML = "Stop";
    }
    else{
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
        state = "stop";
        localStorage["state"] = state;
    }
    
}

function reset() {
    window.clearInterval(interval);
    localStorage["seconds"] = 0;
    localStorage["minutes"] = 0;
    localStorage["hours"] = 0;
    document.getElementById("stopWatch").innerHTML = "00:00:00";
    document.getElementById("startStop").innerHTML = "Start";
    state = "stop";
    localStorage["state"] = state;
    localStorage["isReset"] = "true";
}

function everyoneReset() {
    if(localStorage["isReset"]==="true") {
        window.clearInterval(interval);
        document.getElementById("stopWatch").innerHTML = "00:00:00";
        document.getElementById("startStop").innerHTML = "Start";
        state = "stop";
        localStorage["state"] = state;
        localStorage["isReset"] = "false";
    }
}

