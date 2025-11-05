// services/mediaProcessor.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");

const FFMPEG_PATH = process.env.FFMPEG_PATH || "ffmpeg";
const FFPROBE_PATH = process.env.FFPROBE_PATH || "ffprobe";

ffmpeg.setFfmpegPath(FFMPEG_PATH);
ffmpeg.setFfprobePath(FFPROBE_PATH);

const QUALITY = parseInt(process.env.IMAGE_QUALITY || "82", 10); // WebP quality
const WEBM_VP9_CRF = parseInt(process.env.WEBM_VP9_CRF || "32", 10);

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function publicUrl(base, rel) {
  return `${base}/uploads/${rel.replace(/\\/g, "/")}`;
}

async function processImage({
  srcAbsPath,
  relFolder,
  baseNameNoExt,
  uploadsRootAbs,
  baseUrl,
}) {
  // Main WebP
  const mainOutRel = path.join(relFolder, `${baseNameNoExt}.webp`);
  const mainOutAbs = path.join(uploadsRootAbs, `${baseNameNoExt}.webp`);
  ensureDirSync(path.dirname(mainOutAbs));

  const img = sharp(srcAbsPath);
  const meta = await img.metadata();
  await img.webp({ quality: QUALITY }).toFile(mainOutAbs);
  const mainStat = fs.statSync(mainOutAbs);

  // Thumbnail WebP (max 480)
  const thumbOutRel = path.join(relFolder, `${baseNameNoExt}.thumb.webp`);
  const thumbOutAbs = path.join(uploadsRootAbs, `${baseNameNoExt}.thumb.webp`);
  await sharp(srcAbsPath)
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: Math.max(QUALITY - 10, 60) })
    .toFile(thumbOutAbs);
  const thumbMeta = await sharp(thumbOutAbs).metadata();
  const thumbStat = fs.statSync(thumbOutAbs);

  const main = {
    url: publicUrl(baseUrl, mainOutRel),
    width: meta.width || null,
    height: meta.height || null,
    size: mainStat.size,
    mime: "image/webp",
    label: "webp",
    quality: QUALITY,
  };
  const thumb = {
    url: publicUrl(baseUrl, thumbOutRel),
    width: thumbMeta.width || null,
    height: thumbMeta.height || null,
    size: thumbStat.size,
    mime: "image/webp",
    label: "thumb",
    quality: Math.max(QUALITY - 10, 60),
  };

  return {
    type: "image",
    canonical: main,
    variants: [main, thumb],
  };
}

function ffprobeAsync(src) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(src, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

async function processVideo({
  srcAbsPath,
  relFolder,
  baseNameNoExt,
  uploadsRootAbs,
  baseUrl,
}) {
  // WebM path
  const webmRel = path.join(relFolder, `${baseNameNoExt}.webm`);
  const webmAbs = path.join(uploadsRootAbs, `${baseNameNoExt}.webm`);
  ensureDirSync(path.dirname(webmAbs));

  // Transcode to VP9 WebM
  await new Promise((resolve, reject) => {
    ffmpeg(srcAbsPath)
      .outputOptions([
        "-c:v libvpx-vp9",
        `-crf ${WEBM_VP9_CRF}`,
        "-b:v 0",
        "-row-mt 1",
        "-pix_fmt yuv420p",
        "-c:a libopus",
        "-b:a 96k",
      ])
      .save(webmAbs)
      .on("end", resolve)
      .on("error", reject);
  });

  // Poster (jpeg) + webp
  const posterJpgRel = path.join(relFolder, `${baseNameNoExt}.poster.jpg`);
  const posterJpgAbs = path.join(uploadsRootAbs, `${baseNameNoExt}.poster.jpg`);
  await new Promise((resolve, reject) => {
    ffmpeg(srcAbsPath)
      .frames(1)
      .outputOptions(["-q:v 3"])
      .save(posterJpgAbs)
      .on("end", resolve)
      .on("error", reject);
  });

  const posterWebpRel = path.join(relFolder, `${baseNameNoExt}.poster.webp`);
  const posterWebpAbs = path.join(
    uploadsRootAbs,
    `${baseNameNoExt}.poster.webp`
  );
  await sharp(posterJpgAbs)
    .webp({ quality: Math.max(QUALITY - 5, 60) })
    .toFile(posterWebpAbs);

  const info = await ffprobeAsync(webmAbs);
  const stream = (info.streams || []).find((s) => s.width && s.height) || {};
  const webmStat = fs.statSync(webmAbs);
  const posterStat = fs.statSync(posterWebpAbs);

  const webm = {
    url: publicUrl(baseUrl, webmRel),
    width: stream.width || null,
    height: stream.height || null,
    size: webmStat.size,
    mime: "video/webm",
    label: "webm",
  };
  const poster = {
    url: publicUrl(baseUrl, posterWebpRel),
    width: null,
    height: null,
    size: posterStat.size,
    mime: "image/webp",
    label: "poster",
  };

  return {
    type: "video",
    canonical: webm,
    duration: Number(info.format?.duration || 0),
    posterUrl: poster.url,
    variants: [webm, poster],
  };
}

module.exports = { processImage, processVideo, ensureDirSync };
