"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidJsonMiddleware = exports.checkValidImgMiddleware = exports.uploadManager = void 0;
const fileUpload = require('express-fileupload');
const MB_TO_BYTE = 1024 * 1024;
const MAX_IMAGE_SIZE = 3 * MB_TO_BYTE; // 3mb
const MAX_IMAGE_COUNT = 9;
/**
 * Create file uploader middle ware
 */
const uploadManager = fileUpload({
    limits: {
        fileSize: MAX_IMAGE_SIZE,
        // add 1 in this will help check if user send more files than limit
        files: MAX_IMAGE_COUNT + 1,
    },
    abortOnLimit: true,
    // safeFileNames: true,
    limitHandler: (req, res, next) => {
        return res.status(400).json({ error: 'Uploaded image should be less than ' + Math.trunc(MAX_IMAGE_SIZE / MB_TO_BYTE) + 'mb and upload ' + MAX_IMAGE_COUNT + ' images each time' });
    }
});
exports.uploadManager = uploadManager;
/**
 * Checking if uploaded file is valid including:
 *    in right form field (images)
 *    in limit amount of files
 *    correct file type (jpg)
 */
function checkValidImgMiddleware(req, res, next, required = true) {
    var _a;
    if ((!req.files || !((_a = req.files) === null || _a === void 0 ? void 0 : _a.image)) && !required) {
        // image not found but not required
        return next();
    }
    // check if files exist or file is in the correct field
    if (!req.files || !req.files.image) {
        const err = 'Images not found or not set in the right fields form. Only accept fields "image"';
        return res.status(400).json({ error: err });
    }
    // check if files is jpg img
    let img = req.files.image;
    if (img.mimetype !== 'image/jpeg' && img.mimetype !== 'image/jpg') {
        const err = 'File should be an jpg/jpeg type. Found ' + img.mimetype;
        return res.status(400).json({ error: err });
    }
    return next();
}
exports.checkValidImgMiddleware = checkValidImgMiddleware;
async function checkValidJsonMiddleware(req, res, next) {
    // check if files exist or file is in the correct field
    if (!req.files || !req.files.json) {
        const err = 'Json not found or not set in the right fields form. Only accept fields "json"';
        return res.status(400).json({ error: err });
    }
    // auto convert to array if there is multiple json
    const is_arr = Array.isArray(req.files.json);
    // check if only 1 json
    if (is_arr) {
        const err = 'Only upload 1 json at a time. Found ' + req.files.json.length;
        return res.status(400).json({ error: err });
    }
    // check if files is json type
    let json = req.files.json;
    if (json.mimetype !== 'application/json') {
        const err = '"json" field only accept json file';
        return res.status(400).json({ error: err });
    }
    // application/json will make json.data a string
    req.body = JSON.parse(json.data.toString());
    return next();
}
exports.checkValidJsonMiddleware = checkValidJsonMiddleware;
//# sourceMappingURL=UploadManager.js.map