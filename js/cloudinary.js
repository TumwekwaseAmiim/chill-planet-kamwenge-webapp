// =========================================================
// CHILL PLANET
// CLOUDINARY SPONSOR IMAGE UPLOAD
// =========================================================


// =========================================================
// CLOUDINARY CONFIG
// =========================================================

const CLOUDINARY_CLOUD_NAME =
  "qlxhf4mv";

const CLOUDINARY_UPLOAD_PRESET =
  "chill_planet_sponsors";


// =========================================================
// ALLOWED IMAGE TYPES
// =========================================================

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];


// =========================================================
// MAX FILE SIZE
// 5 MB
// =========================================================

const MAX_FILE_SIZE =
  5 * 1024 * 1024;


// =========================================================
// VALIDATE IMAGE
// =========================================================

export function validateSponsorImage(
  file
) {

  if (!file) {

    return {
      valid: false,
      message:
        "Please choose a sponsor image."
    };

  }


  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {

    return {
      valid: false,
      message:
        "Only JPG, PNG and WEBP images are allowed."
    };

  }


  if (
    file.size >
    MAX_FILE_SIZE
  ) {

    return {
      valid: false,
      message:
        "The sponsor image must be smaller than 5 MB."
    };

  }


  return {
    valid: true,
    message: ""
  };

}


// =========================================================
// UPLOAD SPONSOR IMAGE TO CLOUDINARY
// =========================================================

export async function uploadSponsorImage(
  file
) {

  const validation =
    validateSponsorImage(
      file
    );


  if (
    !validation.valid
  ) {

    throw new Error(
      validation.message
    );

  }


  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );


  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


  const response =
    await fetch(
      uploadUrl,
      {
        method: "POST",
        body: formData
      }
    );


  let data = null;


  try {

    data =
      await response.json();

  }

  catch {

    data = null;

  }


  if (
    !response.ok
  ) {

    console.error(
      "Cloudinary upload failed:",
      data
    );


    const cloudinaryMessage =
      data?.error?.message;


    throw new Error(
      cloudinaryMessage ||
      "Sponsor image upload failed."
    );

  }


  if (
    !data?.secure_url ||
    !data?.public_id
  ) {

    console.error(
      "Invalid Cloudinary response:",
      data
    );


    throw new Error(
      "Cloudinary did not return the expected image information."
    );

  }


  return {

    imageUrl:
      data.secure_url,

    cloudinaryPublicId:
      data.public_id,

    width:
      data.width || null,

    height:
      data.height || null,

    format:
      data.format || "",

    bytes:
      data.bytes || 0,

    originalFilename:
      data.original_filename ||
      file.name ||
      "",

    createdAt:
      data.created_at || null

  };

}


// =========================================================
// BUILD OPTIMIZED CLOUDINARY IMAGE URL
// =========================================================

export function getOptimizedSponsorImageUrl(
  imageUrl,
  options = {}
) {

  if (
    !imageUrl ||
    !imageUrl.includes(
      "res.cloudinary.com"
    )
  ) {

    return (
      imageUrl ||
      ""
    );

  }


  const width =
    Number(
      options.width
    ) || 600;


  const quality =
    options.quality ||
    "auto";


  const format =
    options.format ||
    "auto";


  const transformation =
    `f_${format},q_${quality},w_${width},c_limit`;


  return imageUrl.replace(
    "/upload/",
    `/upload/${transformation}/`
  );

}


// =========================================================
// CREATE LOCAL IMAGE PREVIEW
// =========================================================

export function createSponsorImagePreview(
  file
) {

  const validation =
    validateSponsorImage(
      file
    );


  if (
    !validation.valid
  ) {

    throw new Error(
      validation.message
    );

  }


  return URL.createObjectURL(
    file
  );

}


// =========================================================
// REVOKE LOCAL PREVIEW URL
// =========================================================

export function revokeSponsorImagePreview(
  previewUrl
) {

  if (
    !previewUrl
  ) {

    return;

  }


  try {

    URL.revokeObjectURL(
      previewUrl
    );

  }

  catch {

    // Ignore cleanup errors

  }

}


// =========================================================
// CLOUDINARY CONFIG INFO
// =========================================================

export function getCloudinaryConfig() {

  return {

    cloudName:
      CLOUDINARY_CLOUD_NAME,

    uploadPreset:
      CLOUDINARY_UPLOAD_PRESET

  };

}