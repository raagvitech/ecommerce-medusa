// components/CertificatesSection.tsx
import React, { useState } from 'react';
import { Button, Text, Heading, Input, Label, FocusModal } from "@medusajs/ui";
import { Trash } from '@medusajs/icons';
import type { TableData } from '../types';
import type Medusa from "@medusajs/js-sdk";

interface CertificatesSectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
  sdk: Medusa;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ tableData, updateTable, sdk }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const filesArray = Array.from(uploadFile ? [uploadFile] : []);
      const { files } = await sdk.admin.upload.create({ files: filesArray });
      
      const newCert = {
        url: files[0].url,
        title: newCertTitle || uploadFile.name,
        uploadDate: new Date().toISOString()
      };

      const updatedCerts = [...tableData.certificates, newCert];
      
      if (await updateTable({ certificates: updatedCerts })) {
        setIsModalOpen(false);
        setNewCertTitle('');
        setUploadFile(null);
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const updated = tableData.certificates.filter((_, i) => i !== index);
    await updateTable({ certificates: updated });
  };

  return (
    <>
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">Certificates</Heading>
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsModalOpen(true)}
            >
              Upload Certificate
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {tableData.certificates.map((cert, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <Text size="base" className="font-medium">
                    {cert.title}
                  </Text>
                  <Text size="small" className="text-ui-fg-subtle">
                    Uploaded: {new Date(cert.uploadDate).toLocaleDateString()}
                  </Text>
                </div>
                <div className="flex gap-2">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="secondary"
                      size="small"
                    >
                      View
                    </Button>
                  </a>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}

            {tableData.certificates.length === 0 && (
              <Text className="text-ui-fg-subtle text-center py-4">
                No certificates uploaded yet
              </Text>
            )}
          </div>
        </div>
      </div>

      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={!uploadFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Certificate'}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Upload Certificate</Heading>
                <Text className="text-ui-fg-subtle">
                  Upload a certificate file (PDF, PNG, or JPG)
                </Text>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="cert_title" className="text-ui-fg-subtle">
                  Certificate Title
                </Label>
                <Input
                  id="cert_title"
                  placeholder="e.g., Certificate of Analysis"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="cert_file" className="text-ui-fg-subtle">
                  Certificate File
                </Label>
                <Input
                  id="cert_file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};