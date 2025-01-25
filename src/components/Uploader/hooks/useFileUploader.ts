import { useState } from 'react';
import { UPLOAD_TIMEOUT } from '@/app/constants/time';
import { MAX_FILE_SIZE } from '@/app/constants/size';

export type PreviewUrl = {
  url: string;
  name: string;
  isEditing: boolean;
  originalName: string;
};

export const useFileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<PreviewUrl[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const checkOverSizeFile = (files: File[]) => {
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert('Files cannot exceed 10MB in size.');
      return true;
    }
    return false;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsUploaded(false);

    const selectedFiles = Array.from(e.target.files);

    if (checkOverSizeFile(selectedFiles)) {
      e.target.value = '';
      return;
    }

    // Merge newly selected files with existing files if any
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const previews: PreviewUrl[] = [];
    selectedFiles.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        previews.push({
          url: fileReader.result as string,
          name: file.name,
          originalName: file.name,
          isEditing: false,
        });
        if (previews.length === selectedFiles.length) {
          // Merge newly selected files with existing files if any
          setPreviewUrls((prevPreviewUrls) => [
            ...prevPreviewUrls,
            ...previews,
          ]);
        }
      };
      fileReader.readAsDataURL(file);
    });
  };

  const startEdit = (index: number) => {
    setPreviewUrls(
      previewUrls.map((preview, i) =>
        i === index ? { ...preview, isEditing: true } : preview
      )
    );
  };

  const checkDuplicateFileName = (currentIndex: number, newName: string) => {
    for (let i = 0; i < previewUrls.length; i++) {
      if (i === currentIndex) continue;
      if (previewUrls[i].name === newName) return true;
    }
    return false;
  };

  const checkValidFileName = (newName: string) => {
    const publicIdRegex =
      /^[^\/\s?&\\#%<>+][a-zA-Z0-9\u0080-\uFFFF._/-]{0,30}[^\/\s?&\\#%<>+]$/;
    const nameWithoutExt = newName.split('.')[0];
    return publicIdRegex.test(nameWithoutExt);
  };

  const confirmEdit = (index: number, newName: string) => {
    if (!checkValidFileName(newName)) {
      alert('Invalid file name. Please enter a valid file name. ');
      return;
    }

    if (checkDuplicateFileName(index, newName)) {
      alert('This file name already exists. Please enter a different name.');
      return;
    }

    setPreviewUrls(
      previewUrls.map((preview, i) =>
        i === index
          ? {
              ...preview,
              name: newName,
              isEditing: false,
              originalName: newName,
            }
          : preview
      )
    );
  };

  const cancelEdit = (index: number) => {
    setPreviewUrls(
      previewUrls.map((preview, i) =>
        i === index
          ? { ...preview, name: preview.originalName, isEditing: false }
          : preview
      )
    );
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleDeleteAll = () => {
    setFiles([]);
    setPreviewUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (files.length === 0) throw new Error('No files selected');
      setIsLoading(true);

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('filename', previewUrls[i].name);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          const result: { secure_url: string } = await response.json();
          if (!result) throw new Error('Failed to upload file');
          uploadedUrls.push(result.secure_url);
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              alert('Upload timeout exceeded. Please try again.');
              throw new Error('Upload Timeout');
            }
            throw error;
          }
        }
      }

      setFileUrls(uploadedUrls);
      setIsUploaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFiles = () => {
    window.location.reload();
  };

  return {
    files,
    previewUrls,
    fileUrls,
    isLoading,
    isUploaded,
    handleFileChange,
    startEdit,
    confirmEdit,
    cancelEdit,
    handleDeleteFile,
    handleDeleteAll,
    handleSubmit,
    setPreviewUrls,
    clearFiles,
  };
};
