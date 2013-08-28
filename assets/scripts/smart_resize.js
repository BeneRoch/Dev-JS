/**
*	SMART RESIZE
*
*	@param {max_ratio} Maximal dimensions
*		- width
*		- height
*
*	@param {dimensions} Actual dimensions
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
	var new_dimensions = dimensions;

	
	var ratio = dimensions.width / dimensions.height;
	var check_width = true;
	// On gère le width parce qu'il est le plus grand (ou égal)
	if (ratio >= 1) {
		// Si la dimension dépasse la largeur de l'écran (ou la largeur maximale)
		if (relative_dimension.width) {
			// Si le width est trop grand, on créer un nouveau height
			// avec le width maximal.
			new_dimensions.height = max_ratio.width / ratio;
			new_dimensions.width = max_ratio.width;
			if (new_dimensions.height > max_ratio.height) {
				check_width = false;
			}
		}
	}
	// On gère le height parce qu'il est le plus grand
	if (ratio < 1 || !check_width) {
		// Si la dimension dépasse la hauteur de l'écran (ou la hauteur maximale)
		if (relative_dimension.height) {
			new_dimensions.width = max_ratio.height * ratio;
			new_dimensions.height = max_ratio.height;
			// We're doomed.
			if (new_dimensions.width > max_ratio.width) {

			}
		}
	}

	return new_dimensions;
}