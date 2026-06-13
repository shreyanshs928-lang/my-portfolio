import { storage } from './config';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage under /portfolio/{section}/{timestamp}-{filename}
 * Updates a progress callback during the process and returns the public download URL.
 * 
 * @param {string} section - e.g., 'about', 'work-social', 'work-print'
 * @param {File} file - File object to upload
 * @param {function} onProgress - Progress percentage callback
 * @returns {Promise<string>} Public download URL
 */
export const uploadImage = (section, file, onProgress) => {
  return new Promise((resolve, reject) => {
    // Generate unique name
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueName = `${timestamp}-${cleanFileName}`;
    
    // Set destination ref
    const fileRef = storageRef(storage, `portfolio/${section}/${uniqueName}`);
    
    // Start resumable upload
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error('Storage Upload Error: ', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });
};

/**
 * Deletes an image from Firebase Storage using its public URL
 * 
 * @param {string} url - Public Firebase Storage URL
 * @returns {Promise<void>} Resolves when delete completes
 */
export const deleteImage = async (url) => {
  if (!url || typeof url !== 'string' || !url.includes('firebasestorage.googleapis.com')) {
    // If it's a built-in SVG placeholder or external non-firebase image, skip deletion
    return;
  }
  
  try {
    const fileRef = storageRef(storage, url);
    await deleteObject(fileRef);
    console.log('Image deleted from Storage successfully.');
  } catch (err) {
    console.error('Failed to delete image from storage: ', err);
  }
};
