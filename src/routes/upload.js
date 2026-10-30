const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { supabaseAdmin } = require('../config/supabase');

// Ensure local uploads directory exists as a resilient offline/sandbox fallback
const localUploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

/**
 * POST /api/upload
 * Handles base64 media and document upload to Supabase Storage or local fallback
 */
router.post('/', async (req, res) => {
  try {
    const { filename, fileData, bucket = 'school-media', contentType = 'image/jpeg' } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'Missing fileData payload' });
    }

    // Strip base64 metadata header if present (data:image/png;base64,...)
    const base64Data = fileData.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const safeName = `${Date.now()}-${(filename || 'upload.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Attempt Supabase Storage Upload
    try {
      // 1. Ensure bucket exists
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets && buckets.some(b => b.name === bucket);
      if (!bucketExists) {
        await supabaseAdmin.storage.createBucket(bucket, { public: true });
      }

      // 2. Upload file buffer to Supabase
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(safeName, buffer, {
          contentType,
          upsert: true
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(safeName);
        return res.status(201).json({
          success: true,
          provider: 'supabase-storage',
          bucket,
          path: uploadData.path,
          url: publicUrlData.publicUrl,
          filename: safeName
        });
      } else if (uploadError) {
        console.warn('Supabase storage upload notice:', uploadError.message);
      }
    } catch (storageErr) {
      console.warn('Supabase storage exception, falling back to static storage:', storageErr.message);
    }

    // Resilient local fallback
    const localFilePath = path.join(localUploadsDir, safeName);
    fs.writeFileSync(localFilePath, buffer);
    const localUrl = `/uploads/${safeName}`;

    return res.status(201).json({
      success: true,
      provider: 'local-static',
      url: localUrl,
      filename: safeName
    });
  } catch (err) {
    console.error('File upload error:', err);
    return res.status(500).json({ error: 'Failed to process file upload' });
  }
});

module.exports = router;
