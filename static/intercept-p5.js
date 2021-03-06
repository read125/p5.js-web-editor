var textOutputElement;
var canvasLocation ='';

funcNames = allData["classitems"].map(function(x){
  if(x["overloads"]) {
    tempParam = x["overloads"][0]["params"];
  } else {
    tempParam = x["params"];
  }
   return {
    name: x["name"],
    params: tempParam,
    class: x["class"],
    module: x["module"],
    submodule: x["submodule"]
  };
});

funcNames = funcNames.filter(function(x) {
  var className = x["class"];
  return (x["name"] && x["params"] && (className==='p5'));
})


funcNames.forEach(function(x){
  var document = parent.document;
  var originalFunc = p5.prototype[x.name];
  p5.prototype[x.name] = function(){
    orgArg = arguments;
    if(frameCount == 0) { //for setup
      Interceptor.setupObject = Interceptor.populateObject(x,arguments, Interceptor.setupObject,  document.getElementById('textOutput-content-details'),false);
      Interceptor.getSummary(Interceptor.setupObject,Interceptor.drawObject,document.getElementById('textOutput-content-summary'));
      var table = document.getElementById('textOutput-content-details');
      // table.innerHTML = '';
      Interceptor.populateTable(table,Interceptor.setupObject.objectArray);
    }

    else if(frameCount%100 == 0 ) {
      Interceptor.drawObject = Interceptor.populateObject(x,arguments, Interceptor.drawObject, document.getElementById('textOutput-content-details'),true);
      Interceptor.isCleared = false;
    }
    //reset some of the variables
    else if(frameCount%100 == 1 ) {
      if(!Interceptor.isCleared){
        var table = document.getElementById('textOutput-content-details');
        Interceptor.getSummary(Interceptor.setupObject,Interceptor.drawObject,document.getElementById('textOutput-content-summary'));
        Interceptor.populateTable(table,Interceptor.setupObject.objectArray.concat(Interceptor.drawObject.objectArray));
      }
      Interceptor.drawObject = Interceptor.clearVariables(Interceptor.drawObject);
    }
    return originalFunc.apply(this,arguments);
  }
});
