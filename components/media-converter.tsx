"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileUploader } from "@/components/file-uploader"
import { ConversionOptions } from "@/components/conversion-options"
import { ConversionResults } from "@/components/conversion-results"
import { CloudStorageDialog } from "@/components/cloud-storage-dialog"
import { convertFile } from "@/lib/api"
import { uploadToS3 } from "@/lib/s3"
import { detectFileFormat } from "@/lib/file-utils"
import type { FileWithPath } from "react-dropzone"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

interface MediaConverterProps {
  userId: string
}

export function MediaConverter({ userId }: MediaConverterProps) {
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [fromType, setFromType] = useState<string>("")
  const [toType, setToType] = useState<string>("")
  const [convertedFiles, setConvertedFiles] = useState<any[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"upload" | "convert" | "download">("upload")
  const [showCloudDialog, setShowCloudDialog] = useState(false)
  const [selectedFileForCloud, setSelectedFileForCloud] = useState<any | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { token } = useAuth()

  useEffect(() => {
    if (files.length > 0) {
      setCurrentStep("convert")
    } else {
      setCurrentStep("upload")
    }
  }, [files])

  useEffect(() => {
    if (convertedFiles.length > 0) {
      setCurrentStep("download")
    }
  }, [convertedFiles])

  const handleFileUpload = (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length === 0) return

    // Detect format of the first file
    const firstFileFormat = detectFileFormat(acceptedFiles[0])

    // Check if all files have the same format
    const allSameFormat = acceptedFiles.every((file) => detectFileFormat(file) === firstFileFormat)

    if (!allSameFormat) {
      toast({
        title: "Format mismatch",
        description: "All files must be of the same format. Please upload files of the same type.",
        variant: "destructive",
      })
      return
    }

    setFiles(acceptedFiles)
    setConvertedFiles([])
    setError(null)
    setFromType(firstFileFormat)

    toast({
      title: "Files uploaded",
      description: `Detected format: ${firstFileFormat.toUpperCase()}`,
    })
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please upload at least one file")
      return
    }

    if (!fromType) {
      setError("Please select the source format")
      return
    }

    if (!toType) {
      setError("Please select the target format")
      return
    }

    setIsConverting(true)
    setError(null)

    try {
      // Simulate conversion with a staggered delay for visual effect
      const results = await Promise.all(
        files.map(
          (file, index) =>
            new Promise((resolve) => setTimeout(() => resolve(convertFile(file, fromType, toType)), 500 + index * 300)),
        ),
      )
      setConvertedFiles(results as any[])
      toast({
        title: "Conversion complete",
        description: `Successfully converted ${files.length} files`,
      })
    } catch (err) {
      setError("Conversion failed. Please try again.")
      toast({
        title: "Conversion failed",
        description: "There was an error converting your files. Please try again.",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setIsConverting(false)
    }
  }

  const clearAll = () => {
    setFiles([])
    setConvertedFiles([])
    setError(null)
    setCurrentStep("upload")
    toast({
      title: "Cleared",
      description: "All files have been cleared",
    })
  }

  const handleSaveToCloud = (file: any) => {
    setSelectedFileForCloud(file)
    setShowCloudDialog(true)
  }

  const handleCloudStorageConfirm = async (folderPath: string) => {
    if (!selectedFileForCloud) return

    setIsUploading(true)
    try {
      // Upload the file to S3 via the API
      await uploadToS3({
        file: selectedFileForCloud.blob || new Blob([selectedFileForCloud]),
        fileName: selectedFileForCloud.name,
        folderPath,
        userId,
      })

      toast({
        title: "File saved to cloud",
        description: `${selectedFileForCloud.name} has been saved to ${folderPath || "root folder"}`,
      })
    } catch (error) {
      console.error("Error uploading to S3:", error)
      toast({
        title: "Upload failed",
        description: "Failed to save file to cloud storage",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setShowCloudDialog(false)
      setSelectedFileForCloud(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StepIndicator step={1} label="Upload" isActive={currentStep === "upload"} isComplete={files.length > 0} />
          <StepIndicator
            step={2}
            label="Convert"
            isActive={currentStep === "convert"}
            isComplete={convertedFiles.length > 0}
          />
          <StepIndicator step={3} label="Download" isActive={currentStep === "download"} isComplete={false} />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-start"
        >
          <div className="space-y-6">
            <FileUploader files={files} onUpload={handleFileUpload} detectedFormat={fromType} />

            {files.length > 0 && (
              <ConversionOptions
                fromType={fromType}
                toType={toType}
                onFromTypeChange={setFromType}
                onToTypeChange={setToType}
                onConvert={handleConvert}
                onClear={clearAll}
                isConverting={isConverting}
              />
            )}

            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </div>

          <div className="hidden md:flex items-center justify-center h-full">
            <div className="border-t border-gray-200 w-12 md:w-0 md:h-32 md:border-l"></div>
          </div>

          <ConversionResults
            convertedFiles={convertedFiles}
            isConverting={isConverting}
            files={files}
            onSaveToCloud={handleSaveToCloud}
          />
        </motion.div>
      </AnimatePresence>

      <CloudStorageDialog
        open={showCloudDialog}
        onOpenChange={setShowCloudDialog}
        onConfirm={handleCloudStorageConfirm}
        fileName={selectedFileForCloud?.name || ""}
        isUploading={isUploading}
        userId={userId}
      />
    </div>
  )
}

interface StepIndicatorProps {
  step: number
  label: string
  isActive: boolean
  isComplete: boolean
}

function StepIndicator({ step, label, isActive, isComplete }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
          isComplete
            ? "bg-green-100 text-green-700 border-2 border-green-500"
            : isActive
              ? "bg-purple-100 text-purple-700 border-2 border-purple-500"
              : "bg-gray-100 text-gray-500 border border-gray-300"
        }`}
      >
        {step}
      </div>
      <span
        className={`ml-2 text-sm font-medium ${
          isActive ? "text-purple-700" : isComplete ? "text-green-700" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      {step < 3 && <div className="w-8 h-px bg-gray-300 mx-2" />}
    </div>
  )
}
