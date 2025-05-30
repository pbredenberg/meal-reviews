# Meal Image Upload: Minimal Implementation Plan

1. **Supabase Storage Setup**
   - [x] Ensure a Supabase storage bucket exists for meal images. *(migration created)*

2. **Database Update**
   - [x] Add an `image_url` (or similar) column to the `meals` table to store the image path. *(migration created)*

3. **Backend/Types Update**
   - [ ] Update TypeScript types to include the meal image URL. *(in progress)*

4. **Frontend: Meal Creation**
   - [ ] Add a file input to the meal creation form for image upload.
   - [ ] On form submission, upload the image to Supabase Storage and get its URL.
   - [ ] Save the image URL with the new meal record.

5. **Frontend: Home Page**
   - [ ] Display the meal image alongside meal details on the home page.
