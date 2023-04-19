import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 3001;
const sourcePath = process.env.SOURCE_PATH;

dotenv.config();
app.use(cors());

async function getVideoFilesRecursive(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
        .filter((entry) => entry.isFile() && path.extname(entry.name) === ".mp4" &&
            !entry.name.startsWith("."))
        .map((entry) => path.join(dir, entry.name));
    const dirPromises = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => getVideoFilesRecursive(path.join(dir, entry.name)));
    const subDirFiles = await Promise.all(dirPromises);
    return files.concat(...subDirFiles);
}

app.get("/api/videos", async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const videoDir = path.join(__dirname, "../static/videos");

    try {
        const videoFiles = await getVideoFilesRecursive(videoDir);
        const relativePaths = videoFiles.map((filePath) => path.relative(videoDir, filePath));
        res.json(relativePaths);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to read video directory" });
    }
});

app.post("/api/add_videos_from_source", async (req, res) => {
    const sourceDir = sourcePath;
    console.log(`The source path is: ${sourceDir}`);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const videoDir = path.join(__dirname, "../static/videos");

    try {
        const videoFiles = await getVideoFilesRecursive(sourceDir);
        await Promise.all(
            videoFiles.map(async (sourceFilePath) => {
                const relativePath = path.relative(sourceDir, sourceFilePath);
                const destinationFilePath = path.join(videoDir, relativePath);
                await fs.mkdir(path.dirname(destinationFilePath), { recursive: true });
                await fs.copyFile(sourceFilePath, destinationFilePath);
            })
        );

        res.json({ message: "Videos added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to add videos from the source location" });
    }
});

app.delete('/api/clear_videos', async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const videoDir = path.join(__dirname, '../static/videos');

    async function removeDirectoryRecursive(dirPath) {
        const files = await fs.readdir(dirPath, { withFileTypes: true });

        await Promise.all(files.map(async (file) => {
            const fullPath = path.join(dirPath, file.name);
            if (file.isDirectory()) {
                await removeDirectoryRecursive(fullPath);
            } else {
                await fs.unlink(fullPath);
            }
        }));

        await fs.rmdir(dirPath);
    }

    try {
        const subDirectories = (await fs.readdir(videoDir, { withFileTypes: true }))
            .filter((dirEnt) => dirEnt.isDirectory())
            .map((dirEnt) => path.join(videoDir, dirEnt.name));

        await Promise.all(subDirectories.map(async (dirPath) => {
            await removeDirectoryRecursive(dirPath);
        }));

        res.json({ message: 'Videos and directories cleared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to clear video directory' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
