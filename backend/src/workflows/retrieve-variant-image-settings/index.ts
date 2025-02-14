import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { retrieveSettingsStep } from './steps/retrieve-settings-step';

export type GetVariantImagesSettingsInput = {
  product_id: string;
};

export const retrieveVariantImagesSettingsWorkflow = createWorkflow('retrieve-variant-images-settings', (input: GetVariantImagesSettingsInput) => {
  const productSettings = retrieveSettingsStep(input);

  return new WorkflowResponse(productSettings);
});
