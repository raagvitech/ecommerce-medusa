import { AdminProductVariant } from '@medusajs/framework/types';
import { ClientHeaders } from '@medusajs/js-sdk';
import { useMemo, useState } from 'react';

export const sortByCreatedAt = (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

export const sortByTitle = (a: any, b: any) => a.title.localeCompare(b.title);

export const paginationInformation = (variants: AdminProductVariant[] | null) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8; //* Number of variants on the page
  const pageCount = (variants?.length && Math.ceil(variants.length / pageSize)) || 0;

  const canNextPage = useMemo(() => currentPage < pageCount - 1, [currentPage, pageCount]);
  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage]);

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentVariants = useMemo(() => {
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, variants?.length || 0);

    return variants?.slice(offset, limit);
  }, [currentPage, pageSize, variants]);

  return {
    pageIndex: currentPage,
    pageSize,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    currentVariants,
  };
};

type OptionArgs = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: ClientHeaders;
  body?: RequestInit['body'] | Record<string, any>;
  files?: boolean;
};

export const fetchBackend = async (url: string, options: OptionArgs = {}) => {
  const optionsObj: RequestInit = {
    credentials: 'include',
    method: options.method || 'GET',
  };

  if (!options.files)
    optionsObj.headers = {
      'Content-Type': 'application/json',
    };

  if (options.body) {
    if (options.files) optionsObj.body = options.body as BodyInit;
    else optionsObj.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, optionsObj);

  const result = await res.json().catch(() => undefined);

  if (!result) return undefined;

  return result;
};

// const toBase64 = (file: File) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = () => resolve(reader.result);
//     reader.onerror = reject;
//   });

// export const sendFilesAsJson = async (files: File[]) => {
//   const filesObj = [];

//   for (const file of files) {
//     const content = await toBase64(file).catch((err) => {
//       console.error(err);
//       return undefined;
//     });

//     if (content)
//       filesObj.push({
//         name: file.name,
//         mimeType: file.type,
//         content,
//         access: 'public',
//       });
//   }

//   return filesObj;
// };
