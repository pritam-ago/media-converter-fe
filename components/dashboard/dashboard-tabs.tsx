"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaConverter } from "@/components/media-converter"
import { FileManager } from "@/components/file-manager/file-manager"
import { UserHeader } from "@/components/dashboard/user-header"

interface DashboardTabsProps {
  userId: string
}

export function DashboardTabs({ userId }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("convert")

  return (
    <div className="container mx-auto py-8 px-4">
      <UserHeader />

      <Tabs defaultValue="convert" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="convert">Convert Files</TabsTrigger>
          <TabsTrigger value="manage">File Manager</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="convert" className="mt-0">
              <MediaConverter userId={userId} />
            </TabsContent>

            <TabsContent value="manage" className="mt-0">
              <FileManager userId={userId} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
