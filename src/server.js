import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import Jimp from 'jimp';
import fetch from 'node-fetch'; 


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */
    app.get('/filteredimage', async (req, res) => {
      const { image_url } = req.query;
      if (!image_url) {
        return res.status(400).json({ error: 'Image URL is required' });
      }
    
      try {
        const filteredImagePath = await filterImageFromURL(image_url);
        res.sendFile(filteredImagePath, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            return res.status(500).json({ error: 'Error sending file' });
          }
          deleteLocalFiles([filteredImagePath]);
        });
      } catch (error) {
        console.error('Error processing image:', error.message);
        return res.status(500).json({ error: `Unable to process image: ${error.message}` });
      }
    });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
