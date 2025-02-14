import React, { useState } from 'react';
import { Button, Text, Heading, Textarea } from "@medusajs/ui";
import { Trash } from '@medusajs/icons';
import type { TableData } from '../types';

interface SummarySectionProps {
  tableData: TableData;
  updateTable: (data: Partial<TableData>) => Promise<boolean>;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ tableData, updateTable }) => {
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [localSummary, setLocalSummary] = useState(tableData.summary);

  const handleSave = async () => {
    if (await updateTable({ summary: localSummary })) {
      setIsEditingSummary(false);
    }
  };

  return (
    <div className="rounded-lg border mb-8">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <Heading level="h2">Product Summary</Heading>
          <div className="flex gap-2">
            {isEditingSummary ? (
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
                    setIsEditingSummary(false);
                    setLocalSummary(tableData.summary);
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
                  onClick={() => setIsEditingSummary(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => updateTable({ summary: '' })}
                >
                  <Trash />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        {isEditingSummary ? (
          <Textarea 
            rows={4}
            value={localSummary}
            onChange={(e) => setLocalSummary(e.target.value)}
          />
        ) : (
          <Text className="whitespace-pre-line">{tableData.summary || 'No summary provided'}</Text>
        )}
      </div>
    </div>
  );
};