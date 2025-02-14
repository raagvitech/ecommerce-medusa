import React, { useState } from 'react';
import { Button, Text, Heading, Textarea } from "@medusajs/ui";
import { Trash } from '@medusajs/icons';
import type { TableData } from '../types';

interface WorkingMechanismSectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
}

export const WorkingMechanismSection: React.FC<WorkingMechanismSectionProps> = ({ tableData, updateTable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localMechanism, setLocalMechanism] = useState(tableData.workingMechanism);

  const handleSave = async () => {
    if (await updateTable({ workingMechanism: localMechanism })) {
      setIsEditing(false);
    }
  };

  return (
    <div className="rounded-lg border mb-8">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <Heading level="h2">How does it work?</Heading>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => {
                    setIsEditing(false);
                    setLocalMechanism(tableData.workingMechanism);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => updateTable({ workingMechanism: '' })}
                >
                  <Trash />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        {isEditing ? (
          <Textarea 
            rows={4}
            value={localMechanism}
            onChange={(e) => setLocalMechanism(e.target.value)}
          />
        ) : (
          <Text className="whitespace-pre-line">
            {tableData.workingMechanism || 'No working mechanism provided'}
          </Text>
        )}
      </div>
    </div>
  );
};