const { writeFile } = require('fs')
const uuid = require('uuid');

/**
 * Helpful Guides...
 *  https://www.codeblocq.com/2016/04/Convert-a-base64-string-to-a-file-in-Node/
 */
module.exports = {
    
    /**
     * Returns the file extension 
     * and bas64 string.
     */
    getInfoFromBase64: (base64String) => {
        // remove headers using split and get an array in return
        // 1st position in array is `data:image/png` = type
        // 2nd position in array is the base64 string = string
        // destructure array
        const [type, string] = base64String.split(';base64,')
        return {
            // split('/') - removes the "/" and gives us an array
            // .pop() - returns "png", last item in the array
            extension: type.split('/').pop(),
            string
        }
    },

    /**
     * Generate a unique filename.
     */
    generateFilename: (extension) => {
        // generate a unique ID - https://github.com/uuidjs/uuid
        const id = uuid.v4() // example ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        return `${id}.${extension}` // example ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed.png'
    },

    /**
     * Save a base64 string to the uploads 
     * folder with a given filename.
     */
    createFile: (filename, base64String) => {
        // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
        writeFile(`uploads/${filename}`, base64String, {
            encoding: 'base64'
        }, (error) => {
            if (error) {
                console.log('Error creating file', { error })
                throw error
            }
            console.log('file created')
        })
    },

    /**
     */
    generateFileUrl: (address, filename) => {
        return `${address}/photos/${filename}`
    },

    /**
     */
    mapGenerateFileUrl: (address, objects) => {
        if (!objects || !objects.length) return []
        return objects.map(o => {
            return {
                ...o,
                url: `${address}/photos/${o.filename}` 
            }
        })
    }   
}