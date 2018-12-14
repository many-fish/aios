module.exports = function(data,fixed = 1){
  if(!data) return '0KB';
  
  var value = data / 1024;
  var units = ['KB','MB','GB','TB','PB'];

  for(var index = 0 ; value >= 1 ; value = data/1024){
    data = value;
    index ++;
  }

  return data.toFixed(fixed) + units[index];
}