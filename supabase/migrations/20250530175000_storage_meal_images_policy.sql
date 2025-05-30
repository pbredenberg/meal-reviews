-- Allow authenticated users to upload, read, update, and delete images in the meal-images bucket

-- INSERT
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'meal-images'
  );

-- SELECT
CREATE POLICY "Allow authenticated users to read images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'meal-images'
  );

-- UPDATE
CREATE POLICY "Allow authenticated users to update images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'meal-images'
  );

-- DELETE
CREATE POLICY "Allow authenticated users to delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'meal-images'
  );
