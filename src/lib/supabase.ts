import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to get video URLs from Supabase storage
export async function getVideoUrls() {
  try {
    console.log('Attempting to fetch videos from Supabase storage');
    
    // Try to list all buckets first to see what's available
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      // Continue anyway, we'll try the default bucket
    } else {
      console.log('Available buckets:', buckets);
    }
    
    // Try multiple potential bucket names
    const potentialBuckets = ['videos', 'video', 'media', 'assets', 'public'];
    let videoFiles = [];
    
    // Try each potential bucket
    for (const bucket of potentialBuckets) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });
        
        if (!error && data && data.length > 0) {
          console.log(`Found files in bucket "${bucket}":`, data);
          
          // Filter for video files
          const videoData = data.filter(file => {
            const extension = file.name.split('.').pop()?.toLowerCase();
            return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension || '');
          });
          
          if (videoData.length > 0) {
            videoFiles = videoData.map(file => ({
              name: file.name,
              bucket: bucket,
              metadata: file.metadata
            }));
            break; // Exit the loop if we found videos
          }
        }
      } catch (bucketError) {
        console.log(`Bucket "${bucket}" not found or not accessible`);
      }
    }
    
    if (videoFiles.length === 0) {
      console.log('No videos found in any storage bucket');
      return [];
    }
    
    // Create public URLs for each video
    const videoUrls = videoFiles.map((file) => {
      // Get public URL directly
      const { data: publicUrlData } = supabase.storage
        .from(file.bucket)
        .getPublicUrl(file.name);
      
      console.log(`Generated URL for ${file.name}:`, publicUrlData?.publicUrl);
      
      return {
        name: file.name,
        url: publicUrlData?.publicUrl || '',
        thumbnailUrl: null,
        size: file.metadata?.size || 0,
        contentType: file.metadata?.mimetype || ''
      };
    });
    
    console.log('Processed video URLs:', videoUrls);
    return videoUrls.filter(video => video.url);
  } catch (error) {
    console.error('Error fetching videos from Supabase:', error);
    return [];
  }
}

// Use the provided video URLs
export async function getVideosFromDatabase() {
  console.log('Using provided video sources');
  
  // Return the provided security camera footage
  return [
    {
      name: 'Hall Crowd',
      url: 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/hall-crowd-02.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby9oYWxsLWNyb3dkLTAyLm1wNCIsImlhdCI6MTc0MDg5MDU3NCwiZXhwIjoxNzcyNDI2NTc0fQ.zQbH0QF6K8rZFhVPO19MD2kCReOd2P-tXX-ShlfpaNU',
      thumbnailUrl: null
    },
    {
      name: 'Entrance Video 1',
      url: 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/01%20-%20Made%20with%20Clipchamp.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby8wMSAtIE1hZGUgd2l0aCBDbGlwY2hhbXAubXA0IiwiaWF0IjoxNzQwODkwNjA3LCJleHAiOjE3NzI0MjY2MDd9.PA9_z9l57-ZR6nkcUPgxCx6MLEqbMfYu_KwK3QhRaks',
      thumbnailUrl: null
    },
    {
      name: 'Entrance Video 2',
      url: 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/02%20-%20Made%20with%20Clipchamp.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby8wMiAtIE1hZGUgd2l0aCBDbGlwY2hhbXAubXA0IiwiaWF0IjoxNzQwODkwNjI5LCJleHAiOjE3NzI0MjY2Mjl9.Q_nZET-a61QWm_12kskvG_4qisGQRjsp0eUm9fBEyVc',
      thumbnailUrl: null
    },
    {
      name: 'Discussion Space Cam 1',
      url: 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/videos/03.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby92aWRlb3MvMDMubXA0IiwiaWF0IjoxNzQwODkwNjYwLCJleHAiOjE3NzI0MjY2NjB9.6RkP3cRg5QzSo9SLDp4yIdudx4k3Dmx0-xxOxYcrwS0',
      thumbnailUrl: null
    },
    {
      name: 'Discussion Space Cam 2',
      url: 'https://bbsrdjhuyigynjezuvne.supabase.co/storage/v1/object/sign/video/videos/05.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlby92aWRlb3MvMDUubXA0IiwiaWF0IjoxNzQwODkwNjc5LCJleHAiOjE3NzI0MjY2Nzl9.YbBkD92-S6MfYyPwAxIocCAmIezGwxN3zyNU3v5_2AE',
      thumbnailUrl: null
    }
  ];
}