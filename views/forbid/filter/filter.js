define(['angularAMD'], function(angularAMD, factory) {
	angularAMD.filter('passTimeRange', function($sce) {
      return function(input) {
        var out = "";
        function fillZero(str){
        	if(str.length < 4){
        		var strZero = "";
        		for(var j=0; j<(4-str.length);j++){
        			strZero += "0";
        		}
        		str = strZero + str;
        	}
        	return str;
        }
        if(input && input.length > 0){
        	for(var i=0; i<input.length;i++){
	        	var beginTime = fillZero(input[i].beginTime.toString());
	        	var endTime = fillZero(input[i].endTime.toString());
	        	if(i > 0){
					out += ", ";
				}
				out += beginTime.substr(0,2)+":"+beginTime.substr(2,2) + "-" +endTime.substr(0,2)+":"+endTime.substr(2,2);
	        }
        }
        return out;
      };
	})
	
});