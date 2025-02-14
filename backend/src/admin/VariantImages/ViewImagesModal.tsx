import { Button, Drawer, Heading } from '@medusajs/ui';
import { Image, VariantImage } from '../widgets/VariantsImagesWidget';

export default function ViewImagesModal({ variantThumbnail, variantImages }: { variantThumbnail: string | undefined; variantImages: VariantImage[] }) {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <button className='absolute top-0 left-0 w-full h-full rounded-md bg-neutral-900 bg-opacity-80 flex justify-center items-center duration-300 hover:border hover:border-ui-border-strong hover:bg-opacity-90'>
          <p className='text-sm'>+{variantImages.length - 2} more</p>
        </button>
      </Drawer.Trigger>
      <Drawer.Content aria-describedby={undefined}>
        <Drawer.Header>
          <Drawer.Title>View Variant Images</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className='divide-y p-0 overflow-y-auto no-scrollbar'>
          <div className='px-6 py-4 flex flex-col gap-y-2'>
            <Heading level='h3'>Thumbnail</Heading>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(125px,1fr))] gap-3'>
              {variantThumbnail ? (
                <Image image={{ url: variantThumbnail }} />
              ) : (
                <div className='w-full h-full aspect-square break-words text-ui-fg-muted text-[14px] text-center border rounded-md border-ui-border-strong border-dashed p-[15%] flex justify-center items-center'>
                  No thumbnail
                </div>
              )}
            </div>
          </div>
          <div className='px-6 py-4 flex flex-col gap-y-2'>
            <Heading level='h3'>
              Images <span className='text-ui-fg-muted text-sm'>({variantImages.length})</span>
            </Heading>
            <div className='grid h-fit auto-rows-auto grid-cols-[repeat(auto-fill,minmax(125px,1fr))] gap-3'>
              {variantImages.map((image, i) => (
                <Image key={i} image={image} />
              ))}
            </div>
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
