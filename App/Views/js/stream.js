$('document').ready(() => {
    var myOptions = {
        "nativeControlsForTouch": false,
        controls: true,
        autoplay: true,
        width: "640",
        height: "400",
    }
    myPlayer = amp("player", myOptions);

    // Add a testvideo
    addVideo({
        title: "Demo video",
        path: "//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest"
    });

    // Get all videos from server
    $.ajax({
        url: "/videos",
        success: function (videos) {
            videos.forEach(video => {
                addVideo(video);
            });
        }
    });
});

function changeURL(url){
    console.log(url);
    myPlayer.src([
        {
            "src" : url,
            "type" : "application/vnd.ms-sstr+xml"
        }
    ]);
}

function addVideo(video) {
    let newVideo = document.createElement("a");
    newVideo.innerHTML = video.title + " - " + video.description;
    newVideo.setAttribute("href", "#");
    newVideo.setAttribute("onclick", "javascript:changeURL('" + video.path + "')")
    document.getElementById('videoList').append(newVideo);
}