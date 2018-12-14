module.exports = function(config,callback,progress = null){
  var form = document.createElement('form');
  form.setAttribute('enctype','multipart/form-data');

  var data = new FormData(form);

  data.append('File',config.file);
  data.append('FileType',config.type);
  data.append('FilePath',config.file_vir);
  data.append('ParentPath',config.path_vir);

  var xhr = new XMLHttpRequest();

  xhr.onload = function(){
      if(xhr.status == 200)
        callback(JSON.parse(xhr.responseText));
      else
        callback('request is error , the status is ' + xhr.status);
  }

  xhr.upload.onprogress = progress;

  xhr.onerror = function(){
    callback('xhr error');
  }

  xhr.open('post','/Home/UpLoadFile');
  xhr.send(data);

  return xhr;
}