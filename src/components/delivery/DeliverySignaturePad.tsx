import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eraser, Save } from 'lucide-react';

interface DeliverySignaturePadProps {
  onSave: (signatureData: string) => void;
  onCancel: () => void;
}

const DeliverySignaturePad: React.FC<DeliverySignaturePadProps> = ({ onSave, onCancel }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // Returns base64 string
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  return (
    <Card className="p-4 bg-white w-full max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Signature Client</h3>
        <p className="text-sm text-gray-500 mb-2">
          Veuillez demander au client de signer dans le cadre ci-dessous.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden touch-none">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            backgroundColor="transparent"
            canvasProps={{
              className: 'w-full h-64 cursor-crosshair',
            }}
            onBegin={handleBegin}
          />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={clear} disabled={isEmpty} className="flex-1">
          <Eraser className="w-4 h-4 mr-2" />
          Effacer
        </Button>
        <div className="flex gap-2 flex-1 justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            onClick={save}
            disabled={isEmpty}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Valider
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DeliverySignaturePad;
