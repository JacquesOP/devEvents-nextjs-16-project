/**
 * Uploads a binary buffer to Bunny storage and returns its CDN URL.
 *
 * @param file - Buffer containing the file data to upload
 * @param fileName - Name to store the file as in Bunny storage
 * @param folder - Optional folder path within the storage; when empty, the file is stored at the root
 * @returns The CDN URL for the uploaded file (concatenation of the configured CDN base and the storage path)
 * @throws Error if required environment variables are missing
 * @throws Error if the HTTP upload request fails (message includes the response status)
 */
export async function uploadToBunnyStorage(
   file: Buffer,
   fileName: string,
   folder: string = ''
): Promise<string> {
   const storageZone = process.env.BUNNY_STORAGE_ZONE;
   const apiKey = process.env.BUNNY_STORAGE_API_KEY;
   const cdnUrl = process.env.BUNNY_CDN_URL;
   const region = process.env.BUNNY_STORAGE_REGION || 'de';

   if (!storageZone) {
      throw new Error('BUNNY_STORAGE_ZONE environment variable is required');
   }

   if (!apiKey) {
      throw new Error('BUNNY_STORAGE_API_KEY environment variable is required');
   }

   if (!cdnUrl) {
      throw new Error('BUNNY_CDN_URL environment variable is required');
   }

   const path = folder ? `${folder}/${fileName}` : fileName;

   const baseUrl = region === 'de'
      ? 'https://storage.bunnycdn.com'
      : `https://${region}.storage.bunnycdn.com`;

   const response = await fetch(`${baseUrl}/${storageZone}/${path}`, {
      method: 'PUT',
      headers: {
         'AccessKey': apiKey,
         'Content-Type': 'application/octet-stream',
      },
      body: new Uint8Array(file),
   });

   if (!response.ok) {
      throw new Error(`Bunny upload failed: ${response.status}`);
   }

   return `${cdnUrl}/${path}`;
}