import React, { useState } from 'react';
import { Activity, Shield, Database } from 'lucide-react';
import { UploadForm } from './components/UploadForm';
import { SummaryDisplay } from './components/SummaryDisplay';
import { ChatBox } from './components/ChatBox';
import { MedicalSummary } from './types';

function App() {
  const [currentSummary, setCurrentSummary] = useState<MedicalSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStoringToIPFS, setIsStoringToIPFS] = useState(false);

  const handleGenerateSummary = async (medicalData: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: medicalData })
      });

      const result = await response.json();
      
      if (result.success) {
        const newSummary: MedicalSummary = {
          id: Date.now().toString(),
          summary: result.data.summary,
          timestamp: new Date(),
          originalData: medicalData
        };
        setCurrentSummary(newSummary);
      } else {
        throw new Error(result.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      // In a real app, you'd show an error toast/notification
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStoreToIPFS = async (summaryId: string) => {
    if (!currentSummary) return;
    
    setIsStoringToIPFS(true);
    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          summaryId,
          summary: currentSummary.summary,
          originalData: currentSummary.originalData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentSummary(prev => prev ? {
          ...prev,
          ipfsCid: result.data.cid
        } : null);
      } else {
        throw new Error(result.error || 'Failed to store on IPFS');
      }
    } catch (error) {
      console.error('Error storing to IPFS:', error);
      alert('Failed to store on IPFS. Please try again.');
    } finally {
      setIsStoringToIPFS(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">MediMod</h1>
                <p className="text-gray-600">Decentralized Medical Summarizer</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span>IPFS Storage</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Medical Record Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload patient records to generate comprehensive AI summaries, store them permanently on IPFS, 
            and chat with our AI to get insights about the medical data.
          </p>
        </div>

        {/* Upload Form */}
        <div className="mb-8">
          <UploadForm 
            onSubmit={handleGenerateSummary}
            isLoading={isGenerating}
          />
        </div>

        {/* Results Section */}
        {currentSummary && (
          <div className="space-y-8">
            {/* Summary Display */}
            <SummaryDisplay
              summary={currentSummary}
              onStoreToIPFS={handleStoreToIPFS}
              isStoringToIPFS={isStoringToIPFS}
            />

            {/* Chat Box */}
            <ChatBox
              summaryId={currentSummary.id}
              isVisible={true}
            />
          </div>
        )}

        {/* Features Section */}
        {!currentSummary && (
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Advanced AI powered by Meditron analyzes medical records to generate comprehensive summaries
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                <Database className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">IPFS Storage</h3>
              <p className="text-gray-600">
                Store summaries permanently on the decentralized web with IPFS for immutable records
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                HIPAA compliant processing with end-to-end encryption and zero data retention
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="h-6 w-6" />
              <span className="text-xl font-semibold">MediMod</span>
            </div>
            <p className="text-gray-400">
              Revolutionizing medical record management with AI and blockchain technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;