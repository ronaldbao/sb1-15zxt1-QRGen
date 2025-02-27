"use client";

import { useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from "@/components/ui/button";

interface SavedQRCode {
  title: string;
  type: string;
  data: string;
}

interface SavedQRCodesProps {
  savedQRCodes: string[];
}

const SavedQRCodes: React.FC<SavedQRCodesProps> = ({ savedQRCodes }) => {
  const [qrCodes, setQrCodes] = useState<QRCodeStyling[]>([]);
  const [parsedQRCodes, setParsedQRCodes] = useState<SavedQRCode[]>([]);

  useEffect(() => {
    const parsed = savedQRCodes.map(code => JSON.parse(code) as SavedQRCode);
    setParsedQRCodes(parsed);

    const loadedQRCodes = parsed.map(({ data }) => new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'svg',
      data: data,
      dotsOptions: {
        color: '#000000',
        type: 'rounded'
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    }));
    setQrCodes(loadedQRCodes);
  }, [savedQRCodes]);

  useEffect(() => {
    qrCodes.forEach((qrCode, index) => {
      const element = document.getElementById(`qr-code-${index}`);
      if (element) {
        element.innerHTML = '';
        qrCode.append(element);
      }
    });
  }, [qrCodes]);

  const handleDownload = (index: number) => {
    qrCodes[index].download({ name: `qr-code-${index}`, extension: 'png' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {parsedQRCodes.map((qrCode, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{qrCode.title}</h3>
          <p className="text-sm mb-2">Type: {qrCode.type}</p>
          <div id={`qr-code-${index}`} className="flex justify-center mb-2"></div>
          <p className="text-sm mb-2 truncate">{qrCode.data}</p>
          <Button onClick={() => handleDownload(index)}>Download</Button>
        </div>
      ))}
    </div>
  );
};

export default SavedQRCodes;