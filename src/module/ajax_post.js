module.exports = function(url,search,callback){
  var xhr = new XMLHttpRequest();

  xhr.onload = function(){
    if(xhr.status == 200)
      callback(JSON.parse(xhr.responseText));
    else
      callback('request is error , the status is ' + xhr.status);
  }

  xhr.onerror = function(){
    callback('xhr error');
  }
			
  var data = '';
  for(var key in search)
    data += `${key}=${search[key]}&`;
			
  xhr.open('post',url);
  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  xhr.send(data);
}