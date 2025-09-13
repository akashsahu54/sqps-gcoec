const { google } = require('googleapis');
const path = require('path');
const { Readable } = require('stream');

const KEYFILEPATH = path.join(__dirname, '..', 'service-account-key.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });
const SHARED_DRIVE_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // This is now your Shared Drive ID

const uploadToGoogleDrive = async (file) => {
    try {
        if (!file) {
            console.error("No file provided to uploadToGoogleDrive function.");
            return null;
        }

        const { buffer, originalname, mimetype } = file;
        const fileStream = Readable.from(buffer);

        const response = await drive.files.create({
            requestBody: {
                name: originalname,
                mimeType: mimetype,
                parents: [SHARED_DRIVE_ID], // Use the Shared Drive ID here
            },
            media: {
                mimeType: mimetype,
                body: fileStream,
            },
            fields: 'id, webViewLink',
            supportsAllDrives: true, // <-- THIS IS THE CRUCIAL NEW LINE
        });

        // Permissions are inherited from the Shared Drive, so we don't need to set them manually
        // for each file. This simplifies the code.

        console.log('File uploaded successfully. Link:', response.data.webViewLink);
        return response.data.webViewLink;

    } catch (error) {
        console.error('Error during Google Drive upload:', error);
        return null;
    }
};

module.exports = { uploadToGoogleDrive };

