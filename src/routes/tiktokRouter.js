// routes/tiktokRouter.js
const express = require('express');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const sanitize = require('sanitize-filename');

const router = express.Router();
ffmpeg.setFfmpegPath(ffmpegPath);

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
const COMMON_HEADERS = { 'User-Agent': UA, Referer: 'https://www.tikwm.com/' };

/** ---- Helper: build Content-Disposition an toàn (ASCII + UTF-8) ---- */
function buildContentDisposition(filenameWithExt) {
  // loại CR/LF để tránh header injection
  const cleaned = String(filenameWithExt).replace(/[\r\n]/g, ' ').trim();

  // Fallback ASCII cho "filename=" (chỉ giữ ASCII in-range 0x20..0x7E)
  const fallback =
    sanitize(cleaned)
      .replace(/[^\x20-\x7E]+/g, '_') // bỏ ký tự ngoài ASCII
      .replace(/"/g, "'") || 'file';

  // filename* (UTF-8, percent-encoded)
  const encoded = encodeURIComponent(cleaned);

  // ví dụ: attachment; filename="ascii_fallback.mp4"; filename*=UTF-8''ten_goc_co_dau.mp4
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

/** ---- Lấy metadata từ nguồn TikWM ---- */
async function getTikTokMeta(tiktokUrl) {
  if (!tiktokUrl) throw new Error('Thiếu tham số "url".');
  const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`;
  const res = await axios.get(api, { headers: COMMON_HEADERS, timeout: 15000 });

  if (!res.data || res.data.code !== 0) {
    const msg = res.data?.msg || 'Không lấy được metadata từ nguồn.';
    throw new Error(msg);
  }
  const d = res.data.data || {};
  return {
    title: d.title || 'tiktok_video',
    author: d.author?.unique_id || d.author?.nickname || 'author',
    duration: d.duration,
    cover: d.cover,
    videoNoWM: d.play || d.hdplay,
    videoHD: d.hdplay || d.play,
    music: d.music,
    wm: d.wmplay,
  };
}

/** ---- Proxy file về client (stream) ---- */
async function proxyFile(res, fileUrl, filenameWithExt, contentType) {
  // set headers trước khi pipe
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', buildContentDisposition(filenameWithExt));

  const streamRes = await axios.get(fileUrl, {
    responseType: 'stream',
    headers: COMMON_HEADERS,
    timeout: 30000,
  });
  streamRes.data.pipe(res);
}

/** GET /api/tiktok/info?url=...  -> metadata + direct links */
router.get('/info', async (req, res) => {
  try {
    const { url } = req.query;
    const meta = await getTikTokMeta(url);
    return res.json({ ok: true, data: meta });
  } catch (e) {
    return res.status(400).json({ ok: false, message: e.message || 'Lỗi không xác định' });
  }
});

/**
 * GET /api/tiktok/download?url=...&type=video|audio
 * - video: trả MP4 không logo (ưu tiên HD)
 * - audio: trả MP3 (có sẵn -> proxy; không có -> tách bằng ffmpeg)
 */
router.get('/download', async (req, res) => {
  try {
    const { url, type = 'video' } = req.query;
    const meta = await getTikTokMeta(url);

    const baseName =
      `${meta.author}-${meta.title}`.slice(0, 120) || 'tiktok'; // tên file không đuôi
    const videoUrl = meta.videoHD || meta.videoNoWM;

    if (type === 'audio') {
      if (meta.music) {
        // có sẵn mp3 -> proxy
        return proxyFile(res, meta.music, `${baseName}.mp3`, 'audio/mpeg');
      }
      // fallback: tách mp3 từ mp4
      if (!videoUrl) throw new Error('Không tìm thấy nguồn video để tách audio.');
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', buildContentDisposition(`${baseName}.mp3`));

      ffmpeg(videoUrl)
        .addOptions(['-vn'])
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .format('mp3')
        .on('error', (err) => {
          console.error('FFmpeg error:', err?.message);
          if (!res.headersSent) res.status(500).end('Không tách được audio.');
        })
        .pipe(res, { end: true });
      return;
    }

    // type=video
    if (!videoUrl) throw new Error('Không tìm thấy link MP4 không logo.');
    return proxyFile(res, videoUrl, `${baseName}.mp4`, 'video/mp4');
  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      res.status(400).json({ ok: false, message: e.message || 'Tải thất bại' });
    }
  }
});

module.exports = router;

// routes/mediaRouter.js
// const express = require('express');
// const axios = require('axios');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('ffmpeg-static');
// const sanitize = require('sanitize-filename');
// const ytdl = require('ytdl-core');

// const router = express.Router();
// ffmpeg.setFfmpegPath(ffmpegPath);

// // ---- User Agents
// const UA =
//   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
// const MOBILE_UA =
//   'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1';

// const COMMON_HEADERS = { 'User-Agent': UA, Referer: 'https://www.tikwm.com/' };

// /* ==================== Helpers ==================== */
// function detectPlatform(url = '') {
//   const u = (url || '').toLowerCase();
//   if (/tiktok\.com|vt\.tiktok\.com/.test(u)) return 'tiktok';
//   if (/youtube\.com|youtu\.be/.test(u)) return 'youtube';
//   if (/facebook\.com|fb\.watch/.test(u)) return 'facebook';
//   if (/instagram\.com/.test(u)) return 'instagram';
//   return null;
// }

// function buildContentDisposition(filenameWithExt) {
//   const cleaned = String(filenameWithExt).replace(/[\r\n]/g, ' ').trim();
//   const fallback =
//     sanitize(cleaned).replace(/[^\x20-\x7E]+/g, '_').replace(/"/g, "'") || 'file';
//   const encoded = encodeURIComponent(cleaned);
//   return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
// }

// function htmlDecode(str = '') {
//   return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
// }
// const decodeIgUrl = (s = '') =>
//   s.replace(/\\u0026/g, '&').replace(/\\\//g, '/').replace(/&amp;/g, '&');

// function extractFacebookId(url = '') {
//   const m1 = url.match(/\/reel\/(\d+)/);
//   if (m1) return m1[1];
//   const m2 = url.match(/[?&]v=(\d+)/);
//   if (m2) return m2[1];
//   const m3 = url.match(/\/videos\/(?:[^/]+\/)?(\d+)/);
//   if (m3) return m3[1];
//   return null;
// }

// /* ==================== TikTok ==================== */
// async function getTikTokMeta(tiktokUrl) {
//   const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`;
//   const res = await axios.get(api, { headers: COMMON_HEADERS, timeout: 15000 });
//   if (!res.data || res.data.code !== 0) {
//     const msg = res.data?.msg || 'Không lấy được metadata TikTok.';
//     throw new Error(msg);
//   }
//   const d = res.data.data || {};
//   return {
//     platform: 'tiktok',
//     title: d.title || 'tiktok_video',
//     author: d.author?.unique_id || d.author?.nickname || 'author',
//     duration: d.duration,
//     thumbnail: d.cover,
//     video: d.hdplay || d.play, // no-watermark
//     music: d.music || null,
//   };
// }

// /* ==================== YouTube ==================== */
// // oEmbed fallback khi getInfo fail
// async function getYouTubeOEmbed(yurl) {
//   const r = await axios.get('https://www.youtube.com/oembed', {
//     params: { url: yurl, format: 'json' },
//     headers: { 'User-Agent': UA },
//     timeout: 10000,
//   });
//   return r.data; // { title, author_name, thumbnail_url, ... }
// }

// async function getYouTubeMeta(yurl) {
//   try {
//     const info = await ytdl.getInfo(yurl, {
//       requestOptions: { headers: { 'User-Agent': UA } },
//     });
//     const v = info.videoDetails;
//     const thumb = (v.thumbnails || []).slice(-1)[0]?.url;
//     return {
//       platform: 'youtube',
//       title: v.title || 'youtube_video',
//       author: v.author?.name || 'channel',
//       duration: Number(v.lengthSeconds || 0),
//       thumbnail: thumb || null,
//     };
//   } catch (_) {
//     const e = await getYouTubeOEmbed(yurl);
//     return {
//       platform: 'youtube',
//       title: e.title || 'youtube_video',
//       author: e.author_name || 'channel',
//       duration: null,
//       thumbnail: e.thumbnail_url || null,
//     };
//   }
// }

// /* ==================== Instagram (public) ==================== */
// async function getInstagramMeta(iurl) {
//   // 1) Thử lib instagram-url-direct (CJS-safe)
//   try {
//     const igMod = require('instagram-url-direct');
//     const instagramGetUrl = typeof igMod === 'function' ? igMod : igMod?.default;
//     if (typeof instagramGetUrl === 'function') {
//       const results = await instagramGetUrl(iurl); // [{url,type,width,height},...]
//       const best = (results || [])
//         .filter((x) => x?.url && /mp4/i.test(x.url))
//         .sort((a, b) => (b?.width || 0) - (a?.width || 0))[0];
//       if (best?.url) {
//         return {
//           platform: 'instagram',
//           title: 'instagram_video',
//           author: 'instagram',
//           duration: null,
//           thumbnail: null,
//           video: best.url,
//         };
//       }
//     }
//   } catch (_) {
//     // bỏ qua, fallback HTML
//   }

//   // 2) Fallback: parse HTML (reel PUBLIC)
//   const r = await axios.get(iurl, {
//     headers: {
//       'User-Agent': MOBILE_UA,
//       'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
//       Referer: 'https://www.instagram.com/',
//     },
//     timeout: 20000,
//   });
//   const html = r.data || '';

//   // "video_url":"...mp4..."  hoặc  "video_versions":[{"url":"...mp4..."}]
//   const videoMatch =
//     html.match(/"video_url":"([^"]+\.mp4[^"]*)"/) ||
//     html.match(/"video_versions"\s*:\s*\[\s*{[^}]*"url":"([^"]+\.mp4[^"]*)"/i);

//   const thumbMatch =
//     html.match(/"display_url":"([^"]+)"/) ||
//     html.match(/property="og:image"\s+content="([^"]+)"/i);

//   const video = videoMatch ? decodeIgUrl(videoMatch[1]) : null;
//   const thumbnail = thumbMatch ? decodeIgUrl(thumbMatch[1]) : null;

//   if (!video) {
//     throw new Error('Không lấy được link video Instagram (có thể riêng tư/ép đăng nhập).');
//   }

//   return {
//     platform: 'instagram',
//     title: 'instagram_video',
//     author: 'instagram',
//     duration: null,
//     thumbnail,
//     video,
//   };
// }

// /* ==================== Facebook (public) ==================== */
// async function getFacebookMeta(fbUrl) {
//   // Ưu tiên: mbasic redirect
//   const id = extractFacebookId(fbUrl);
//   const candidates = id
//     ? [
//         `https://mbasic.facebook.com/reel/${id}/`,
//         `https://mbasic.facebook.com/watch/?v=${id}`,
//         `https://mbasic.facebook.com/video.php?v=${id}`,
//       ]
//     : [fbUrl.replace('://www.', '://mbasic.').replace('://m.', '://mbasic.')];

//   for (const page of candidates) {
//     try {
//       const r = await axios.get(page, {
//         headers: {
//           'User-Agent': MOBILE_UA,
//           'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
//           Referer: 'https://mbasic.facebook.com/',
//         },
//         timeout: 20000,
//       });
//       const html = r.data || '';

//       if (/you must log in|login|Đăng nhập/i.test(html) && !/video_redirect/.test(html)) {
//         continue; // riêng tư/nhóm → thử fallback
//       }

//       const links = [];
//       const re = /href="\/video_redirect\/\?src=([^"]+)"/g;
//       let m;
//       while ((m = re.exec(html)) !== null) {
//         links.push(decodeURIComponent(htmlDecode(m[1])));
//       }
//       if (links.length) {
//         const thumb =
//           (html.match(/property="og:image" content="([^"]+)"/i) || [])[1] || null;
//         const title =
//           htmlDecode((html.match(/<title>([^<]+)<\/title>/i) || [])[1] || 'facebook_video');

//         return {
//           platform: 'facebook',
//           title,
//           author: 'facebook',
//           duration: null,
//           thumbnail: thumb,
//           video: links[0],
//           alt: links,
//         };
//       }
//     } catch (_) {
//       // thử candidate kế tiếp
//     }
//   }

//   // Fallback: SnapSave
//   try {
//     const endpoint = 'https://snapsave.app/api/ajaxSearch';
//     const body = `q=${encodeURIComponent(fbUrl)}&lang=en`;
//     const rr = await axios.post(endpoint, body, {
//       headers: {
//         'User-Agent': UA,
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         'X-Requested-With': 'XMLHttpRequest',
//         Origin: 'https://snapsave.app',
//         Referer: 'https://snapsave.app/',
//       },
//       timeout: 20000,
//     });
//     const html2 = rr?.data?.data || '';
//     const urls = [];
//     const reg = /href="(https?:\/\/[^"]+\.mp4[^"]*)"/g;
//     let mm;
//     while ((mm = reg.exec(html2)) !== null) urls.push(htmlDecode(mm[1]));
//     if (urls.length) {
//       return {
//         platform: 'facebook',
//         title: 'facebook_video',
//         author: 'facebook',
//         duration: null,
//         thumbnail: null,
//         video: urls[0],
//         alt: urls,
//       };
//     }
//   } catch (_) {}

//   throw new Error('Không lấy được link Facebook. Video có thể riêng tư hoặc bị chặn khu vực.');
// }

// /* ==================== Proxy / FFMPEG ==================== */
// async function proxyRemoteFile(res, url, filename, mime) {
//   res.setHeader('Content-Type', mime);
//   res.setHeader('Content-Disposition', buildContentDisposition(filename));
//   const streamRes = await axios.get(url, {
//     responseType: 'stream',
//     headers: COMMON_HEADERS,
//     timeout: 30000,
//   });
//   streamRes.data.pipe(res);
// }

// /* ==================== /info ==================== */
// router.get('/info', async (req, res) => {
//   try {
//     const { url } = req.query;
//     if (!url) throw new Error('Thiếu tham số url.');
//     const pf = detectPlatform(url);
//     if (!pf) throw new Error('Nền tảng chưa hỗ trợ URL này.');

//     let meta;
//     if (pf === 'tiktok') meta = await getTikTokMeta(url);
//     else if (pf === 'youtube') meta = await getYouTubeMeta(url);
//     else if (pf === 'instagram') meta = await getInstagramMeta(url);
//     else if (pf === 'facebook') meta = await getFacebookMeta(url);

//     res.json({ ok: true, data: meta });
//   } catch (e) {
//     res.status(400).json({ ok: false, message: e.message || 'Lỗi không xác định' });
//   }
// });

// /* ==================== /download ====================
//  * query: url=... & type=video|audio
//  * ================================================ */
// router.get('/download', async (req, res) => {
//   try {
//     const { url, type = 'video' } = req.query;
//     if (!url) throw new Error('Thiếu tham số url.');
//     const pf = detectPlatform(url);
//     if (!pf) throw new Error('Nền tảng chưa hỗ trợ.');

//     const safeBase = (txt) => (txt || 'video').toString().slice(0, 120);

//     if (pf === 'tiktok') {
//       const meta = await getTikTokMeta(url);
//       const base = safeBase(`${meta.author}-${meta.title}`);

//       if (type === 'audio') {
//         if (meta.music) {
//           return proxyRemoteFile(res, meta.music, `${base}.mp3`, 'audio/mpeg');
//         }
//         if (!meta.video) throw new Error('Không có nguồn video để tách audio.');
//         res.setHeader('Content-Type', 'audio/mpeg');
//         res.setHeader('Content-Disposition', buildContentDisposition(`${base}.mp3`));
//         return ffmpeg(meta.video)
//           .addOptions(['-vn'])
//           .audioCodec('libmp3lame')
//           .audioBitrate('192k')
//           .format('mp3')
//           .on('error', () => {
//             if (!res.headersSent) res.status(500).end('Không tách được audio.');
//           })
//           .pipe(res, { end: true });
//       }

//       if (!meta.video) throw new Error('Không tìm thấy link MP4 không logo.');
//       return proxyRemoteFile(res, meta.video, `${base}.mp4`, 'video/mp4');
//     }

//     if (pf === 'youtube') {
//       // Lấy metadata nhẹ để đặt tên file
//       let base = 'youtube_video';
//       try {
//         const info = await getYouTubeMeta(url);
//         base = safeBase(`${info.author}-${info.title}`);
//       } catch (_) {}

//       if (type === 'audio') {
//         res.setHeader('Content-Type', 'audio/mpeg');
//         res.setHeader('Content-Disposition', buildContentDisposition(`${base}.mp3`));
//         const audio = ytdl(url, {
//           filter: 'audioonly',
//           quality: 'highestaudio',
//           requestOptions: { headers: { 'User-Agent': UA } },
//         });
//         return ffmpeg(audio)
//           .audioCodec('libmp3lame')
//           .audioBitrate('192k')
//           .format('mp3')
//           .on('error', () => {
//             if (!res.headersSent) res.status(500).end('Không tách được audio.');
//           })
//           .pipe(res, { end: true });
//       }

//       // Video: ưu tiên mp4 progressive; nếu không có → highest (có thể là webm)
//       let fileExt = 'mp4';
//       let contentType = 'video/mp4';
//       let stream;

//       try {
//         const info = await ytdl.getInfo(url, {
//           requestOptions: { headers: { 'User-Agent': UA } },
//         });
//         const mp4 = ytdl.chooseFormat(info.formats, (f) => f.container === 'mp4' && f.hasAudio && f.hasVideo);
//         if (mp4) {
//           stream = ytdl.downloadFromInfo(info, { format: mp4, requestOptions: { headers: { 'User-Agent': UA } } });
//           fileExt = 'mp4';
//           contentType = 'video/mp4';
//         } else {
//           // fallback
//           const both = info.formats.find((f) => f.hasAudio && f.hasVideo);
//           fileExt = both?.container || 'mp4';
//           contentType = fileExt === 'webm' ? 'video/webm' : 'application/octet-stream';
//           stream = ytdl(url, {
//             requestOptions: { headers: { 'User-Agent': UA } },
//             quality: 'highest',
//             filter: 'audioandvideo',
//           });
//         }
//       } catch (_) {
//         // fallback tuyệt đối
//         fileExt = 'mp4';
//         contentType = 'application/octet-stream';
//         stream = ytdl(url, {
//           requestOptions: { headers: { 'User-Agent': UA } },
//           quality: 'highest',
//           filter: 'audioandvideo',
//         });
//       }

//       res.setHeader('Content-Type', contentType);
//       res.setHeader('Content-Disposition', buildContentDisposition(`${base}.${fileExt}`));
//       return stream.pipe(res);
//     }

//     if (pf === 'instagram') {
//       const meta = await getInstagramMeta(url);
//       const base = safeBase(`${meta.author}-${meta.title}`);

//       if (type === 'audio') {
//         if (!meta.video) throw new Error('Không có nguồn video để tách audio.');
//         res.setHeader('Content-Type', 'audio/mpeg');
//         res.setHeader('Content-Disposition', buildContentDisposition(`${base}.mp3`));
//         return ffmpeg(meta.video)
//           .addOptions(['-vn'])
//           .audioCodec('libmp3lame')
//           .audioBitrate('192k')
//           .format('mp3')
//           .on('error', () => {
//             if (!res.headersSent) res.status(500).end('Không tách được audio.');
//           })
//           .pipe(res, { end: true });
//       }

//       if (!meta.video) throw new Error('Không lấy được link video Instagram.');
//       return proxyRemoteFile(res, meta.video, `${base}.mp4`, 'video/mp4');
//     }

//     if (pf === 'facebook') {
//       const meta = await getFacebookMeta(url);
//       const base = safeBase(`${meta.author}-${meta.title}`);

//       if (type === 'audio') {
//         if (!meta.video) throw new Error('Không có nguồn video để tách audio.');
//         res.setHeader('Content-Type', 'audio/mpeg');
//         res.setHeader('Content-Disposition', buildContentDisposition(`${base}.mp3`));
//         return ffmpeg(meta.video)
//           .addOptions(['-vn'])
//           .audioCodec('libmp3lame')
//           .audioBitrate('192k')
//           .format('mp3')
//           .on('error', () => {
//             if (!res.headersSent) res.status(500).end('Không tách được audio.');
//           })
//           .pipe(res, { end: true });
//       }

//       return proxyRemoteFile(res, meta.video, `${base}.mp4`, 'video/mp4');
//     }

//     throw new Error('Nền tảng chưa hỗ trợ.');
//   } catch (e) {
//     console.error(e);
//     if (!res.headersSent) {
//       res.status(400).json({ ok: false, message: e.message || 'Tải thất bại' });
//     }
//   }
// });

// module.exports = router;
