// Web Worker for background image prefetching & off-thread bitmap decoding
self.onmessage = async (e) => {
  const { id, src } = e.data;
  try {
    const res = await fetch(src, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();

    // Verify and decode bitmap off the main UI thread
    if (typeof createImageBitmap === 'function') {
      const bmp = await createImageBitmap(blob);
      bmp.close(); // Clean up memory after successful decode validation
    }

    const objectUrl = URL.createObjectURL(blob);
    self.postMessage({ id, src, objectUrl, success: true });
  } catch {
    // Safe fallback to direct URL
    self.postMessage({ id, src, objectUrl: src, success: false });
  }
};
