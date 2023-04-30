import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3001;
const sourcePath = process.env.SOURCE_PATH;

dotenv.config();
app.use(cors());

app.get("/api/videos", async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const videoDir = path.join(__dirname, "../static/videos");
    const selectedFolders = req.query.folders ? req.query.folders.split(",") : [];

    try {
        const videoFiles = await getVideoFilesRecursive(videoDir, selectedFolders);
        const relativePaths = videoFiles.map((filePath) => path.relative(videoDir, filePath));
        res.json(relativePaths);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to read video directory" });
    }
});

async function getVideoFilesRecursive(dir, selectedFolders = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const files = entries
        .filter((entry) => entry.isFile() && (path.extname(entry.name) === ".mp4" || path.extname(entry.name) === ".webm") &&
            !entry.name.startsWith("."))
        .map((entry) => path.join(dir, entry.name));

    const dirPromises = entries
        .filter((entry) => entry.isDirectory() && (selectedFolders.length === 0 || selectedFolders.includes(entry.name)))
        .map((entry) => getVideoFilesRecursive(path.join(dir, entry.name), selectedFolders));

    const subDirFiles = await Promise.all(dirPromises);
    return files.concat(...subDirFiles);
}

app.get('/api/video-folders', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const videoFolderPath = path.join(__dirname, "../static/videos");
    fss.readdir(videoFolderPath, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading video folders');
            return;
        }
        const folderNames = items
            .filter((item) => item.isDirectory())
            .map((item) => item.name);

        res.json(folderNames);
    });
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

    function removeDirectoryRecursiveSync(dirPath) {
        if (!fss.existsSync(dirPath)) {
            return;
        }

        const files = fss.readdirSync(dirPath, { withFileTypes: true });

        files.forEach((file) => {
            const fullPath = path.join(dirPath, file.name);
            if (file.isDirectory()) {
                removeDirectoryRecursiveSync(fullPath);
            } else {
                fss.unlinkSync(fullPath);
            }
        });

        fss.rmdirSync(dirPath);
    }

    function removeFilesSync(dirPath) {
        const files = fss.readdirSync(dirPath, { withFileTypes: true });

        files.forEach((file) => {
            const fullPath = path.join(dirPath, file.name);
            if (!file.isDirectory()) {
                fss.unlinkSync(fullPath);
            }
        });
    }

    try {
        console.log(videoDir);
        const dirEntries = fss.readdirSync(videoDir, { withFileTypes: true });
        const subDirectories = dirEntries
            .filter((dirEnt) => dirEnt.isDirectory())
            .map((dirEnt) => path.join(videoDir, dirEnt.name));

        subDirectories.forEach((dirPath) => {
            if (fss.existsSync(dirPath)) {
                removeDirectoryRecursiveSync(dirPath);
            }
        });

        // Remove files in the videoDir
        removeFilesSync(videoDir);

        res.json({ message: 'Videos and directories cleared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to clear video directory' });
    }
});

async function handleWifiManagement(req, res) {
    const { action, ssid, password } = req.body;
    let command;
    switch (action) {
        case 'scan':
            command = '/usr/sbin/iwlist wlan0 scan | grep ESSID';
            break;
        case 'connect':
            command = `wpa_supplicant -B -c /etc/wpa_supplicant/wpa_supplicant.conf -i wlan0 && sed -i "/^network={\\n\\tssid=\\\"${ssid}\\\"/d" /etc/wpa_supplicant/wpa_supplicant.conf && wpa_passphrase "${ssid}" "${password}" | tee -a /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null && wpa_cli -i wlan0 reconfigure`;
            break;
        case 'disconnect':
            command = 'wpa_cli -i wlan0 disconnect';
            break;
        default:
            res.status(400).json({ error: 'Invalid action' });
            return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json({ result: stdout.trim() });
        }
    });
}

app.use(express.json()); // Add this line to enable parsing JSON request bodies
app.post('/api/wifi', handleWifiManagement);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
