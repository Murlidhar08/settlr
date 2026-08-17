import fs from "fs";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

/**
 * Ensures a directory exists, creating it if necessary.
 */
export const ensureDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

/**
 * Gets the absolute path for a given relative path within the upload root.
 */
export const getAbsolutePath = (relativePath: string) => {
    // Remove leading slashes and prevent path traversal
    let safePath = relativePath.replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
    if (safePath.startsWith("uploads/")) {
        safePath = safePath.replace(/^uploads\//, "");
    }
    return path.join(UPLOAD_ROOT, safePath);
};

/**
 * Gets the relative path (from upload root) for a given absolute path.
 */
export const getRelativePath = (absolutePath: string) => {
    return path.relative(UPLOAD_ROOT, absolutePath).replace(/\\/g, "/");
};

/**
 * Uploads a file to a specific location.
 */
export const uploadFile = async (file: File, destinationDir: string, fileName?: string): Promise<string> => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const finalFileName = fileName || `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const absoluteDir = getAbsolutePath(destinationDir);
    ensureDir(absoluteDir);

    const absolutePath = path.join(absoluteDir, finalFileName);
    fs.writeFileSync(absolutePath, buffer);

    return getRelativePath(absolutePath);
};

/**
 * Deletes a file from the server.
 */
export const deleteFile = async (relativePath: string) => {
    const absolutePath = getAbsolutePath(relativePath);
    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        return true;
    }
    return false;
};

/**
 * Moves a file from one location to another.
 */
export const moveFile = async (sourcePath: string, destinationDir: string, newFileName?: string): Promise<string> => {
    const sourceAbs = getAbsolutePath(sourcePath);
    if (!fs.existsSync(sourceAbs)) {
        throw new Error(`Source file not found: ${sourcePath}`);
    }

    const fileName = newFileName || path.basename(sourceAbs);
    const destAbsDir = getAbsolutePath(destinationDir);
    ensureDir(destAbsDir);

    const destAbs = path.join(destAbsDir, fileName);
    fs.renameSync(sourceAbs, destAbs);

    return getRelativePath(destAbs);
};

/**
 * Deletes a directory and all its contents.
 */
export const deleteDirectory = async (relativePath: string) => {
    const absolutePath = getAbsolutePath(relativePath);
    if (fs.existsSync(absolutePath)) {
        fs.rmSync(absolutePath, { recursive: true, force: true });
        return true;
    }
    return false;
};

/**
 * Lists contents of a directory.
 */
export const listDirectoryContents = async (relativePath: string = "") => {
    const absolutePath = getAbsolutePath(relativePath);
    if (!fs.existsSync(absolutePath)) return [];

    const items = fs.readdirSync(absolutePath, { withFileTypes: true });

    return items.map(item => {
        const itemPath = path.join(relativePath, item.name).replace(/\\/g, "/");
        const stats = fs.statSync(path.join(absolutePath, item.name));

        return {
            name: item.name,
            path: itemPath,
            isDir: item.isDirectory(),
            size: stats.size,
            updatedAt: stats.mtime,
            extension: item.isFile() ? path.extname(item.name).toLowerCase() : ""
        };
    });
};

/**
 * Renames a file or directory.
 */
export const renameItem = async (oldRelativePath: string, newName: string) => {
    const oldAbsPath = getAbsolutePath(oldRelativePath);
    if (!fs.existsSync(oldAbsPath)) throw new Error("Item not found");

    const parentDir = path.dirname(oldAbsPath);
    const newAbsPath = path.join(parentDir, newName);

    fs.renameSync(oldAbsPath, newAbsPath);
    return getRelativePath(newAbsPath);
};
