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
import { Folder, MoreVertical, Trash2, Loader2 } from "lucide-react"
import { deleteFolder } from "@/lib/s3"
import { useToast } from "@/components/ui/use-toast"

interface FolderListProps {
  folders: string[]
  isLoading: boolean
  onFolderClick: (folder: string) => void
  onRefresh: () => void
  userId: string
}

export function FolderList({ folders, isLoading, onFolderClick, onRefresh, userId }: FolderListProps) {
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return

    setIsDeleting(true)
    try {
      await deleteFolder(userId, folderToDelete)
      toast({
        title: "Folder deleted",
        description: `Folder "${folderToDelete}" has been deleted`,
      })
      onRefresh()
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setFolderToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (folders.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No folders found</p>
        <p className="text-sm">Create a new folder to organize your files</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <AnimatePresence>
        {folders.map((folder) => (
          <motion.div
            key={folder}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <div
              className="border rounded-lg p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              onClick={() => onFolderClick(folder)}
            >
              <div className="flex items-center justify-between">
                <Folder className="h-10 w-10 text-purple-500 mb-2" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFolderToDelete(folder)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="font-medium truncate">{folder}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AlertDialog open={!!folderToDelete} onOpenChange={(open) => !open && setFolderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the folder "{folderToDelete}" and all its contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
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
