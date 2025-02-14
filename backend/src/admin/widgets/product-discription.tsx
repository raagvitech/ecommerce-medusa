import { useState, useEffect } from 'react';
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import Medusa from "@medusajs/js-sdk";
import { Button, Container, Text, Heading, FocusModal, Input, Label, Textarea } from "@medusajs/ui";
import { Plus, Trash,  } from '@medusajs/icons';
import { Toaster, toast } from "@medusajs/ui"

const sdk = new Medusa({
  baseUrl: "https://basic-medusa-production.up.railway.app",
  debug: process.env.NODE_ENV === "development",
  auth: { type: "session" },
});

type Product = {
  id: string;
  title: string;
  metadata?: Record<string, any> | null;
};

type TableData = {
  summary: string;
  workingMechanism: string;
  characteristics: Array<{
    label: string;
    value: string;
  }>;
  certificates: Array<{
    title: string;
    url: string;
    uploadDate: string;
  }>;
  benefits: Array<{
    description: string;
  }>;
  sideEffects: Array<{
    description: string;
  }>;
  references: Array<{
    text: string;
    link: string;
  }>;
  
  preparation: Array<{
    description: string;
  }>;
};

const ProductDetailsManager = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [tableData, setTableData] = useState<TableData>({
    summary: "",
    workingMechanism: "",
    characteristics: [],
    certificates: [],
    benefits: [],
    sideEffects: [],
    references: [],
    preparation: []
  });


  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isEditingWorkingMechanism, setIsEditingWorkingMechanism] = useState(false);
  const [isEditingBenefit, setIsEditingBenefit] = useState(false);
  const [isEditingSideEffect, setIsEditingSideEffect] = useState(false);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState<number | null>(null);
  const [editingSideEffectIndex, setEditingSideEffectIndex] = useState<number | null>(null);
  const [editingBenefitText, setEditingBenefitText] = useState("");
  const [editingSideEffectText, setEditingSideEffectText] = useState("");


  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [isPrepModalOpen] = useState(false);
  
  // Form states
  const [newCharacteristic, setNewCharacteristic] = useState({ label: '', value: '' });
  const [newCertTitle, setNewCertTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newReference, setNewReference] = useState({ text: '', link: '' });
  const [newSideEffect, setNewSideEffect] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newPreparationStep, setNewPreparationStep] = useState({
    title: '',
    description: '',
    subSteps: [] as { title: string; description: string; }[]
  });
  
  // Edit indices
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Then replace the entire Preparation Steps section with this simplified version
const [newPreparation, setNewPreparation] = useState("");
const [isEditingPreparation, setIsEditingPreparation] = useState(false);
const [editingPreparationIndex, setEditingPreparationIndex] = useState<number | null>(null);
const [editingPreparationText, setEditingPreparationText] = useState("");
const handleAddPreparation = async () => {
  if (!newPreparation) return;
  
  const updatedPreparation = [...tableData.preparation, { description: newPreparation }];
  if (await updateTable({ preparation: updatedPreparation })) {
    setNewPreparation("");
    toast.success('Preparation step added successfully');
  }
};
const handleEditPreparation = async () => {
  if (editingPreparationIndex === null || !editingPreparationText) return;
  
  const updatedPreparation = [...tableData.preparation];
  updatedPreparation[editingPreparationIndex].description = editingPreparationText;

  if (await updateTable({ preparation: updatedPreparation })) {
    setIsEditingPreparation(false);
    setEditingPreparationIndex(null);
    setEditingPreparationText("");
    toast.success('Preparation step updated successfully');
  }
};

const handleDeletePreparation = async (index: number) => {
  const updated = tableData.preparation.filter((_, i) => i !== index);
  if (await updateTable({ preparation: updated })) {
    toast.success('Preparation step deleted successfully');
  }
};
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
        
        if (product?.metadata?.table) {
          if (typeof product.metadata.table === 'string') {
            setTableData(JSON.parse(product.metadata.table));
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error('Error loading product data');
      }
    };

    loadProduct();
  }, []);

  const updateTable = async (newData: Partial<TableData>) => {
    if (!currentProduct?.id) return;
    
    try {
      const updatedData = {
        ...tableData,
        ...newData
      };
      
      await sdk.admin.product.update(currentProduct.id, {
        metadata: {
          ...currentProduct.metadata,
          table: JSON.stringify(updatedData)
        }
      });
      
      setTableData(updatedData);
      return true;
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error('Error updating data');
      return false;
    }
  };

  // Characteristic Handlers
  const handleSaveCharacteristic = async () => {
    if (!newCharacteristic.label || !newCharacteristic.value) return;

    let updatedCharacteristics;
    if (editIndex !== null) {
      updatedCharacteristics = [...tableData.characteristics];
      updatedCharacteristics[editIndex] = newCharacteristic;
    } else {
      updatedCharacteristics = [...tableData.characteristics, newCharacteristic];
    }

    if (await updateTable({ characteristics: updatedCharacteristics })) {
      setIsCharModalOpen(false);
      setNewCharacteristic({ label: '', value: '' });
      setEditIndex(null);
      toast.success('Characteristic saved successfully');
    }
  };

  // Certificate Handlers
  const handleCertificateUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const filesArray = Array.from(uploadFile ? [uploadFile] : []);
      const { files } = await sdk.admin.upload.create({ files: filesArray });
      
      const newCert = {
        url: files[0].url,
        title: newCertTitle || uploadFile.name,
        uploadDate: new Date().toISOString()
      };

      const updatedCerts = [...tableData.certificates, newCert];
      
      if (await updateTable({ certificates: updatedCerts })) {
        setIsCertModalOpen(false);
        setNewCertTitle('');
        setUploadFile(null);
        toast.success('Certificate uploaded successfully');
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
      toast.error('Error uploading certificate');
    } finally {
      setIsUploading(false);
    }
  };

  // Benefit Handlers
  const handleAddBenefit = async () => {
    if (!newBenefit) return;
    
    const updatedBenefits = [...tableData.benefits, { description: newBenefit }];
    if (await updateTable({ benefits: updatedBenefits })) {
      setNewBenefit("");
      toast.success('Benefit added successfully');
    }
  };

  const handleEditBenefit = async () => {
    if (editingBenefitIndex === null || !editingBenefitText) return;
    
    const updatedBenefits = [...tableData.benefits];
    updatedBenefits[editingBenefitIndex].description = editingBenefitText;

    if (await updateTable({ benefits: updatedBenefits })) {
      setIsEditingBenefit(false);
      setEditingBenefitIndex(null);
      setEditingBenefitText("");
      toast.success('Benefit updated successfully');
    }
  };

  // Side Effect Handlers
  const handleAddSideEffect = async () => {
    if (!newSideEffect) return;
    
    const updatedSideEffects = [...tableData.sideEffects, { description: newSideEffect }];
    if (await updateTable({ sideEffects: updatedSideEffects })) {
      setNewSideEffect("");
      toast.success('Side effect added successfully');
    }
  };

  const handleEditSideEffect = async () => {
    if (editingSideEffectIndex === null || !editingSideEffectText) return;
    
    const updatedSideEffects = [...tableData.sideEffects];
    updatedSideEffects[editingSideEffectIndex].description = editingSideEffectText;

    if (await updateTable({ sideEffects: updatedSideEffects })) {
      setIsEditingSideEffect(false);
      setEditingSideEffectIndex(null);
      setEditingSideEffectText("");
      toast.success('Side effect updated successfully');
    }
  };

  // Reference Handlers
  const handleSaveReference = async () => {
    if (!newReference.text || !newReference.link) return;
    
    const updatedReferences = [...tableData.references, newReference];
    if (await updateTable({ references: updatedReferences })) {
      setIsRefModalOpen(false);
      setNewReference({ text: '', link: '' });
      toast.success('Reference added successfully');
    }
  };


  // Delete Handlers
  const handleDeleteCharacteristic = async (index: number) => {
    const updated = tableData.characteristics.filter((_, i) => i !== index);
    if (await updateTable({ characteristics: updated })) {
      toast.success('Characteristic deleted successfully');
    }
  };

  const handleDeleteCertificate = async (index: number) => {
    const updated = tableData.certificates.filter((_, i) => i !== index);
    if (await updateTable({ certificates: updated })) {
      toast.success('Certificate deleted successfully');
    }
  };

  const handleDeleteBenefit = async (index: number) => {
    const updated = tableData.benefits.filter((_, i) => i !== index);
    if (await updateTable({ benefits: updated })) {
      toast.success('Benefit deleted successfully');
    }
  };

  const handleDeleteSideEffect = async (index: number) => {
    const updated = tableData.sideEffects.filter((_, i) => i !== index);
    if (await updateTable({ sideEffects: updated })) {
      toast.success('Side effect deleted successfully');
    }
  };

  const handleDeleteReference = async (index: number) => {
    const updated = tableData.references.filter((_, i) => i !== index);
    if (await updateTable({ references: updated })) {
      toast.success('Reference deleted successfully');
    }
  };

  // const handleDeletePreparation = async (index: number) => {
  //   const updated = tableData.preparation.filter((_, i) => i !== index);
  //   if (await updateTable({ preparation: updated })) {
  //     toast.success('Preparation step deleted successfully');
  //   }
  // };

  
  const handleAddSubStep = () => {
    setNewPreparationStep(prev => ({
      ...prev,
      subSteps: [...prev.subSteps, { title: '', description: '' }]
    }));
  };

  const handleUpdateSubStep = (index: number, field: 'title' | 'description', value: string) => {
    setNewPreparationStep(prev => {
      const updatedSubSteps = [...prev.subSteps];
      updatedSubSteps[index] = { ...updatedSubSteps[index], [field]: value };
      return { ...prev, subSteps: updatedSubSteps };
    });
  };

  const handleRemoveSubStep = (index: number) => {
    setNewPreparationStep(prev => ({
      ...prev,
      subSteps: prev.subSteps.filter((_, i) => i !== index)
    }));
  };

  if (!currentProduct) return null;

  return (
    <Container>
      {/* Summary Section */}
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">Product Summary</Heading>
            <div className="flex gap-2">
              {isEditingSummary ? (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={async () => {
                      if (await updateTable({ summary: tableData.summary })) {
                        setIsEditingSummary(false);
                        toast.success('Summary saved successfully');
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => setIsEditingSummary(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setIsEditingSummary(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => updateTable({ summary: '' })}
                  >
                    <Trash />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          {isEditingSummary ? (
            <Textarea 
              rows={4}
              value={tableData.summary}
              onChange={(e) => setTableData({ ...tableData, summary: e.target.value })}
            />
          ) : (
            <Text className="whitespace-pre-line">{tableData.summary || 'No summary provided'}</Text>
          )}
        </div>
      </div>

      {/* Working Mechanism Section */}
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">How does it work?</Heading>
            <div className="flex gap-2">
              {isEditingWorkingMechanism ? (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={async () => {
                      if (await updateTable({ workingMechanism: tableData.workingMechanism })) {
                        setIsEditingWorkingMechanism(false);
                        toast.success('Working mechanism saved successfully');
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => setIsEditingWorkingMechanism(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setIsEditingWorkingMechanism(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => updateTable({ workingMechanism: '' })}
                  >
                    <Trash />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          {isEditingWorkingMechanism ? (
            <Textarea 
              rows={4}
              value={tableData.workingMechanism}
              onChange={(e) => setTableData({ ...tableData, workingMechanism: e.target.value })}
            />
          ) : (
            <Text className="whitespace-pre-line">{tableData.workingMechanism || 'No working mechanism provided'}</Text>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <Heading level="h2">Benefits</Heading>
        </div>
        <div className="p-4">
          <div className="space-y-4 mb-4">
            {tableData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <Text>{benefit.description}</Text>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setEditingBenefitIndex(index);
                      setEditingBenefitText(benefit.description);
                      setIsEditingBenefit(true);
                    }}
                  >
                    {/* <Edit /> */} edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteBenefit(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add new benefit..."
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
            />
            <Button
              variant="primary"
              size="small"
              onClick={handleAddBenefit}
              disabled={!newBenefit}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Effects Section */}
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <Heading level="h2">Side Effects</Heading>
        </div>
        <div className="p-4">
          <div className="space-y-4 mb-4">
            {tableData.sideEffects.map((effect, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <Text>{effect.description}</Text>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setEditingSideEffectIndex(index);
                      setEditingSideEffectText(effect.description);
                      setIsEditingSideEffect(true);
                    }}
                  >
                   {/* <Edit /> */} edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteSideEffect(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add new side effect..."
              value={newSideEffect}
              onChange={(e) => setNewSideEffect(e.target.value)}
            />
            <Button
              variant="primary"
              size="small"
              onClick={handleAddSideEffect}
              disabled={!newSideEffect}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>

      {/* Characteristics Section */}
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">Product Characteristics</Heading>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                setEditIndex(null);
                setNewCharacteristic({ label: '', value: '' });
                setIsCharModalOpen(true);
              }}
            >
              Add Characteristic
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {tableData.characteristics.map((char, index) => (
              <div key={index} className="flex flex-col">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text size="base" className="text-gray-600">{char.label}</Text>
                      <Text size="base" className="mt-2">{char.value}</Text>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setEditIndex(index);
                          setNewCharacteristic(char);
                          setIsCharModalOpen(true);
                        }}
                      >
               {/* <Edit /> */} edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteCharacteristic(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preparation Steps Section */}
      <div className="rounded-lg border mb-8">
  <div className="p-4 border-b">
    <Heading level="h2">Preparation Steps</Heading>
  </div>
  <div className="p-4">
    <div className="space-y-4 mb-4">
      {tableData.preparation.map((step, index) => (
        <div key={index} className="flex items-center justify-between p-2 border rounded">
          <Text>{step.description}</Text>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setEditingPreparationIndex(index);
                setEditingPreparationText(step.description);
                setIsEditingPreparation(true);
              }}
            >
              edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => handleDeletePreparation(index)}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      <Input
        placeholder="Add new preparation step..."
        value={newPreparation}
        onChange={(e) => setNewPreparation(e.target.value)}
      />
      <Button
        variant="primary"
        size="small"
        onClick={handleAddPreparation}
        disabled={!newPreparation}
      >
        <Plus />
      </Button>
    </div>
  </div>
</div>

      {/* Certificates Section */}
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">Certificates</Heading>
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsCertModalOpen(true)}
            >
              Upload Certificate
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {tableData.certificates.map((cert, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <Text size="base" className="font-medium">
                    {cert.title}
                  </Text>
                  <Text size="small" className="text-ui-fg-subtle">
                    Uploaded: {new Date(cert.uploadDate).toLocaleDateString()}
                  </Text>
                </div>
                <div className="flex gap-2">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="secondary"
                      size="small"
                    >
                      View
                    </Button>
                  </a>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteCertificate(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}

            {tableData.certificates.length === 0 && (
              <Text className="text-ui-fg-subtle text-center py-4">
                No certificates uploaded yet
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* References Section */}
      <div className="rounded-lg border mb-8">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Heading level="h2">References</Heading>
            <Button
              variant="primary"
              size="small"
              onClick={() => setIsRefModalOpen(true)}
            >
              Add Reference
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {tableData.references.map((ref, index) => (
              <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                <div>
                  <Text size="base" className="font-medium">
                    {ref.text}
                  </Text>
                  <a 
                    href={ref.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    {ref.link}
                  </a>
                </div>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteReference(index)}
                >
                  <Trash />
                </Button>
              </div>
            ))}

            {tableData.references.length === 0 && (
              <Text className="text-ui-fg-subtle text-center py-4">
                No references added yet
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Benefit Edit Modal */}
      <FocusModal open={isEditingBenefit} onOpenChange={setIsEditingBenefit}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleEditBenefit}
              disabled={!editingBenefitText}
            >
              Save Changes
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Edit Benefit</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-benefit" className="text-ui-fg-subtle">
                  Benefit Description
                </Label>
                <Input
                  id="edit-benefit"
                  value={editingBenefitText}
                  onChange={(e) => setEditingBenefitText(e.target.value)}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Side Effect Edit Modal */}
      <FocusModal open={isEditingSideEffect} onOpenChange={setIsEditingSideEffect}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleEditSideEffect}
              disabled={!editingSideEffectText}
            >
              Save Changes
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Edit Side Effect</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="edit-side-effect" className="text-ui-fg-subtle">
                  Side Effect Description
                </Label>
                <Input
                  id="edit-side-effect"
                  value={editingSideEffectText}
                  onChange={(e) => setEditingSideEffectText(e.target.value)}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Certificate Upload Modal */}
      <FocusModal open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleCertificateUpload}
              disabled={!uploadFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Certificate'}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Upload Certificate</Heading>
                <Text className="text-ui-fg-subtle">
                  Upload a certificate file (PDF, PNG, or JPG)
                </Text>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="cert_title" className="text-ui-fg-subtle">
                  Certificate Title
                </Label>
                <Input
                  id="cert_title"
                  placeholder="e.g., Certificate of Analysis"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="cert_file" className="text-ui-fg-subtle">
                  Certificate File
                </Label>
                <Input
                  id="cert_file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Reference Modal */}
      <FocusModal open={isRefModalOpen} onOpenChange={setIsRefModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleSaveReference}
              disabled={!newReference.text || !newReference.link}
            >
              Add Reference
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Add New Reference</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="ref_text" className="text-ui-fg-subtle">
                  Reference Text
                </Label>
                <Input
                  id="ref_text"
                  placeholder="Enter reference text..."
                  value={newReference.text}
                  onChange={(e) => setNewReference(prev => ({ ...prev, text: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="ref_link" className="text-ui-fg-subtle">
                  Reference Link
                </Label>
                <Input
                  id="ref_link"
                  placeholder="Enter reference link..."
                  value={newReference.link}
                  onChange={(e) => setNewReference(prev => ({ ...prev, link: e.target.value }))}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Characteristic Modal */}
      <FocusModal open={isCharModalOpen} onOpenChange={setIsCharModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              variant="primary"
              onClick={handleSaveCharacteristic}
              disabled={!newCharacteristic.label || !newCharacteristic.value}
            >
              {editIndex !== null ? 'Save Changes' : 'Add Characteristic'}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>{editIndex !== null ? 'Edit Characteristic' : 'Add New Characteristic'}</Heading>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="char_label" className="text-ui-fg-subtle">
                  Label
                </Label>
                <Input
                  id="char_label"
                  placeholder="e.g., Molecular Formula"
                  value={newCharacteristic.label}
                  onChange={(e) => setNewCharacteristic(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="char_value" className="text-ui-fg-subtle">
                  Value
                </Label>
                <Input
                  id="char_value"
                  placeholder="e.g., C14H22N4O9"
                  value={newCharacteristic.value}
                  onChange={(e) => setNewCharacteristic(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Preparation Modal */}
  
      <FocusModal open={isEditingPreparation} onOpenChange={setIsEditingPreparation}>
  <FocusModal.Content>
    <FocusModal.Header>
      <Button
        variant="primary"
        onClick={handleEditPreparation}
        disabled={!editingPreparationText}
      >
        Save Changes
      </Button>
    </FocusModal.Header>
    <FocusModal.Body className="flex flex-col items-center py-16">
      <div className="flex w-full max-w-lg flex-col gap-y-8">
        <div className="flex flex-col gap-y-1">
          <Heading>Edit Preparation Step</Heading>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="edit-preparation" className="text-ui-fg-subtle">
            Step Description
          </Label>
          <Input
            id="edit-preparation"
            value={editingPreparationText}
            onChange={(e) => setEditingPreparationText(e.target.value)}
          />
        </div>
      </div>
    </FocusModal.Body>
  </FocusModal.Content>
</FocusModal>
      <Toaster />
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductDetailsManager;