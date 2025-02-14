// components/CharacteristicsSection.tsx
import React, { useState } from 'react';
import { Button, Text, Heading, Input, Label, FocusModal } from "@medusajs/ui";
import { Trash } from '@medusajs/icons';
import type { TableData } from '../types';

interface CharacteristicsSectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
}

export const CharacteristicsSection: React.FC<CharacteristicsSectionProps> = ({ tableData, updateTable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newCharacteristic, setNewCharacteristic] = useState({ label: '', value: '' });

  const handleSave = async () => {
    if (!newCharacteristic.label || !newCharacteristic.value) return;

    let updatedCharacteristics;
    if (editIndex !== null) {
      updatedCharacteristics = [...tableData.characteristics];
      updatedCharacteristics[editIndex] = newCharacteristic;
    } else {
      updatedCharacteristics = [...tableData.characteristics, newCharacteristic];
    }

    if (await updateTable({ characteristics: updatedCharacteristics })) {
      setIsModalOpen(false);
      setNewCharacteristic({ label: '', value: '' });
      setEditIndex(null);
    }
  };

  const handleDelete = async (index: number) => {
    const updated = tableData.characteristics.filter((_, i) => i !== index);
    await updateTable({ characteristics: updated });
  };

  return (
    <>
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">Product Characteristics</Heading>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                setEditIndex(null);
                setNewCharacteristic({ label: '', value: '' });
                setIsModalOpen(true);
              }}
            >
              Add Characteristic
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {tableData.characteristics.map((char, index) => (
              <div key={index} className="flex flex-col">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text size="base" className="text-gray-600">{char.label}</Text>
                      <Text size="base" className="mt-2">{char.value}</Text>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setEditIndex(index);
                          setNewCharacteristic(char);
                          setIsModalOpen(true);
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!newCharacteristic.label || !newCharacteristic.value}
            >
              {editIndex !== null ? 'Save Changes' : 'Add Characteristic'}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>{editIndex !== null ? 'Edit Characteristic' : 'Add New Characteristic'}</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="char_label" className="text-ui-fg-subtle">
                  Label
                </Label>
                <Input
                  id="char_label"
                  placeholder="e.g., Molecular Formula"
                  value={newCharacteristic.label}
                  onChange={(e) => setNewCharacteristic(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="char_value" className="text-ui-fg-subtle">
                  Value
                </Label>
                <Input
                  id="char_value"
                  placeholder="e.g., C14H22N4O9"
                  value={newCharacteristic.value}
                  onChange={(e) => setNewCharacteristic(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};