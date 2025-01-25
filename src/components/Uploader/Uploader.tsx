'use client';

import { useFileUploader } from './hooks/useFileUploader';
import UploadResult from './UploadResult';
import UploadForm from './UploadForm';

export default function Uploader() {
  const {
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
  } = useFileUploader();

  return (
    <section className='flex flex-col items-center justify-between'>
      <UploadForm
        isUploaded={isUploaded}
        isLoading={isLoading}
        previewUrls={previewUrls}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        setPreviewUrls={setPreviewUrls}
        startEdit={startEdit}
        confirmEdit={confirmEdit}
        cancelEdit={cancelEdit}
        handleDeleteFile={handleDeleteFile}
        handleDeleteAll={handleDeleteAll}
      />
      {isUploaded && (
        <UploadResult fileUrls={fileUrls} clearFiles={clearFiles} />
      )}
    </section>
  );
}
