// components/ReferencesSection.tsx
import React, { useState } from 'react';
import { Button, Text, Heading, Input, Label, FocusModal } from "@medusajs/ui";
import { Trash } from '@medusajs/icons';
import type { TableData } from '../types';

interface ReferencesSectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({ tableData, updateTable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReference, setNewReference] = useState({ text: '', link: '' });

  const handleSave = async () => {
    if (!newReference.text || !newReference.link) return;
    
    const updatedReferences = [...tableData.references, newReference];
    if (await updateTable({ references: updatedReferences })) {
      setIsModalOpen(false);
      setNewReference({ text: '', link: '' });
    }
  };

  const handleDelete = async (index: number) => {
    const updated = tableData.references.filter((_, i) => i !== index);
    await updateTable({ references: updated });
  };

  return (
    <>
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">References</Heading>
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsModalOpen(true)}
            >
              Add Reference
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {tableData.references.map((ref, index) => (
              <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                <div>
                  <Text size="base" className="font-medium">
                    {ref.text}
                  </Text>
                  <a 
                    href={ref.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    {ref.link}
                  </a>
                </div>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(index)}
                >
                  <Trash />
                </Button>
              </div>
            ))}

            {tableData.references.length === 0 && (
              <Text className="text-ui-fg-subtle text-center py-4">
                No references added yet
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
              onClick={handleSave}
              disabled={!newReference.text || !newReference.link}
            >
              Add Reference
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Add New Reference</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="ref_text" className="text-ui-fg-subtle">
                  Reference Text
                </Label>
                <Input
                  id="ref_text"
                  placeholder="Enter reference text..."
                  value={newReference.text}
                  onChange={(e) => setNewReference(prev => ({ ...prev, text: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="ref_link" className="text-ui-fg-subtle">
                  Reference Link
                </Label>
                <Input
                  id="ref_link"
                  placeholder="Enter reference link..."
                  value={newReference.link}
                  onChange={(e) => setNewReference(prev => ({ ...prev, link: e.target.value }))}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};