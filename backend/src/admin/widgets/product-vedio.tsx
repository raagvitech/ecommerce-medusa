import { useState, useEffect } from 'react';
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import Medusa from "@medusajs/js-sdk";
import {
  Button,
  Container,
  Text,
  Heading,
  FocusModal,
  Input,
  Label,
} from "@medusajs/ui";

const sdk = new Medusa({
  baseUrl: "https://basic-medusa-production.up.railway.app",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
});

type Product = {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, any> | null;
};

type VideoData = {
  url: string;
  title: string;
  uploadDate: string;
};

const VideoPreviewModal = ({ url, onClose }: { url: string; onClose: () => void }) => (
  <FocusModal open={true} onOpenChange={onClose}>
    <FocusModal.Content>
      <FocusModal.Header>
        <Button variant="secondary" onClick={onClose}>Close Preview</Button>
      </FocusModal.Header>
      <FocusModal.Body>
        <div className="flex justify-center p-4">
          <video 
            src={url} 
            className="max-w-full max-h-[70vh]"
            controls
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </FocusModal.Body>
    </FocusModal.Content>
  </FocusModal>
);

const VideoManager = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const getProductId = () => {
    const parts = window.location.pathname.split('/');
    const productIndex = parts.findIndex(part => part === 'products');
    return productIndex !== -1 ? parts[productIndex + 1] : null;
  };

  useEffect(() => {
    const productId = getProductId();
    if (!productId) return;

    const loadProduct = async () => {
      try {
        const { product } = await sdk.admin.product.retrieve(productId);
        setCurrentProduct(product);
        
        if (product?.metadata?.videos) {
          setVideos(JSON.parse(product.metadata.videos as string));
        }
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };

    loadProduct();
  }, []);

  const handleFileUpload = async () => {
    if (!uploadFile || !currentProduct?.id) return;

    setIsUploading(true);
    try {
      const filesArray = Array.from(uploadFile ? [uploadFile] : []);
      const { files } = await sdk.admin.upload.create({ files: filesArray });
      
      const newVideo: VideoData = {
        url: files[0].url,
        title: newVideoTitle || uploadFile.name,
        uploadDate: new Date().toISOString()
      };

      const updatedVideos = [...videos, newVideo];

      await sdk.admin.product.update(currentProduct.id, {
        metadata: {
          ...currentProduct.metadata,
          videos: JSON.stringify(updatedVideos)
        }
      });

      setVideos(updatedVideos);
      setIsModalOpen(false);
      setNewVideoTitle('');
      setUploadFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async (videoToDelete: VideoData) => {
    if (!currentProduct?.id) return;

    try {
      const updatedVideos = videos.filter(v => v.url !== videoToDelete.url);
      await sdk.admin.product.update(currentProduct.id, {
        metadata: {
          ...currentProduct.metadata,
          videos: JSON.stringify(updatedVideos)
        }
      });

      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  if (!currentProduct) return null;

  return (
    <Container>
      <div className=" rounded-lg border">
        <div className="p-4 border-b">
          <Heading level="h2">Product Videos</Heading>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Text size="base">Available Videos: {videos.length}</Text>
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsModalOpen(true)}
            >
              Upload New Video
            </Button>
          </div>

          <div className="space-y-4">
            {videos.map((video, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <Text size="base" className="font-medium">
                    {video.title}
                  </Text>
                  <Text size="small" className="text-ui-fg-subtle">
                    Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                  </Text>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setPreviewUrl(video.url)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteVideo(video)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleFileUpload}
              disabled={!uploadFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Upload New Video</Heading>
                <Text className="text-ui-fg-subtle">
                  Upload a video file to associate with this product.
                </Text>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="video_title" className="text-ui-fg-subtle">
                  Video Title
                </Label>
                <Input
                  id="video_title"
                  placeholder="Product Demo Video"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="video_file" className="text-ui-fg-subtle">
                  Video File
                </Label>
                <Input
                  id="video_file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Preview Modal */}
      {previewUrl && (
        <VideoPreviewModal 
          url={previewUrl} 
          onClose={() => setPreviewUrl('')}
        />
      )}
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default VideoManager;
