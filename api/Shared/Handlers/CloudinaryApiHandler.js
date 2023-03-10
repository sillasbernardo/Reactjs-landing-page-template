/* This is a Cloudinary API setup */
/* ****************************** */
/* Check Cloudinary documentation for more informations */
/* https://cloudinary.com/documentation/cloudinary_get_started */
const cloudinary = require('cloudinary').v2;

const ApiError = require('./ApiError');
const transformImages = require('./CloudinaryTransformImages');

// Authentication
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/*
	--- @code ---

	@desc: This function searches for images on cloudinary
          and fetch them based on tagname
*/
const searchImages = async (tagname) => {
  try {
    // Error handling
    if (!tagname) {
      throw ApiError.notFound('Missing properties');
    }

    const result = await cloudinary.search
      .expression(`resource_type:image AND tags=${tagname}`)
      .execute();

    const images = result.resources.map((resource) => ({
      name: resource.filename,
      publicId: resource.public_id,
      link: resource.url,
      category: resource.folder.split('/').pop(),
    }));

    return images;
  } catch (error) {
    console.error(error);
    throw ApiError.internal('Something went wrong');
  }
};


/*
	--- @code ---

	@desc: This function transforms images and return the specified type
					of transformation.

					type: The type of transformation
					...options: Set of properties to be extracted and used to
											tranform images
*/
const transformImages = async (type, ...options) => {
  try {
    // Holds a set of properties based on type
    let cloudinaryUrlOptions;
    // Holds an array of images
    const [ images ] = options;

		// Handles missing properties in '...options'
		if (Object.keys(options).length === 0){
			throw ApiError.notFound('Missing properties');
		}

		// Define properties to be extracted
		let crop, format, width, height;

		// Define which properties are set based on type
    switch (type) {
      case 'resizeImages':
        [ width, crop ] = options;
        cloudinaryUrlOptions = { width, crop };			
				break;

      case 'optimizeImages':
				[ format ] = options;
				cloudinaryUrlOptions = {
					format,
					flags: 'lossy',
					quality: 'auto:good'
				}
				break;

      case 'cropImages':
				[ height, width, crop ] = options;				
				cloudinaryUrlOptions = { height, width, crop }
				break;
    }

		// Run transformation based on properties in cloudinaryUrlOptions
		const transformedImages = images.map((image) => {
			const url = cloudinary.url(image.publicId, cloudinaryUrlOptions);

			return {
				...image,
				link: url
			}
		})

		// Return an array of transformed images
		return transformedImages;
  } catch (error) {
		console.error(error)
		throw ApiError.internal('Something went wrong');
	}
};

/* --- @exports --- */
exports.searchImages = searchImages;
exports.transformImages = transformImages;
