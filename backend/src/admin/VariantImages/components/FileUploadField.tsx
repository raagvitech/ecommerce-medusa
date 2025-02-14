import React, { useRef, useState } from 'react';
import { ArrowDownTray } from '@medusajs/icons';
import { clx } from '@medusajs/ui';

type FileUploadFieldProps = {
  onFileChosen: (files: File[]) => void;
  filetypes: string[];
  errorMessage?: string;
  placeholder?: React.ReactElement | string;
  className?: string;
  multiple?: boolean;
  text?: React.ReactElement | string;
};

const defaultText = (
  <>
    <ArrowDownTray />
    <p className='font-normal font-sans txt-medium'>Upload Images</p>
  </>
);

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onFileChosen,
  filetypes,
  errorMessage,
  className,
  text = defaultText,
  placeholder = '',
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUploadError, setFileUploadError] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList) {
      onFileChosen(Array.from(fileList));
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setFileUploadError(false);

    e.preventDefault();

    const files: File[] = [];

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file && filetypes.indexOf(file.type) > -1) {
            files.push(file);
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
          files.push(e.dataTransfer.files[i]);
        }
      }
    }
    if (files.length === 1) {
      onFileChosen(files);
    } else {
      setFileUploadError(true);
    }
  };

  return (
    <div
      role='button'
      onClick={() => inputRef?.current?.click()}
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
      className={clx(
        'bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full flex-col items-center gap-y-2 rounded-lg border border-dashed p-8 hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus outline-none focus:border-solid',
        className
      )}
    >
      <div className='text-ui-fg-subtle group-disabled:text-ui-fg-disabled flex items-center gap-x-2'>{text}</div>
      <p className='font-normal font-sans txt-compact-small text-ui-fg-muted group-disabled:text-ui-fg-disabled'>{placeholder}</p>
      {fileUploadError && <span className='text-rose-60'>{errorMessage || 'Please upload an image file'}</span>}
      <input ref={inputRef} accept={filetypes.join(', ')} multiple={multiple} type='file' onChange={handleFileUpload} className='hidden' />
    </div>
  );
};

export default FileUploadField;
