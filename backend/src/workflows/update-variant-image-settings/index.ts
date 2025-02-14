import {
  createWorkflow,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import { updateSettingsStep } from './steps/update-settings-step';

export type UpdateVariantImagesSettingsInput = {
  product_id: string;
  base_option_enabled?: boolean;
  base_option_id?: string;
};

export const updateVariantImagesSettingsWorkflow = createWorkflow(
  'update-variant-images-settings',
  (input: UpdateVariantImagesSettingsInput) => {
    const productSettings = updateSettingsStep(input);

    return new WorkflowResponse(productSettings);
  }
);
