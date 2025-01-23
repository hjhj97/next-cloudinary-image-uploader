import type { PreviewUrl } from './hooks/useFileUploader';

type PreviewListProps = {
  previewUrls: PreviewUrl[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<PreviewUrl[]>>;
  startEdit: (index: number) => void;
  confirmEdit: (index: number, newName: string) => void;
  cancelEdit: (index: number) => void;
  handleDeleteFile: (index: number) => void;
  handleDeleteAll: () => void;
  isUploaded: boolean;
};

function PreviewList({
  previewUrls,
  setPreviewUrls,
  startEdit,
  confirmEdit,
  cancelEdit,
  handleDeleteFile,
  handleDeleteAll,
  isUploaded,
}: PreviewListProps) {
  const handleNameChange = (fileIndex: number, newValue: string) => {
    setPreviewUrls(
      previewUrls.map((url, i) =>
        i === fileIndex ? { ...url, name: newValue } : url
      )
    );
  };

  return (
    <div className='mt-4'>
      <div className='flex justify-between items-center mb-2'>
        <p className='text-sm text-gray-500'>Preview:</p>
        <button
          type='button'
          onClick={handleDeleteAll}
          className='text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:pointer-events-none disabled:opacity-60'
          disabled={isUploaded}
        >
          Delete All
        </button>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        {previewUrls.map((preview, index) => (
          <div key={preview.name} className='flex flex-col items-center'>
            <img
              src={preview.url}
              alt={`Preview ${index + 1}`}
              className='w-full rounded-lg mb-2'
            />
            <div className='flex items-center gap-2 w-full'>
              {preview.isEditing ? (
                <EditMode
                  preview={preview}
                  index={index}
                  handleNameChange={handleNameChange}
                  confirmEdit={confirmEdit}
                  cancelEdit={cancelEdit}
                />
              ) : (
                <PreviewMode
                  preview={preview}
                  index={index}
                  startEdit={startEdit}
                  handleDeleteFile={handleDeleteFile}
                  isUploaded={isUploaded}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type EditModeProps = {
  preview: PreviewUrl;
  index: number;
  handleNameChange: (index: number, newValue: string) => void;
  confirmEdit: (index: number, newName: string) => void;
  cancelEdit: (index: number) => void;
};

function EditMode({
  preview,
  index,
  handleNameChange,
  confirmEdit,
  cancelEdit,
}: EditModeProps) {
  return (
    <div className='flex items-center gap-1 w-full'>
      <input
        type='text'
        value={preview.name}
        onChange={(e) => handleNameChange(index, e.target.value)}
        className='text-sm p-1 border rounded flex-1'
        autoFocus
      />
      <button
        type='button'
        onClick={() => confirmEdit(index, preview.name)}
        className='text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded'
      >
        Confirm
      </button>
      <button
        type='button'
        onClick={() => cancelEdit(index)}
        className='text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded'
      >
        Cancel
      </button>
    </div>
  );
}

type PreviewModeProps = {
  preview: PreviewUrl;
  index: number;
  startEdit: (index: number) => void;
  handleDeleteFile: (index: number) => void;
  isUploaded: boolean;
};

function PreviewMode({
  preview,
  index,
  startEdit,
  handleDeleteFile,
  isUploaded,
}: PreviewModeProps) {
  return (
    <>
      <p className='text-sm text-gray-600 truncate flex-1'>{preview.name}</p>
      <button
        type='button'
        onClick={() => startEdit(index)}
        className='text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded disabled:pointer-events-none disabled:opacity-60'
        disabled={isUploaded}
      >
        Edit
      </button>
      <button
        type='button'
        onClick={() => handleDeleteFile(index)}
        className='text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded disabled:pointer-events-none disabled:opacity-60'
        disabled={isUploaded}
      >
        Delete
      </button>
    </>
  );
}

export default PreviewList;
