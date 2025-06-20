import React, { useState, useEffect } from 'react';
import { Download, Share2, Database, CheckCircle, Loader2, Copy, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import { MedicalSummary } from '../types';

interface SummaryDisplayProps {
  summary: MedicalSummary | null;
  onStoreToIPFS: (summaryId: string) => void;
  isStoringToIPFS: boolean;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ 
  summary, 
  onStoreToIPFS, 
  isStoringToIPFS 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    if (summary?.ipfsCid) {
      const ipfsUrl = `https://ipfs.io/ipfs/${summary.ipfsCid}`;
      QRCode.toDataURL(ipfsUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      }).then(setQrCodeUrl);
    }
  }, [summary?.ipfsCid]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Medical Summary Generated</h3>
              <p className="text-sm text-gray-600">
                Generated on {summary.timestamp.toLocaleDateString()} at {summary.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {summary.ipfsCid && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
              <Database className="h-4 w-4" />
              Stored on IPFS
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Content */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900">AI-Generated Summary</h4>
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
          </div>
        </div>

        {/* IPFS Storage Section */}
        {!summary.ipfsCid ? (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Store on IPFS</p>
                  <p className="text-sm text-blue-700">
                    Save this summary permanently on the decentralized web
                  </p>
                </div>
              </div>
              <button
                onClick={() => onStoreToIPFS(summary.id)}
                disabled={isStoringToIPFS}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 transition-colors flex items-center gap-2"
              >
                {isStoringToIPFS ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Storing...
                  </>
                ) : (
                  'Store to IPFS'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* IPFS Details */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">IPFS Storage Details</h4>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Content ID (CID)</span>
                    <button
                      onClick={() => copyToClipboard(summary.ipfsCid!, 'CID')}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      {copySuccess === 'CID' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 font-mono break-all mt-1">
                    {summary.ipfsCid}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">IPFS Gateway URL</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(`https://ipfs.io/ipfs/${summary.ipfsCid}`, 'URL')}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        {copySuccess === 'URL' ? 'Copied!' : 'Copy'}
                      </button>
                      <a
                        href={`https://ipfs.io/ipfs/${summary.ipfsCid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Open
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 break-all mt-1">
                    https://ipfs.io/ipfs/{summary.ipfsCid}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">QR Code</h4>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                {qrCodeUrl ? (
                  <>
                    <img src={qrCodeUrl} alt="IPFS QR Code" className="w-40 h-40 rounded-lg" />
                    <p className="text-xs text-gray-600 text-center mt-2">
                      Scan to access on IPFS
                    </p>
                  </>
                ) : (
                  <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" />
            Download Summary
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};