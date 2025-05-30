# Meal Image Upload: Minimal Implementation Plan

1. **Supabase Storage Setup**
   - [x] Ensure a Supabase storage bucket exists for meal images. *(migration created)*

2. **Database Update**
   - [x] Add an `image_url` (or similar) column to the `meals` table to store the image path. *(migration created)*

3. **Backend/Types Update**
   - [x] Update TypeScript types to include the meal image URL. *(done)*

4. **Frontend: Meal Creation**
   - [x] Add a file input to the meal creation form for image upload.
   - [x] On form submission, upload the image to Supabase Storage and get its URL.
   - [x] Save the image URL with the new meal record.

5. **Frontend: Home Page**
   - [x] Display the meal image alongside meal details on the home page.

---

All tasks complete! See issue #5.
