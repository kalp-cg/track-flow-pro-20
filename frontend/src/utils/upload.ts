export type ProgressCallback = (uploaded: number, total: number) => void;

export const uploadFile = async (
  file: File,
  uploadUrl: string,
  onProgress?: ProgressCallback
): Promise<{ url: string }> => {
  // Simple fetch upload with progress via XMLHttpRequest to allow progress events
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(e.loaded, e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve({ url: uploadUrl });
      else reject(new Error('Upload failed'));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(file);
  });
};
