
Kill your build if it is stuck on heroku
```
heroku builds:cancel -a "happy-christmas-server"
```

View the server logs in real time on Heroku
```
heroku logs -t -a "happy-christmas-server"
```

1. `npm i`
1. reset database if required...
    1. open `index.js`
    1. uncomment the "db sync force true" line
    1. comment "db seq sync" line above 
    1. save & restart 
    1. swap 2 & 3 and save changes -db reset
1. `npm run dev`

---

### Photo Upload

1. `PhotoController.addPhoto` function runs when user submits a photo
2. Access photo data through the `request.body`
3. Because we used a base64 string for our image we do not need to handle file uploads, the image is treated like normal text.
4. Using a free Cloudinary account, their API gives us the ability to easily upload a base64 string and it is automatically converted into an image for us. Making me a lazy developer.
    * `Cloud.uploader.upload(base64string, options, callback)`
    * The options are for giving it a unique ID that we can store in our database to reference at a later time, such as deleting the photo from Cloudinary.
    * The `callback` is a function that runs after the photo is succesfully uploaded to Cloudinary.
    * We can access the uploaded photo data from Cloudinary via the `result` param in our callback.
    * It is in the callback where we create our Photo; `Photo.create()`.
    * We are saving the `result.public_id` to the database under `photos.cloudinary_public_id`.
    * We also get a `url` from the `result` that gives us a hard-coded URL leading directly to the photo. We save this in the database on the photo record as `photos.url`. In our UI we simply reference this `url` for the image as `<img src={photo.url} />`

### Delete a Photo
1. `PhotoController.removePhoto` is called
2. Finds the photo by ID to ensure it exists.
3. If photo exists in our database we run the `Cloud.uploader.destroy(publicId, options, callback)` function.
4. Once Cloudinary successfully deletes the photo from their server our callback function will run.
5. Now we delete it from our database.