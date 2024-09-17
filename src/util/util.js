import fs from 'fs';
import Jimp from 'jimp';
import fetch from 'node-fetch'; // Import fetch for handling image fetching

export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the image
      const response = await fetch(inputURL);
      if (!response.ok) {
        return reject(new Error('Failed to fetch image from URL. Status: ' + response.status));
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        return reject(new Error('URL does not point to an image. Content-Type: ' + contentType));
      }

      // Read image from response buffer
      const buffer = await response.arrayBuffer();
      const photo = await Jimp.read(buffer);
      
      const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // Resize
        .quality(60) // Set JPEG quality
        .greyscale() // Set greyscale
        .write(outpath, () => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
