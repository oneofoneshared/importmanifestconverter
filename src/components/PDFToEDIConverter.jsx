import { AlertTriangle, CheckCircle, Download, FileText, Loader, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { sampleExtractedData } from '../utils/sampleData';
import { generateXML } from '../utils/xmlGenerator';

const PDFToEDIConverter = () => {
    const [step, setStep] = useState('upload');
    const [extractedData, setExtractedData] = useState(null);
    const [xmlOutput, setXmlOutput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const pdfFiles = files.filter(file => file.type === 'application/pdf');
        if (pdfFiles.length !== files.length) {
            alert('Please only upload PDF files.');
            return;
        }

        const newFiles = pdfFiles.map(file => ({
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const simulateAIProcessing = async () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload at least one PDF file before processing.');
            return;
        }

        setIsProcessing(true);
        setStep('processing');

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // In a real implementation, this would process the uploaded files
        const processedData = {
            ...sampleExtractedData,
            sourceFiles: uploadedFiles.map(f => f.name)
        };

        setExtractedData(processedData);
        setStep('review');
        setIsProcessing(false);
    };

    const generateEDIXML = () => {
        const xml = generateXML(extractedData);
        setXmlOutput(xml);
        setStep('output');
    };

    const downloadXML = () => {
        const blob = new Blob([xmlOutput], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manifest-${extractedData.container.number}-${Date.now()}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetProcess = () => {
        setStep('upload');
        setExtractedData(null);
        setXmlOutput('');
        setUploadedFiles([]);
    };

    const renderUploadStep = () => (
        <div className="space-y-4 sm:space-y-6">
            <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Upload size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Upload PDF Manifests</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Drag and drop your PDF files here, or click to select files
                </p>
                <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="fileInput"
                />
                <label
                    htmlFor="fileInput"
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block text-sm sm:text-base"
                >
                    Select PDF Files
                </label>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg fade-in">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between bg-white p-2 sm:p-3 rounded border">
                                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                    <FileText size={16} className="sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-xs sm:text-sm truncate">{file.name}</div>
                                        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2 flex-shrink-0"
                                >
                                    <X size={16} className="sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={simulateAIProcessing}
                        className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                        Process {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}
                    </button>
                </div>
            )}

            <div className="text-xs sm:text-sm text-gray-500">
                <p><strong>Expected Documents:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Master Manifest PDF (container level)</li>
                    <li>Individual House Bill PDFs (shipment level)</li>
                    <li>Optional: Hazardous documentation</li>
                </ul>
            </div>
        </div>
    );

    const renderProcessingStep = () => (
        <div className="text-center space-y-4 sm:space-y-6">
            <Loader size={32} className="sm:w-12 sm:h-12 mx-auto animate-spin text-blue-600" />
            <h3 className="text-base sm:text-lg font-semibold">Processing {uploadedFiles.length} Document{uploadedFiles.length !== 1 ? 's' : ''}...</h3>
            <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <CheckCircle size={16} className="sm:w-5 sm:h-5 text-green-600" />
                    <span className="text-sm sm:text-base">Extracting container information</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <CheckCircle size={16} className="sm:w-5 sm:h-5 text-green-600" />
                    <span className="text-sm sm:text-base">Processing vessel and routing data</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <Loader size={16} className="sm:w-5 sm:h-5 animate-spin text-blue-600" />
                    <span className="text-sm sm:text-base">Analyzing house bills of lading...</span>
                </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
                <p className="break-words">Processing files: {uploadedFiles.map(f => f.name).join(', ')}</p>
            </div>
        </div>
    );

    const renderReviewStep = () => (
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold flex items-center">
                <CheckCircle className="text-green-600 mr-2 w-5 h-5" />
                Extraction Complete - Review Data
            </h3>

            {extractedData.sourceFiles && (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Source Files Processed</h4>
                    <div className="text-xs sm:text-sm text-blue-700 break-words">
                        {extractedData.sourceFiles.join(', ')}
                    </div>
                </div>
            )}

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Container Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div><strong>Container:</strong> {extractedData.container.number}</div>
                    <div><strong>Seal:</strong> {extractedData.container.seal}</div>
                    <div><strong>Vessel:</strong> {extractedData.container.vessel}</div>
                    <div><strong>Voyage:</strong> {extractedData.container.voyage}</div>
                </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">House Bills ({extractedData.hbls.length})</h4>
                <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                    {extractedData.hbls.map((hbl, index) => (
                        <div key={index} className="bg-white p-2 sm:p-3 rounded border text-xs sm:text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                <div><strong>HBL:</strong> {hbl.hbl}</div>
                                <div><strong>Commodity:</strong> {hbl.commodity}</div>
                                <div><strong>Pieces:</strong> {hbl.pieces.count} {hbl.pieces.type}</div>
                                <div><strong>Weight:</strong> {hbl.weight.value} {hbl.weight.uom}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={generateEDIXML}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                    Generate CFS Import Manifest XML
                </button>
                <button
                    onClick={resetProcess}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                    Start Over
                </button>
            </div>
        </div>
    );

    const renderOutputStep = () => (
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold flex items-center">
                <CheckCircle className="text-green-600 mr-2 w-5 h-5" />
                CFS Import Manifest Generated
            </h3>

            <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-64 sm:max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words">{xmlOutput}</pre>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={downloadXML}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                    <Download size={16} className="sm:w-5 sm:h-5" />
                    <span>Download XML</span>
                </button>
                <button
                    onClick={resetProcess}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                    Process Another Manifest
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="text-xs sm:text-sm">
                        <p className="font-semibold text-yellow-800">Next Steps for Logiware Integration:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-700">
                            <li>Validate XML against CODA EDI XSD schema</li>
                            <li>Submit via SFTP/FTP to CODA systems</li>
                            <li>Monitor for CFS Status responses</li>
                            <li>Handle freight release workflows</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    PDF to CFS Import Manifest Converter
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                    AI-powered document processing: <strong>PDFs → AI IDP → CFS Import Manifest (XML) → Logiware</strong>
                </p>
            </div>

            <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between overflow-x-auto">
                    {['Upload', 'Process', 'Review', 'Generate'].map((stepName, index) => (
                        <div key={stepName} className="flex items-center flex-shrink-0">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${['upload', 'processing', 'review', 'output'][index] === step ||
                                (['processing', 'review', 'output'].includes(step) && index < ['upload', 'processing', 'review', 'output'].indexOf(step))
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                                }`}>
                                {index + 1}
                            </div>
                            <span className={`ml-1 sm:ml-2 text-xs sm:text-sm ${['upload', 'processing', 'review', 'output'][index] === step
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-500'
                                }`}>
                                {stepName}
                            </span>
                            {index < 3 && <div className="w-8 sm:w-16 h-0.5 bg-gray-300 ml-2 sm:ml-4" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                {step === 'upload' && renderUploadStep()}
                {step === 'processing' && renderProcessingStep()}
                {step === 'review' && renderReviewStep()}
                {step === 'output' && renderOutputStep()}
            </div>

            <div className="mt-4 sm:mt-6 text-xs text-gray-500">
                <p><strong>Technical Details:</strong> This prototype demonstrates the AI IDP workflow with real file upload capability.
                    In production, this would integrate with document processing APIs (Azure Document Intelligence, AWS Textract)
                    for OCR and data extraction from the uploaded PDF files. Currently uses sample data for demonstration purposes.</p>
            </div>
        </div>
    );
};

export default PDFToEDIConverter;