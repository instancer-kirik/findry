
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures the required storage bucket exists
 * @param bucketName The name of the bucket to check/create
 * @returns A promise that resolves when the bucket exists
 */
export const ensureBucketExists = async (bucketName: string): Promise<void> => {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make the bucket public
      });
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
        throw error;
      }
      
      console.log(`Created bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    // We'll continue even if this fails, as the bucket might already exist
    // but the user might not have permission to list buckets
  }
};

/**
 * Uploads a file to a storage bucket
 * @param bucketName The name of the bucket to upload to
 * @param filePath The path to store the file at
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<string> => {
  // Ensure the bucket exists before uploading
  await ensureBucketExists(bucketName);
  
  // Upload the file
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      upsert: true,
    });
  
  if (error) {
    console.error(`Error uploading file to ${bucketName}/${filePath}:`, error);
    throw error;
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return publicUrl;
};
