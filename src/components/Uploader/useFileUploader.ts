import { useState } from 'react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

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
          setPreviewUrls(previews);
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

  const confirmEdit = (index: number, newName: string) => {
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

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const result: { secure_url: string } = await response.json();
        if (!result) throw new Error('Failed to upload file');
        uploadedUrls.push(result.secure_url);
      }

      setFileUrls(uploadedUrls);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    files,
    previewUrls,
    fileUrls,
    isLoading,
    handleFileChange,
    startEdit,
    confirmEdit,
    cancelEdit,
    handleDeleteFile,
    handleDeleteAll,
    handleSubmit,
    setPreviewUrls,
  };
};
