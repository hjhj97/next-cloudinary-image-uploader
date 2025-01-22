import { Dispatch, SetStateAction, useMemo } from 'react';
import type { PreviewUrl } from './hooks/useFileUploader';
import PreviewList from './PreviewList';

type UploadFormProps = {
  isUploaded: boolean;
  isLoading: boolean;
  previewUrls: PreviewUrl[];
  setPreviewUrls: Dispatch<SetStateAction<PreviewUrl[]>>;
  startEdit: (index: number) => void;
  confirmEdit: (index: number, newName: string) => void;
  cancelEdit: (index: number) => void;
  handleDeleteFile: (index: number) => void;
  handleDeleteAll: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function UploadForm({
  isUploaded,
  isLoading,
  previewUrls,
  handleFileChange,
  setPreviewUrls,
  startEdit,
  confirmEdit,
  cancelEdit,
  handleDeleteFile,
  handleDeleteAll,
  handleSubmit,
}: UploadFormProps) {
  const isUploadDisabled = useMemo(() => {
    return isLoading || previewUrls.length === 0 || isUploaded;
  }, [isLoading, previewUrls.length, isUploaded]);

  return (
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
          isUploaded={isUploaded}
        />
      )}
      <button
        type='submit'
        disabled={isUploadDisabled}
        className='bg-indigo-500 hover:bg-indigo-700 rounded-md py-2 px-4 mt-4 text-white w-full disabled:pointer-events-none disabled:opacity-60'
      >
        {isUploaded ? 'Uploaded!!' : 'Upload'}
      </button>
    </form>
  );
}

export default UploadForm;
