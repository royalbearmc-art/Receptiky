import { supabase } from './supabase';

const BUCKET = 'recipe-photos';
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/**
 * Upload a JPEG image (given as a base64 data URL) to Supabase Storage
 * and return the public URL.
 *
 * Caller is expected to pass a JPEG produced by the crop step.
 */
export async function uploadRecipeImage(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Neplatný obrázok.');
  }

  const blob = await dataUrlToBlob(dataUrl);
  if (blob.size > MAX_BYTES) {
    throw new Error('Obrázok je príliš veľký (max 3 MB).');
  }

  const filename = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, blob, {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage given its public URL.
 * Best-effort: errors are swallowed so callers don't need to handle them.
 */
export async function deleteRecipeImage(publicUrl: string): Promise<void> {
  try {
    const marker = `/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = publicUrl.slice(idx + marker.length);
    if (!path) return;
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    /* ignore */
  }
}
