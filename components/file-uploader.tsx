"use client"

import { useCallback, useState } from "react"
import { useDropzone, type FileWithPath } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { getFileIcon } from "@/lib/file-utils"

interface FileUploaderProps {
  files: FileWithPath[]
  onUpload: (files: FileWithPath[]) => void
  detectedFormat: string
}

export function FileUploader({ files, onUpload, detectedFormat }: FileUploaderProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      onUpload(acceptedFiles)
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    onDragEnter: () => setIsDraggingOver(true),
    onDragLeave: () => setIsDraggingOver(false),
  })

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onUpload(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <motion.h2
        className="text-xl font-semibold flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Upload className="mr-2 h-5 w-5 text-purple-500" />
        Upload Files
        {detectedFormat && (
          <span className="ml-2 text-sm font-normal text-gray-500">(Detected: {detectedFormat.toUpperCase()})</span>
        )}
      </motion.h2>

      <motion.div
        {...(getRootProps() as HTMLMotionProps<"div">)}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDraggingOver
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : isDragActive
              ? "border-purple-400 bg-purple-50/50 dark:bg-purple-900/10"
              : "border-gray-300 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: isDraggingOver ? 1.1 : 1,
            y: isDraggingOver ? -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <p className="text-lg font-medium">{isDraggingOver ? "Drop files here" : "Drag & drop files here"}</p>
          <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
          {detectedFormat && (
            <p className="text-xs text-purple-600 mt-3 bg-purple-50 dark:bg-purple-900/20 py-1 px-3 rounded-full inline-block">
              Only {detectedFormat.toUpperCase()} files will be accepted
            </p>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Uploaded Files ({files.length})</h3>
                <ul className="space-y-2">
                  <AnimatePresence initial={false}>
                    {files.map((file, index) => (
                      <motion.li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        layout
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name, "h-5 w-5 text-purple-500")}
                          <div>
                            <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index)
                          }}
                          className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
