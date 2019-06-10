import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import fs from 'fs';

(async () => {

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

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/filteredimage", async (req, res) => {

    const {
      image_url
    } = req.query;

    // validate the image_url query
    if (!image_url) {
      return res.status(400).send({ message: 'image not found' })
    }

    // call filterImageFromURL(image_url) to filter the image
    const filteredpath = await filterImageFromURL(image_url);

    if (!filteredpath) {
      return res.status(422).send({ message: 'unable to process image for filtering' })
    }

    let imagePathArr: string[] = [];
    imagePathArr.push(filteredpath);

    var stream = fs.createReadStream(filteredpath);

    stream.once("close", function () {
      stream.destroy(); // makesure stream closed, not close if download aborted.
      deleteLocalFiles(imagePathArr); // deletes any files on the server on finish of the response
    }).pipe(res.status(200));
    // res.status(200).sendFile(filteredpath);   

  });


  // Root URI call
  app.get("/", async (req, res) => {
    res.send("connected");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();