import { fetchBackend } from './util';

export type FormImage = {
  url: string;
  name?: string;
  size?: number;
  nativeFile?: File;
};

const splitImages = (images: FormImage[]): { uploadImages: FormImage[]; existingImages: FormImage[] } => {
  const uploadImages: FormImage[] = [];
  const existingImages: FormImage[] = [];

  images.forEach((image) => {
    if (image.nativeFile) {
      uploadImages.push(image);
    } else {
      existingImages.push(image);
    }
  });

  return { uploadImages, existingImages };
};

export const prepareImages = async (images: FormImage[]) => {
  const { uploadImages, existingImages } = splitImages(images);

  let uploadedImgs: FormImage[] = [];
  if (uploadImages.length > 0) {
    const files = uploadImages.map((i) => i.nativeFile!);
    const form = new FormData();

    files.forEach((file) => {
      form.append('files', file, file.name);
    });

    const res = await fetchBackend('/admin/uploads', { body: form, method: 'POST', files: true }).catch((err: any) => console.log(err));

    if (res) uploadedImgs = res.files;
  }

  return [...existingImages, ...uploadedImgs];
};
