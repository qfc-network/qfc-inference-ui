'use client'

import { useModels } from '@/hooks/useModels'
import { ModelCard } from '@/components/ModelCard'

export default function ModelsPage() {
  const { models, loading } = useModels()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Supported Models</h1>
        <p className="text-gray-400">Browse available AI models on the QFC inference network</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map(model => (
            <ModelCard key={model.modelId} model={model} />
          ))}
        </div>
      )}
    </div>
  )
}
