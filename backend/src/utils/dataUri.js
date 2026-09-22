import path from "path";

export const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();

    const mimeType = file.mimetype;

    const dataUri = `data:${mimeType};base64,${file.buffer.toString("base64")}`;

    return {
        content: dataUri,
        extName
    };
};

