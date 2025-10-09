"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ClassificationResult {
  condition: string
  confidence: number
  details: {
    coverCondition: string
    pageCondition: string
    bindingCondition: string
  }
  recommendations: string[]
}

export function BookClassifier() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setError(null)
    setResult(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Analyze image
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("https://final-api-2gqx.onrender.com/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to analyze the image. Please try again.")
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
      case "excellent":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "old":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-border bg-card transition-colors hover:border-primary/50">
        <CardContent className="p-8">
          <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center gap-4">
            {!selectedImage ? (
              <>
                <div className="rounded-full bg-primary/10 p-6">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <p className="mb-1 font-medium">Upload a book image</p>
                  <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                </div>
              </>
            ) : (
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image src={selectedImage || "/placeholder.svg"} alt="Uploaded book" fill className="object-contain" />
              </div>
            )}
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {selectedImage && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedImage(null)
                  setResult(null)
                  setError(null)
                }}
              >
                Upload Different Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="bg-card">
          <CardContent className="flex items-center justify-center gap-3 p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="font-medium">Analyzing book condition...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-card">
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Classification Result</h3>
                <Badge variant="outline" className={`text-base font-semibold ${getConditionColor(result.condition)}`}>
                  {result.condition}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold text-primary">{Math.round(result.confidence)}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Detailed Assessment</h4>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Cover</p>
                  <p className="font-medium">{result.details.coverCondition}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Pages</p>
                  <p className="font-medium">{result.details.pageCondition}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Binding</p>
                  <p className="font-medium">{result.details.bindingCondition}</p>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
