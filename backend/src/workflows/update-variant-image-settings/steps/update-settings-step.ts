import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { UpdateVariantImagesSettingsInput } from '..';
import VariantImagesSettingsService from '../../../modules/variant-images-settings/service';
import { VARIANT_IMAGES_SETTINGS_MODULE } from '../../../modules/variant-images-settings';

export const updateSettingsStep = createStep('update-settings-step', async (input: UpdateVariantImagesSettingsInput, { container }) => {
  const SettingsModule: VariantImagesSettingsService = container.resolve(VARIANT_IMAGES_SETTINGS_MODULE);

  let _productSettings = await SettingsModule.retrieveVariantImagesSettings(input.product_id).catch(() => undefined);

  if (!_productSettings) return new StepResponse(await SettingsModule.createVariantImagesSettings(input));

  return new StepResponse(await SettingsModule.updateVariantImagesSettings(input));
});
