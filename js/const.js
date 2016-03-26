/**
 * 
 */
(function(factory) {

  
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  //node.js 
 if (typeof exports !== 'undefined') {
    factory(exports);

  // browser
  } else {
    factory(root);
  }

})(function(root){
	root.APIKEY = 'ec7ea3cd14694f7baa7e0ab2050d9376';
	 
})
