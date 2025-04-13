"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderList } from "@/components/file-manager/folder-list"
import { FileList } from "@/components/file-manager/file-list"
import { CreateFolderDialog } from "@/components/file-manager/create-folder-dialog"
import { getUserFolders, getUserFiles, createFolder } from "@/lib/s3"
import { Folder, FolderPlus, Search, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FileManagerProps {
  userId: string
}

export function FileManager({ userId }: FileManagerProps) {
  const [folders, setFolders] = useState<string[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadFolders()
    loadFiles()
  }, [userId])

  const loadFolders = async () => {
    setIsLoading(true)
    try {
      const userFolders = await getUserFolders(userId)
      setFolders(userFolders)
    } catch (error) {
      console.error("Error loading folders:", error)
      toast({
        title: "Error",
        description: "Failed to load folders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadFiles = async (folder: string | null = null) => {
    setIsLoading(true)
    try {
      const userFiles = await getUserFiles(userId, folder)
      setFiles(userFiles)
    } catch (error) {
      console.error("Error loading files:", error)
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder)
    loadFiles(folder)
  }

  const handleBackToRoot = () => {
    setCurrentFolder(null)
    loadFiles(null)
  }

  const handleCreateFolder = async (folderName: string) => {
    try {
      await createFolder(userId, folderName)
      toast({
        title: "Folder created",
        description: `Folder "${folderName}" has been created`,
      })
      loadFolders()
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    loadFolders()
    loadFiles(currentFolder)
  }

  const filteredFiles = searchQuery
    ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold flex items-center">
          <Folder className="mr-2 h-6 w-6 text-purple-500" />
          File Manager
          {currentFolder && <span className="ml-2 text-sm font-normal text-gray-500">/ {currentFolder}</span>}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreateFolder(true)}>
            <FolderPlus className="h-4 w-4 mr-1" />
            New Folder
          </Button>
        </div>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            {currentFolder && (
              <div className="p-2 border-b">
                <Button variant="ghost" size="sm" onClick={handleBackToRoot}>
                  ← Back to root
                </Button>
              </div>
            )}
            <FileList
              files={filteredFiles}
              isLoading={isLoading}
              currentFolder={currentFolder}
              onRefresh={handleRefresh}
              userId={userId}
            />
          </Card>
        </TabsContent>
        <TabsContent value="folders" className="mt-4">
          <Card>
            <FolderList
              folders={folders}
              isLoading={isLoading}
              onFolderClick={handleFolderClick}
              onRefresh={loadFolders}
              userId={userId}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <CreateFolderDialog open={showCreateFolder} onOpenChange={setShowCreateFolder} onConfirm={handleCreateFolder} />
    </div>
  )
}
