'use client';

import { useFileUploader } from './useFileUploader';
import PreviewList from './PreviewList';

export default function Uploader() {
  const {
    previewUrls,
    fileUrl,
    isLoading,
    handleFileChange,
    startEdit,
    confirmEdit,
    cancelEdit,
    handleDeleteFile,
    handleDeleteAll,
    handleSubmit,
    setPreviewUrls,
  } = useFileUploader();

  return (
    <section className='flex flex-col items-center justify-between'>
      <form onSubmit={handleSubmit} className='border rounded-lg p-4'>
        <input
          type='file'
          name='file'
          multiple
          onChange={handleFileChange}
          accept='image/*'
          className='block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700 file:cursor-pointer focus:outline-none disabled:pointer-events-none disabled:opacity-60'
        />
        {previewUrls.length > 0 && (
          <PreviewList
            previewUrls={previewUrls}
            setPreviewUrls={setPreviewUrls}
            startEdit={startEdit}
            confirmEdit={confirmEdit}
            cancelEdit={cancelEdit}
            handleDeleteFile={handleDeleteFile}
            handleDeleteAll={handleDeleteAll}
          />
        )}
        <button
          type='submit'
          disabled={isLoading}
          className='bg-indigo-500 hover:bg-indigo-700 rounded-md py-2 px-4 mt-4 text-white w-full disabled:pointer-events-none disabled:opacity-60'
        >
          Upload
        </button>
      </form>
      {fileUrl && (
        <div className='whitespace-pre-wrap overflow-hidden grid place-items-center'>
          <code>{fileUrl}</code>
          <img src={fileUrl} alt='preview images' />
        </div>
      )}
    </section>
  );
}
