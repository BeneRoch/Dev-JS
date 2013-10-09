/**
*	SMART RESIZE
*
*	@param {max_ratio} Maximal dimensions (window?)
*		- width
*		- height
*
*	@param {dimensions} Actual dimensions (image?)
*		- width
*		- height
*	
*	@return {Object}
*		- width -> new width (or old, if {dimensions} are small enough)
*		- height -> new height
*
*	@author Bene Roch
*/
function smart_cropper_size(max_ratio, dimensions) {

  // Too big?
  var relative_dimension = {
    width : dimensions.width > max_ratio.width,
    height: dimensions.height > max_ratio.height
  }

  // New dimensions
  var dimensions = dimensions;
  var new_dimensions = {
    width : dimensions['width'],
    height : dimensions['height']
  };


  
  var ratio = dimensions.width / dimensions.height;
  var check_width = true;

  // Si la dimension dépasse la largeur de l'écran (ou la largeur maximale)
  if (relative_dimension.width) {
    // Si le width est trop grand, on créer un nouveau height
    // avec le width maximal.
    new_dimensions.height = max_ratio.width / ratio;
    new_dimensions['scale'] = new_dimensions.height / dimensions.height;

    new_dimensions.width = max_ratio.width;
    if (new_dimensions.height > max_ratio.height) {
      check_width = false;
    }
  }
  // Si la dimension dépasse la hauteur de l'écran (ou la hauteur maximale)
  // On doit maintenant tester les nouvelles dimensions
  if (relative_dimension.height && new_dimensions.height > max_ratio.height) {
    new_dimensions['width'] = max_ratio.height * ratio;
    new_dimensions['scale'] = new_dimensions['width'] / dimensions['width'];

    new_dimensions.height = max_ratio.height;
    // We're doomed.
    if (new_dimensions.width > max_ratio.width) {

    }
  }
  new_dimensions['ratio'] = ratio;
  new_dimensions['relative'] = relative_dimension;
  new_dimensions['old'] = dimensions;

  // debug(new_dimensions);

  return new_dimensions;
}
