import { Button, clx, Drawer, Heading, Select, Switch } from '@medusajs/ui';
import { EllipsisHorizontal } from '@medusajs/icons';
import { WidgetSettings } from '../widgets/VariantsImagesWidget';
import { AdminProduct, AdminProductOption } from '@medusajs/framework/types';

export default function WidgetSettingsModal({
  settings,
  setSettings,
  product,
  options,
}: {
  settings: WidgetSettings;
  setSettings: React.Dispatch<React.SetStateAction<WidgetSettings>>;
  product: AdminProduct;
  options?: AdminProductOption[];
}) {
  const {
    baseOptionUpload: { enabled, option },
  } = settings;

  const handleCheckedChange = async (checked: boolean) => {
    await fetch(`/admin/variant-images-settings/${product.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base_option_enabled: checked,
      }),
    });

    setSettings((_curr) => ({
      ..._curr,
      baseOptionUpload: { ..._curr.baseOptionUpload, enabled: checked },
    }));
  };

  const handleOptionChange = async (option_id: string) => {
    await fetch(`/admin/variant-images-settings/${product.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base_option_enabled: true,
        base_option_id: option_id,
      }),
    });

    setSettings((_curr) => ({
      ..._curr,
      baseOptionUpload: {
        ..._curr.baseOptionUpload,
        enabled: true,
        option: option_id,
      },
    }));
  };

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant='transparent' className='h-7 w-7 p-1 text-ui-fg-subtle'>
          <EllipsisHorizontal />
        </Button>
      </Drawer.Trigger>
      <Drawer.Content aria-describedby={undefined}>
        <Drawer.Header>
          <Drawer.Title>Variant Images Settings</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className='divide-y p-0 overflow-y-auto no-scrollbar'>
          <div className='px-6 py-4 flex flex-col gap-1'>
            <div className='flex flex-row justify-between items-center'>
              <Heading level='h3'>Upload by option</Heading>
              {!!settings.baseOptionUpload.option && (
                <>
                  <Switch id='enable-option-setting' checked={enabled} onCheckedChange={handleCheckedChange} />
                  <label htmlFor='enable-option-setting' className='sr-only'>
                    Enable/Disable base option
                  </label>
                </>
              )}
            </div>
            <p className='text-sm text-ui-fg-muted'>
              Instead of uploading images to each individual variant, upload to multiple using a base option. Each variant with the same option value will be
              updated.
            </p>

            <div>
              {!!settings.baseOptionUpload.option && (
                <label htmlFor='option-select' className='text-xs text-neutral-300 block mt-2'>
                  Select an option
                </label>
              )}
              <Select size='small' onValueChange={handleOptionChange} value={option}>
                <Select.Trigger id='option-select' className={clx('w-56 mt-2', !!settings.baseOptionUpload.option && 'mt-1')}>
                  <Select.Value placeholder='Select Option' />
                </Select.Trigger>
                <Select.Content>
                  {options?.map((item) => (
                    <Select.Item key={item.id} value={item.id}>
                      {item.title}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            {option && (
              <p className='text-xs text-ui-fg-muted font-semibold'>
                All variants with the same value for the <span className='text-ui-fg-interactive'>{options?.find((o) => o.id === option)?.title}</span> option
                will be updated simultaneously
              </p>
            )}
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button>Okay</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}
