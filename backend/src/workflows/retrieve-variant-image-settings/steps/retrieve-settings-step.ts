import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { GetVariantImagesSettingsInput } from '..';
import VariantImagesSettingsService from '../../../modules/variant-images-settings/service';
import { VARIANT_IMAGES_SETTINGS_MODULE } from '../../../modules/variant-images-settings';

export const retrieveSettingsStep = createStep('retrieve-settings-step', async (input: GetVariantImagesSettingsInput, { container }) => {
  const SettingsModule: VariantImagesSettingsService = container.resolve(VARIANT_IMAGES_SETTINGS_MODULE);

  let _productSettings = await SettingsModule.retrieveVariantImagesSettings(input.product_id).catch(() => undefined);

  return new StepResponse(_productSettings);
});
