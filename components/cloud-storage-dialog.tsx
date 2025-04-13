"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Folder, FolderPlus, Loader2 } from "lucide-react"
import { getUserFolders, createFolder } from "@/lib/s3"

interface CloudStorageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (folderPath: string) => void
  fileName: string
  isUploading: boolean
  userId: string
}

export function CloudStorageDialog({
  open,
  onOpenChange,
  onConfirm,
  fileName,
  isUploading,
  userId,
}: CloudStorageDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [folders, setFolders] = useState<string[]>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)

  useEffect(() => {
    if (open) {
      loadFolders()
    }
  }, [open, userId])

  const loadFolders = async () => {
    setIsLoadingFolders(true)
    try {
      const userFolders = await getUserFolders(userId)
      setFolders(userFolders)
    } catch (error) {
      console.error("Error loading folders:", error)
    } finally {
      setIsLoadingFolders(false)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    try {
      await createFolder(userId, newFolderName.trim())
      setNewFolderName("")
      setShowNewFolderInput(false)
      await loadFolders()
      setSelectedFolder(newFolderName.trim())
    } catch (error) {
      console.error("Error creating folder:", error)
    } finally {
      setIsCreatingFolder(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save to Cloud Storage</DialogTitle>
          <DialogDescription>
            Choose where to save <span className="font-medium">{fileName}</span> in your cloud storage.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder">Select Folder</Label>
            {isLoadingFolders ? (
              <div className="flex items-center space-x-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                <span className="text-sm text-gray-500">Loading folders...</span>
              </div>
            ) : (
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Root folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 mr-2 text-purple-500" />
                        {folder}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {!showNewFolderInput ? (
            <Button type="button" variant="outline" className="mt-2" onClick={() => setShowNewFolderInput(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Create New Folder
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="new-folder">New Folder Name</Label>
              <div className="flex space-x-2">
                <Input
                  id="new-folder"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                />
                <Button type="button" onClick={handleCreateFolder} disabled={isCreatingFolder || !newFolderName.trim()}>
                  {isCreatingFolder ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(selectedFolder)}
            disabled={isUploading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save to Cloud"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
