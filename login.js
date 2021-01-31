document.getElementById("join").onclick = function () {
    window.location.href = "video.html";
    localStorage["username"] = document.getElementById("username").value;
    localStorage["channelName"] = document.getElementById("channelName").value;
}  