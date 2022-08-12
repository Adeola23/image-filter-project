import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8083;
  
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
  app.get( "/filteredimage", async ( req, res ) => {
    let {image_url} = req.query
    const urlValidator= new RegExp('^(https?:\\/\\/)?'+ 
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
	    '(\\#[-a-z\\d_]*)?$','i'); 
    const isValidUrl = urlValidator.test(image_url)
    if(!isValidUrl){
      res.send("invalid url")
    }
    let filteredpath = await filterImageFromURL(image_url) 
    await res.sendFile(filteredpath)
    await deleteLocalFiles([filteredpath])
   
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();