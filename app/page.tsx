"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)
    } catch (err) {
      setError('An error occurred while shortening the URL')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        alert('Copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">ZapLinks</CardTitle>
          <CardDescription>Enter a URL to shorten</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL to shorten</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {shortUrl && (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-md bg-muted">
                <Label className="text-sm font-medium">Shortened URL</Label>
                <div className="mt-1 flex">
                  <Input
                    value={shortUrl}
                    readOnly
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <QRCodeSVG value={shortUrl} size={200} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
