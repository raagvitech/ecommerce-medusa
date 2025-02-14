import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { retrieveVariantImagesSettingsWorkflow } from '../../../../workflows/retrieve-variant-image-settings';
import { updateVariantImagesSettingsWorkflow } from '../../../../workflows/update-variant-image-settings';

type UpdateVariantImagesSettingsRequest = {
  base_option_enabled?: boolean;
  base_option_id?: string;
};

export const POST = async (req: MedusaRequest<UpdateVariantImagesSettingsRequest>, res: MedusaResponse) => {
  const product_id = req.params.id;

  const { result } = await updateVariantImagesSettingsWorkflow(req.scope).run({
    input: { product_id, ...req.body },
    throwOnError: false,
    logOnError: true,
  });

  res.json(result);
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const product_id = req.params.id;

  const { result } = await retrieveVariantImagesSettingsWorkflow(req.scope).run({
    input: { product_id },
    throwOnError: false,
    logOnError: true,
  });

  res.json(result);
};
