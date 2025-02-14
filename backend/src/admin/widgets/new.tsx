import React, { useState, useEffect } from 'react';
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import Medusa from "@medusajs/js-sdk";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  Button,
  Container,
  Text,
  Heading,
  Tooltip,
  IconButton,
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

type RichDescription = {
  content: string;
  lastUpdated: string;
};

import { Editor } from '@tiptap/core';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="border-b p-2">
      <div className="flex items-center gap-2">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Tooltip content="Bold">
            <IconButton
              variant={editor.isActive('bold') ? "primary" : "transparent"}
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <span className="font-bold">B</span>
            </IconButton>
          </Tooltip>
          <Tooltip content="Italic">
            <IconButton
              variant={editor.isActive('italic') ? "primary" : "transparent"}
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <span className="italic">I</span>
            </IconButton>
          </Tooltip>
        </div>

        {/* Bullet List */}
        <div className="flex items-center gap-1">
          <Tooltip content="Bullet List">
            <IconButton
              variant={editor.isActive('bulletList') ? "primary" : "transparent"}
              size="small"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              •
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const RichDescriptionManager = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [description, setDescription] = useState<RichDescription | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
  });

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

        if (product?.metadata?.richDescription) {
          try {
            const parsedDescription = JSON.parse(product.metadata.richDescription as string);
            setDescription(parsedDescription);
            if (editor && parsedDescription.content) {
              editor.commands.setContent(parsedDescription.content);
            }
          } catch (e) {
            console.error("Error parsing rich description:", e);
            setDescription(null);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };

    loadProduct();
  }, [editor]);

  const handleSaveDescription = async () => {
    if (!editor || !currentProduct?.id) return;

    setIsSaving(true);
    try {
      const html = editor.getHTML();
      const updatedDescription: RichDescription = {
        content: html,
        lastUpdated: new Date().toISOString(),
      };

      const { product: latest } = await sdk.admin.product.retrieve(currentProduct.id);
      await sdk.admin.product.update(currentProduct.id, {
        metadata: {
          ...latest.metadata,
          richDescription: JSON.stringify(updatedDescription),
        },
      });

      setDescription(updatedDescription);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving description:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentProduct) return null;

  return (
    <Container>
      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <Heading level="h2">Product Description</Heading>
        </div>
        
        <div className="p-4">
          {!isEditing && description ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text size="small" className="text-ui-fg-subtle">
                  Last updated: {new Date(description.lastUpdated).toLocaleString()}
                </Text>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Description
                </Button>
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description.content }}
              />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <MenuBar editor={editor} />
              <EditorContent 
                editor={editor} 
                className="min-h-[200px] p-4"
              />
              <div className="flex justify-end gap-2 p-2 border-t bg-white">
                {description && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setIsEditing(false);
                      if (editor && description) {
                        editor.commands.setContent(description.content);
                      }
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : (description ? 'Save Changes' : 'Save Description')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default RichDescriptionManager;
