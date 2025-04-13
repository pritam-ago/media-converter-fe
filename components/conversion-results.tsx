"use client"

import { Download, RefreshCw, CheckCircle, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { getFileIcon } from "@/lib/file-utils"
import type { FileWithPath } from "react-dropzone"

interface ConversionResultsProps {
  convertedFiles: any[]
  isConverting: boolean
  files: FileWithPath[]
  onSaveToCloud: (file: any) => void
}

export function ConversionResults({ convertedFiles, isConverting, files, onSaveToCloud }: ConversionResultsProps) {
  if (isConverting) {
    return (
      <div className="space-y-4">
        <motion.h2
          className="text-xl font-semibold flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <RefreshCw className="mr-2 h-5 w-5 text-purple-500 animate-spin" />
          Converting...
        </motion.h2>
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full border-4 border-purple-200"
                animate={{
                  rotate: 360,
                  borderColor: ["rgba(147, 51, 234, 0.2)", "rgba(147, 51, 234, 0.5)", "rgba(147, 51, 234, 0.2)"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <motion.div
                className="w-20 h-20 rounded-full border-4 border-t-purple-600 absolute top-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </div>
            <motion.p
              className="text-lg font-medium mt-6 text-purple-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Processing your files
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full text-xs text-purple-700 flex items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {file.name.split(".").pop()?.toUpperCase()}
                </motion.div>
              ))}
              <motion.div
                className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full text-xs text-purple-700 flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + files.length * 0.1 }}
              >
                →
              </motion.div>
              <motion.div
                className="px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-xs text-green-700 flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + (files.length + 1) * 0.1 }}
              >
                {files[0]?.name.split(".").shift()}.???
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (convertedFiles.length === 0) {
    return (
      <div className="space-y-4">
        <motion.h2
          className="text-xl font-semibold flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Download className="mr-2 h-5 w-5 text-purple-500" />
          Converted Files
        </motion.h2>
        <Card>
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400"
            >
              <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500">Your converted files will appear here</p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <motion.h2
        className="text-xl font-semibold flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
        Converted Files
      </motion.h2>
      <Card className="border-green-100 dark:border-green-900">
        <CardContent className="p-4">
          <ul className="space-y-3">
            <AnimatePresence>
              {convertedFiles.map((file, index) => (
                <motion.li
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name, "h-5 w-5 text-green-600")}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-green-200 hover:bg-green-50 hover:text-green-700"
                      onClick={() => onSaveToCloud(file)}
                    >
                      <Cloud className="h-4 w-4" />
                      Save to Cloud
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
