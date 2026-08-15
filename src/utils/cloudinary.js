// src/utils/cloudinary.js

/**
 * Transforms a raw Cloudinary URL to include auto-format, auto-quality, and sizing.
 * @param {string} url - The original Cloudinary image URL
 * @param {number} width - Target width in pixels
 * @returns {string} - Transformed image URL
 */
export const optimizeCloudinaryUrl = (url, width = 500) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('f_auto') || url.includes('q_auto')) return url;

  const transformFlags = `f_auto,q_auto,w_${width},c_limit`;

  return url.replace(/\/image\/upload\/(?:v\d+\/)?/, (match) => {
    if (match.includes('/v')) {
      const version = match.match(/v\d+\//)[0];
      return `/image/upload/${transformFlags}/${version}`;
    }
    return `/image/upload/${transformFlags}/`;
  });
};