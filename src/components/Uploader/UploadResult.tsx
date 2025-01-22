import CopyButton from './CopyButton';

function UploadResult({ fileUrls }: { fileUrls: string[] }) {
  return (
    <div className='grid grid-cols-2 gap-4 w-full mt-4'>
      {fileUrls.map((url) => (
        <div
          className='whitespace-pre-wrap overflow-hidden grid place-items-center p-4'
          key={url}
        >
          <div className='flex items-center gap-2 mb-2'>
            <code className='break-all text-xs'>{url}</code>
            <CopyButton text={url} />
          </div>
          <div className='flex items-center gap-2'>
            <code className='break-all text-xs'>![preview images]({url})</code>
            <CopyButton text={`![preview images](${url})`} />
          </div>
          <img
            src={url}
            alt='preview images'
            className='object-contain w-full h-full max-h-[300px] mt-2'
          />
        </div>
      ))}
    </div>
  );
}

export default UploadResult;
