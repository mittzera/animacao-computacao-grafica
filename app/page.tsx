'use client'

import FootballAnimation from '@/components/FootballAnimationFixed'

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('Animação concluída!')
  }

  return (
    <main className="min-h-screen">
      <FootballAnimation onAnimationComplete={handleAnimationComplete} />
      
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
