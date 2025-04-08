"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, Key, Lock, Unlock, RefreshCw, Shield, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Footer from "./footer"

export default function EncryptionTool() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [algorithm, setAlgorithm] = useState("caesar")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("encrypt")
  const [copied, setCopied] = useState(false)

  const handleProcess  =async() => {
    if (!inputText.trim()) {
      toast.error("Empty input", {
        description: "Please enter some text to process",
      })
      return
    }
    setIsProcessing(true)
    if(activeTab === "encrypt") {
       encryptText()
    }
    else {
      decryptText()
    }
    setIsProcessing(false);
  }

  function encryptText() {
    const algorithms = {
      caesar: () => {
        const shift = parseInt(encryptionKey) || 3
        return inputText.replace(/[a-zA-Z]/g, (char) => {
          const base = char.charCodeAt(0) < 97 ? 65 : 97
          return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
        })
      },
      vigenere: () => {
        const key = encryptionKey.toLowerCase()
        let j = 0
        return inputText.replace(/[a-zA-Z]/g, (char) => {
          const base = char.charCodeAt(0) < 97 ? 65 : 97
          const shift = key.charCodeAt(j % key.length) - 97
          j++
          return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
        })
      },
      base64: () => btoa(inputText),
      reverse: () => inputText.split("").reverse().join("")
    }
    const encryptedText = algorithms[algorithm as keyof typeof algorithms]()
    setOutputText(encryptedText)
  }
  function decryptText(){
      const algorithms = {
        caesar:()=>{
          const shift = parseInt(encryptionKey) || 3
          return inputText.replace(/[a-zA-Z]/g, (char) => {
            const base = char.charCodeAt(0) < 97 ? 65 : 97
            return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base)
          })
        },
        vigenere:()=>{
          const key = encryptionKey.toLowerCase()
          let j = 0
          return inputText.replace(/[a-zA-Z]/g, (char) => {
            const base = char.charCodeAt(0) < 97 ? 65 : 97
            const shift = key.charCodeAt(j % key.length) - 97
            j++
            return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base)
          })
        },
        base64:()=>atob(inputText),
        reverse:()=>inputText.split("").reverse().join("")
      }
      const decryptedText = algorithms[algorithm as keyof typeof algorithms]()
      setOutputText(decryptedText)
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    toast.success("Copied to clipboard", {
      description: "The processed text has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }
  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setEncryptionKey("")
  }

  const needsKey = algorithm !== "base64" && algorithm !== "reverse"

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Secure Encryption Tool</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Encrypt and decrypt your sensitive information with multiple algorithms
        </p>
      </motion.div>

      <Tabs defaultValue="encrypt" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="encrypt" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Encrypt</span>
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            <span>Decrypt</span>
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "encrypt" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeTab === "encrypt" ? (
                  <>
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Encrypt Your Data</span>
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5 text-blue-500" />
                    <span>Decrypt Your Data</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === "encrypt"
                  ? "Convert your plain text into a secure encrypted format"
                  : "Convert encrypted text back to its original form"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="algorithm">Encryption Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caesar">Caesar Cipher</SelectItem>
                    <SelectItem value="vigenere">Vigenère Cipher</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                    <SelectItem value="reverse">Reverse Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {needsKey && (
                <div className="space-y-2">
                  <Label htmlFor="key">{algorithm === "caesar" ? "Shift Value (number)" : "Encryption Key"}</Label>
                  <div className="relative">
                    <Input
                      id="key"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder={algorithm === "caesar" ? "Enter a number (default: 3)" : "Enter encryption key"}
                      className="pr-10"
                    />
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="input">{activeTab === "encrypt" ? "Text to Encrypt" : "Text to Decrypt"}</Label>
                <Textarea
                  id="input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeTab === "encrypt" ? "Enter the text you want to encrypt..." : "Enter the encrypted text..."
                  }
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="output">{activeTab === "encrypt" ? "Encrypted Result" : "Decrypted Result"}</Label>
                  {outputText && (
                    <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="relative">
                  <Textarea
                    id="output"
                    value={outputText}
                    readOnly
                    placeholder={
                      activeTab === "encrypt"
                        ? "Encrypted text will appear here..."
                        : "Decrypted text will appear here..."
                    }
                    className="min-h-[120px] bg-muted/50"
                  />
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                        >
                          <RefreshCw className="h-8 w-8 text-primary" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-2">
              <Button variant="outline" onClick={handleClear}>
                Clear All
              </Button>
              <Button onClick={handleProcess} disabled={isProcessing}>
                {isProcessing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : activeTab === "encrypt" ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Encrypt
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Decrypt
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </Tabs>

      <Footer />
    </div>
  )
}
