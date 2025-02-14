import { Module } from '@medusajs/framework/utils';
import VariantImagesSettingsService from './service';

export const VARIANT_IMAGES_SETTINGS_MODULE =
  'variant_images_settings';

export default Module(VARIANT_IMAGES_SETTINGS_MODULE, {
  service: VariantImagesSettingsService,
});
