// http://talkerscode.com/webtricks/file-upload-progress-bar-using-jquery-and-php.php
// using jQuery Forms
function upload_image() 
{
  var bar = $('#bar');
  var percent = $('#percent');
  $('#myForm').ajaxForm({
    beforeSubmit: function() {
      document.getElementById("progress_div").style.display="block";
      var percentVal = '0%';
      bar.width(percentVal)
      percent.html(percentVal);
    },

    uploadProgress: function(event, position, total, percentComplete) {
      var percentVal = percentComplete + '%';
      bar.width(percentVal)
      percent.html(percentVal);
    },
    
	success: function() {
      var percentVal = '100%';
      bar.width(percentVal)
      percent.html(percentVal);
    },

    complete: function(xhr) {
      if(xhr.responseText)
      {
        document.getElementById("output_image").innerHTML=xhr.responseText;
      }
    }
  }); 
}

// https://www.codedodle.com/2016/10/nodejs-image-uploader-using-express-and.html
// JQuery pure, but $.ajax() is omitted from jQ slim version


//$('#uploadForm').on('submit', function (event) {
function send(){
    //event.preventDefault();

    // Get the files from input, create new FormData.
    var files = $('#file').get(0).files,
        formData = new FormData();
    
    if (files.length === 0) {
        alert('Select file to upload PLS');
        return false;
    }

    file = files[0];
    formData.append('video', file, file.name);
    formData.append('title', $("#title").val());
    formData.append('description', $("#description").val());
    
    uploadFiles(formData);
}
//});

function uploadFiles(formData) {
    $.ajax({
        url: '/upload',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        xhr: function () {
            var xhr = new XMLHttpRequest();

            // Add progress event listener to the upload.
            xhr.upload.addEventListener('progress', function (event) {
                var progressBar = $('.progress-bar');

                if (event.lengthComputable) {
                    var percent = (event.loaded / event.total) * 100;
                    progressBar.width(percent + '%');

                    if (percent === 100) {
                        progressBar.removeClass('active');
                        $("#status").html("Upload complete. Please wait for encoding to finish")

                    }
                }
            });

            return xhr;
        }
    }).done(handleSuccess).fail(function (xhr, status) {
        $("#status").html(status);
    });
}

function handleSuccess(){
    $("#status").html("Encoding finished")
}