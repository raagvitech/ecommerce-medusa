// components/BenefitsSection.tsx
import React, { useState } from 'react';
import { Button, Text, Heading, Input, Label, FocusModal } from "@medusajs/ui";
import { Trash, Plus } from '@medusajs/icons';
import type { TableData } from '../types';

interface BenefitsSectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ tableData, updateTable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const handleAdd = async () => {
    if (!newBenefit) return;
    
    const updatedBenefits = [...tableData.benefits, { description: newBenefit }];
    if (await updateTable({ benefits: updatedBenefits })) {
      setNewBenefit("");
    }
  };

  const handleEdit = async () => {
    if (editingIndex === null || !editingText) return;
    
    const updatedBenefits = [...tableData.benefits];
    updatedBenefits[editingIndex].description = editingText;

    if (await updateTable({ benefits: updatedBenefits })) {
      setIsEditing(false);
      setEditingIndex(null);
      setEditingText("");
    }
  };

  const handleDelete = async (index: number) => {
    const updated = tableData.benefits.filter((_, i) => i !== index);
    await updateTable({ benefits: updated });
  };

  return (
    <>
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <Heading level="h2">Benefits</Heading>
        </div>
        <div className="p-4">
          <div className="space-y-4 mb-4">
            {tableData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <Text>{benefit.description}</Text>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditingText(benefit.description);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>
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
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add new benefit..."
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
            />
            <Button
              variant="primary"
              size="small"
              onClick={handleAdd}
              disabled={!newBenefit}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>

      <FocusModal open={isEditing} onOpenChange={setIsEditing}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleEdit}
              disabled={!editingText}
            >
              Save Changes
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Edit Benefit</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-benefit" className="text-ui-fg-subtle">
                  Benefit Description
                </Label>
                <Input
                  id="edit-benefit"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};