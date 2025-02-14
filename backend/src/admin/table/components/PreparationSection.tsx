// components/PreparationSection.tsx
import React, { useState } from 'react';
import { Button, Text, Heading, Input, Label, FocusModal, Textarea } from "@medusajs/ui";
import { Trash, Plus } from '@medusajs/icons';
import type { TableData } from '../types';

interface PreparationSectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
}

export const PreparationSection: React.FC<PreparationSectionProps> = ({ tableData, updateTable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newPreparationStep, setNewPreparationStep] = useState({
    title: '',
    description: '',
    subSteps: [] as { title: string; description: string; }[]
  });

  const handleSave = async () => {
    if (!newPreparationStep.title) return;

    let updatedPreparation;
    if (editIndex !== null) {
      updatedPreparation = [...tableData.preparation];
      updatedPreparation[editIndex] = newPreparationStep;
    } else {
      updatedPreparation = [...tableData.preparation, newPreparationStep];
    }

    if (await updateTable({ preparation: updatedPreparation })) {
      setIsModalOpen(false);
      setNewPreparationStep({ title: '', description: '', subSteps: [] });
      setEditIndex(null);
    }
  };

  const handleDelete = async (index: number) => {
    const updated = tableData.preparation.filter((_, i) => i !== index);
    await updateTable({ preparation: updated });
  };

  const handleAddSubStep = () => {
    setNewPreparationStep(prev => ({
      ...prev,
      subSteps: [...prev.subSteps, { title: '', description: '' }]
    }));
  };

  const handleUpdateSubStep = (index: number, field: 'title' | 'description', value: string) => {
    setNewPreparationStep(prev => {
      const updatedSubSteps = [...prev.subSteps];
      updatedSubSteps[index] = { ...updatedSubSteps[index], [field]: value };
      return { ...prev, subSteps: updatedSubSteps };
    });
  };

  const handleRemoveSubStep = (index: number) => {
    setNewPreparationStep(prev => ({
      ...prev,
      subSteps: prev.subSteps.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">Preparation Steps</Heading>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                setEditIndex(null);
                setNewPreparationStep({ title: '', description: '', subSteps: [] });
                setIsModalOpen(true);
              }}
            >
              Add Step
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-6">
            {tableData.preparation.map((step, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Text size="base" className="font-medium">{step.title}</Text>
                    <Text size="base" className="mt-2">{step.description}</Text>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setEditIndex(index);
                        setNewPreparationStep(step);
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
                {step.subSteps.length > 0 && (
                  <div className="ml-6 space-y-3">
                    {step.subSteps.map((subStep, subIndex) => (
                      <div key={subIndex} className="border-l-2 pl-4">
                        <Text size="base" className="font-medium">{subStep.title}</Text>
                        <Text size="base" className="mt-1">{subStep.description}</Text>
                      </div>
                    ))}
                  </div>
                )}
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
              disabled={!newPreparationStep.title}
            >
              {editIndex !== null ? 'Save Changes' : 'Add Step'}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>{editIndex !== null ? 'Edit Step' : 'Add New Step'}</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="step_title" className="text-ui-fg-subtle">
                  Step Title
                </Label>
                <Input
                  id="step_title"
                  placeholder="Enter step title..."
                  value={newPreparationStep.title}
                  onChange={(e) => setNewPreparationStep(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="step_description" className="text-ui-fg-subtle">
                  Step Description
                </Label>
                <Textarea
                  id="step_description"
                  placeholder="Enter step description..."
                  value={newPreparationStep.description}
                  onChange={(e) => setNewPreparationStep(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="flex flex-col gap-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-ui-fg-subtle">Sub-steps</Label>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleAddSubStep}
                  >
                    Add Sub-step
                  </Button>
                </div>
                
                {newPreparationStep.subSteps.map((subStep, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Text size="base">Sub-step {index + 1}</Text>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleRemoveSubStep(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Input
                        placeholder="Sub-step title..."
                        value={subStep.title}
                        onChange={(e) => handleUpdateSubStep(index, 'title', e.target.value)}
                      />
                      <Textarea
                        placeholder="Sub-step description..."
                        value={subStep.description}
                        onChange={(e) => handleUpdateSubStep(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};