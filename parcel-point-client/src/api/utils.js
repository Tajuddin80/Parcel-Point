import axios from 'axios';

export const imageUpload = async (imageData) => {
  const imageFormData = new FormData();
  imageFormData.append('image', imageData);

  try {
    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      imageFormData
    );

    // return the display URL
    return data?.data?.display_url;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
};
