import { model } from '@medusajs/framework/utils';

const VariantImagesSettings = model.define('variant_images_settings', {
  product_id: model.id().primaryKey(),
  base_option_enabled: model.boolean().default(false),
  base_option_id: model.text().nullable(),
});

export default VariantImagesSettings;
