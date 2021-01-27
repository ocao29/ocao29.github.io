let handlefail = function(err){
    console.log(err)
}

function addName(streamId) {
    let nameList = document.getElementById("participantList");
    let participantName = document.createElement("span");
    let space = document.createElement("br");
    let spaceTwo = document.createElement("br");

    participantName.innerHTML = streamId;
    nameList.append(space);
    nameList.append(spaceTwo);
    nameList.appendChild(participantName);
}

function addVideoStream(streamId){
    console.log()
    let remoteContainer = document.getElementById("right-bottom");

    let streamDiv = document.createElement("div");
    let spaceDiv = document.createElement("div");

    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "150px";
    streamDiv.style.width = "350px";
    streamDiv.style.textAlign = "left";
    streamDiv.style.marginTop = "15px";
    streamDiv.style.justifySelf = "center";
    streamDiv.style.border = "2px solid #099dfd";

    spaceDiv.style.width = "10px";

    remoteContainer.appendChild(spaceDiv);
    remoteContainer.appendChild(streamDiv);
} 

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "6375fbbc160b4b96b715e3000e89682f";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"),handlefail
    )

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
                addName(Username)
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })
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
        addName(stream.getId());
        stream.play(stream.getId());
    })

}