'use client'

import dynamic from 'next/dynamic'

// Carrega o componente apenas no client-side para evitar problemas de SSR com Three.js
const FootballAnimationFixed = dynamic(
  () => import('@/components/FootballAnimationFixed'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-sky-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-blue-800">Carregando Animação 3D...</p>
          <p className="text-blue-600">Preparando Three.js e WebGL</p>
        </div>
      </div>
    )
  }
)

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('Animação concluída!')
  }

  return (
    <main className="min-h-screen">
      <FootballAnimationFixed onAnimationComplete={handleAnimationComplete} />
      
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Animação 3D - Computação Gráfica</h2>
        <div className="text-sm space-y-1">
          <p><strong>✅ Hinge Joints:</strong> Articulações do joelho e cotovelo com limitação de ângulo</p>
          <p><strong>✅ Bones (Ossos):</strong> Sistema completo de esqueleto com 15 ossos</p>
          <p><strong>✅ FK (Forward Kinematics):</strong> Animação de corrida e comemoração</p>
          <p><strong>✅ IK (Inverse Kinematics):</strong> Posicionamento preciso da perna para o chute</p>
          <p><strong>⏱️ Duração:</strong> 18 segundos completos</p>
        </div>
        
        <div className="mt-3 text-xs text-gray-300">
          <p><strong>Tecnologias:</strong> Next.js, Three.js, TailwindCSS, TypeScript</p>
        </div>
      </div>
    </main>
  )
}
