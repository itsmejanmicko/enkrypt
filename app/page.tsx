import EncryptionTool from "@/components/encryption-tool"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <EncryptionTool />
      </div>
    </main>
  )
}
