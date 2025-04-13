"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Download, MoreVertical, Trash2, Loader2 } from "lucide-react"
import { deleteFile, getSignedUrl } from "@/lib/s3"
import { useToast } from "@/components/ui/use-toast"
import { getFileIcon } from "@/lib/file-utils"

interface FileListProps {
  files: any[]
  isLoading: boolean
  currentFolder: string | null
  onRefresh: () => void
  userId: string
}

export function FileList({ files, isLoading, currentFolder, onRefresh, userId }: FileListProps) {
  const [fileToDelete, setFileToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDeleteFile = async () => {
    if (!fileToDelete) return

    setIsDeleting(true)
    try {
      await deleteFile(userId, fileToDelete.key)
      toast({
        title: "File deleted",
        description: `File "${fileToDelete.name}" has been deleted`,
      })
      onRefresh()
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setFileToDelete(null)
    }
  }

  const handleDownload = async (file: any) => {
    try {
      setIsDownloading(file.key)
      // Get a signed URL for the file
      const signedUrl = await getSignedUrl(file.key)

      // Open the URL in a new tab or trigger download
      window.open(signedUrl, "_blank")
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the file",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No files found</p>
        <p className="text-sm">
          {currentFolder ? `Upload files to the "${currentFolder}" folder` : "Upload files or select a folder"}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.name, "h-6 w-6 text-purple-500")}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => handleDownload(file)}
                  disabled={isDownloading === file.key}
                >
                  {isDownloading === file.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setFileToDelete(file)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file "{fileToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
