function inspectObject(o,i){
    if(typeof i=='undefined')i='';
    if(i.length>50)return '[MAX ITERATIONS]';
    var r=[];
    for(var p in o){
        var t=typeof o[p];
        r.push(i+'"'+p+'" ('+t+') => '+(t=='object' ? 'object:'+inspectObject(o[p],i+'  ') : o[p]+''));
    }
    return r.join(i+'\n');
}

function maxHeight(list){
	var max = 0;
	list.forEach(function(elem){
		if (elem.height > max) max = elem.height; 
	});
	return max;
}