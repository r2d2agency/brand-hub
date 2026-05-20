-- Drop the old overly permissive select policy
DROP POLICY "Store facades are publicly accessible" ON storage.objects;

-- Create a more secure select policy that allows access to objects but doesn't encourage listing the whole bucket
CREATE POLICY "Store facades are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'store-facades');
