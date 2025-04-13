"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileUp, Folder, RefreshCw } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            MediaConverter
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Convert Media Files with Ease
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform your files between formats, store them in the cloud, and manage your media library all in one
            place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Convert Any Format</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Support for audio, video, images, and documents with high-quality conversion between formats.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FileUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cloud Storage</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Securely store your files in the cloud and access them from anywhere, anytime.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Folder className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">File Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Organize your files with folders, tags, and search to keep everything neatly arranged.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
