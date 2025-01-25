import { useState } from 'react';
import CopyButton from './CopyButton';
import { getFileName } from '@/utils/getFilenameFromUrl';

function UploadResult({ fileUrls }: { fileUrls: string[] }) {
  const [copied, setCopied] = useState(false);

  const convertToHtml = (url: string) =>
    `<img src="${url}" alt="${getFileName(url)}" />`;
  const convertToMarkdown = (url: string) => `![${getFileName(url)}](${url})`;

  return (
    <div className='grid grid-cols-2 gap-4 w-full mt-4'>
      {fileUrls.map((url) => (
        <div
          className='whitespace-pre-wrap overflow-hidden grid place-items-center p-4'
          key={url}
        >
          <img
            src={url}
            alt='preview images'
            className='object-contain w-full h-full max-h-[300px] mt-2'
          />
          <div className='space-y-4'>
            <div className='flex flex-col items-center gap-2 bg-gray-50 p-3 rounded-lg'>
              <p className='break-all text-xs'>{url}</p>
              <div className='flex items-center gap-2'>
                <CopyButton text={url} onCopy={() => setCopied(true)}>
                  <span className='text-sm font-medium text-gray-700 mb-2 bg-red-100 px-2 py-1 rounded inline-block hover:bg-red-200'>
                    URL
                  </span>
                </CopyButton>
                <CopyButton
                  text={convertToHtml(url)}
                  onCopy={() => setCopied(true)}
                >
                  <span className='text-sm font-medium text-gray-700 mb-2 bg-blue-100 px-2 py-1 rounded inline-block hover:bg-blue-200'>
                    HTML
                  </span>
                </CopyButton>
                <CopyButton
                  text={convertToMarkdown(url)}
                  onCopy={() => setCopied(true)}
                >
                  <span className='text-sm font-medium text-gray-700 mb-2 bg-green-100 px-2 py-1 rounded inline-block'>
                    Markdown
                  </span>
                </CopyButton>
              </div>
              {copied && <span className='text-lg'>Copied!</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UploadResult;
