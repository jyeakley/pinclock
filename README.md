## Overview
This is a clock app that is designed to run on a SBC (Le Potato, Raspberry Pi, etc.). This clock application provides the ability to load mp4 or webm files into the MEDIA_HOME directory. These can then be synced via the UI. Once this process has been completed, you have many options for clock configuration to keep time overtop of the videos files playing in the background.


Example. 

1. Reformat a USB or other media device to NTFS or Debian compatible format. Name this media medium "pinclock"
2. Within this medium, create a folder called "videos"
3. For each category of video, create a sub folder that corresponds. Like the below.

```bash
  Videos
   - Subfolder 1
      - some media file
      ...
   - Subfolder 2
   - Subfolder 3
   ...
```

4. Make sure to set the MEDIA_HOME variable in the .env file next to the Docker Compose file. This should be something like "/media/justin" (if your main user in this case is "justin"). This way, when the medium is plugged in, the full file path would be "/media/justin/pinclock/videos".
5. Build and start Docker Compose.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## API Endpoints

### `GET /api/videos`

Get a list of video files. You can filter the video files by folders using the `folders` query parameter.

**Example:**

`/api/videos?folders=folder1,folder2`

### `GET /api/video-folders`

Get a list of video folders.

### `POST /api/add_videos_from_source`

Add video files from the source directory specified in the `.env` file.

### `DELETE /api/clear_videos`

Delete all video files and folders from the application's video directory.

## Docker Compose Configuration

The `docker-compose.yml` file includes the following services:

1. `pinclock`: The Svelte app
   - Build context: Current directory
   - Image name: `pinclock:latest`
   - Volumes: `videos` volume mounted to `/build/client/videos`
   - Ports: 3000 (host) mapped to 3000 (container)

2. `pinclock-api`: The Express API
   - Build context: Current directory
   - Image name: `pinclock:latest`
   - Environment: `SOURCE_PATH` set to `${MEDIA_HOME}/pinclock/videos`
   - `env_file`: `.env`
   - Volumes: `videos` volume mounted to `/static/videos`, `${MEDIA_HOME}` mounted to `${MEDIA_HOME}`
   - Ports: 3001 (host) mapped to 3001 (container)
   - Command: `node api/server.js`

In addition, the `docker-compose.yml` file defines a named volume `videos` for storing video files.

## Getting Started

1. Clone this repository to your local machine.
2. Install Docker and Docker Compose if you haven't already.
3. In the root directory of the project, create a `.env` file and set the `MEDIA_HOME` variable to the path of your media directory, which will be used as the parent directory for your video source directory.
4. From the root directory of the project, run `docker-compose up` to build and start the containers.
5. You can now use the API endpoints in your Svelte app to manage video files and folders. The Svelte app will be accessible at `http://localhost:3000`, and the API will be accessible at `http://localhost:3001`.