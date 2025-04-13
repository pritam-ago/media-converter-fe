"use client"

import { ArrowRight, RefreshCw, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { getCompatibleFormats } from "@/lib/file-utils"

interface ConversionOptionsProps {
  fromType: string
  toType: string
  onFromTypeChange: (type: string) => void
  onToTypeChange: (type: string) => void
  onConvert: () => void
  onClear: () => void
  isConverting: boolean
}

export function ConversionOptions({
  fromType,
  toType,
  onFromTypeChange,
  onToTypeChange,
  onConvert,
  onClear,
  isConverting,
}: ConversionOptionsProps) {
  const targetFormats = getCompatibleFormats(fromType)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-purple-100 dark:border-purple-900">
        <CardContent className="p-4 space-y-4">
          <motion.h3
            className="font-medium flex items-center text-purple-700"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Conversion Options
          </motion.h3>

          <motion.div
            className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2">
              <Label htmlFor="from-type" className="text-sm text-gray-500">
                From
              </Label>
              <Select value={fromType} onValueChange={onFromTypeChange} disabled>
                <SelectTrigger
                  id="from-type"
                  className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800"
                >
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={fromType}>{fromType.toUpperCase()}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <motion.div
              animate={{
                x: [0, 5, 0],
                transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
              }}
            >
              <ArrowRight className="mt-8 text-purple-500" />
            </motion.div>

            <div className="space-y-2">
              <Label htmlFor="to-type" className="text-sm text-gray-500">
                To
              </Label>
              <Select value={toType} onValueChange={onToTypeChange}>
                <SelectTrigger id="to-type" className="border-purple-100 dark:border-purple-800 focus:ring-purple-500">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {targetFormats
                    .filter((format) => format !== fromType)
                    .map((format) => (
                      <SelectItem key={`to-${format}`} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-between pt-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={onClear}
              className="border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            >
              Clear All
            </Button>
            <Button
              onClick={onConvert}
              disabled={isConverting || !toType}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert Files"
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
