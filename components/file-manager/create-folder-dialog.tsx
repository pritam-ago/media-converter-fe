"use client"

import { useState } from "react"
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
import { Loader2 } from "lucide-react"

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (folderName: string) => Promise<void>
}

export function CreateFolderDialog({ open, onOpenChange, onConfirm }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return

    setIsCreating(true)
    try {
      await onConfirm(folderName.trim())
      setFolderName("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating folder:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>Enter a name for your new folder.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="My Folder"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreateFolder}
            disabled={isCreating || !folderName.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Folder"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
