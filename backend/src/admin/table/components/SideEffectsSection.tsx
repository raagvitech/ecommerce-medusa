import React, { useState } from 'react';
import { Button, Text, Heading, Input, Label, FocusModal } from "@medusajs/ui";
import { Trash, Plus } from '@medusajs/icons';
import type { TableData } from '../types';

interface SideEffectsSectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
}

export const SideEffectsSection: React.FC<SideEffectsSectionProps> = ({ tableData, updateTable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newSideEffect, setNewSideEffect] = useState("");

  const handleAdd = async () => {
    if (!newSideEffect) return;
    
    const updatedSideEffects = [...tableData.sideEffects, { description: newSideEffect }];
    if (await updateTable({ sideEffects: updatedSideEffects })) {
      setNewSideEffect("");
    }
  };

  const handleEdit = async () => {
    if (editingIndex === null || !editingText) return;
    
    const updatedSideEffects = [...tableData.sideEffects];
    updatedSideEffects[editingIndex].description = editingText;

    if (await updateTable({ sideEffects: updatedSideEffects })) {
      setIsEditing(false);
      setEditingIndex(null);
      setEditingText("");
    }
  };

  const handleDelete = async (index: number) => {
    const updated = tableData.sideEffects.filter((_, i) => i !== index);
    await updateTable({ sideEffects: updated });
  };

  return (
    <>
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <Heading level="h2">Side Effects</Heading>
        </div>
        <div className="p-4">
          <div className="space-y-4 mb-4">
            {tableData.sideEffects.map((effect, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <Text>{effect.description}</Text>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditingText(effect.description);
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
              placeholder="Add new side effect..."
              value={newSideEffect}
              onChange={(e) => setNewSideEffect(e.target.value)}
            />
            <Button
              variant="primary"
              size="small"
              onClick={handleAdd}
              disabled={!newSideEffect}
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
                <Heading>Edit Side Effect</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-side-effect" className="text-ui-fg-subtle">
                  Side Effect Description
                </Label>
                <Input
                  id="edit-side-effect"
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