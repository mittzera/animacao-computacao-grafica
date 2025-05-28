# Animação 3D com Three.js - Computação Gráfica

Este projeto implementa uma animação 3D completa de um boneco jogando futebol, desenvolvida com **Next.js**, **Three.js** e **TailwindCSS**. A animação demonstra conceitos avançados de computação gráfica incluindo cinemática direta (FK), cinemática inversa (IK), articulações do tipo dobradiça (hinges) e sistema de ossos (bones).

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Atendidos

- **Hinge Joints (Dobradiças)**: Implementação de articulações com limitação de ângulo usando pontos pivô
- **Sistema de Bones**: Esqueleto completo com 15 ossos interconectados
- **FK (Forward Kinematics)**: Controle direto de rotação dos ossos para animações de corrida e comemoração
- **IK (Inverse Kinematics)**: Posicionamento automático da cadeia de ossos para atingir alvos específicos
- **Duração**: Animação completa de 18 segundos

### 🎬 Fases da Animação

1. **Corrida (0-5.4s)**: O boneco corre em direção à bola usando FK para simular movimento natural de caminhada
2. **Preparação (5.4-9s)**: Posicionamento da perna usando IK para preparar o chute
3. **Chute (9-12.6s)**: Movimento de chute usando Hinge Joints com limitação de ângulo
4. **Comemoração (12.6-18s)**: Animação de celebração combinando FK e IK

## 🛠️ Tecnologias Utilizadas

- **Next.js 14**: Framework React para desenvolvimento web
- **Three.js**: Biblioteca 3D para renderização e animação
- **@react-three/fiber**: Integração React com Three.js
- **@react-three/drei**: Utilitários adicionais para Three.js
- **TailwindCSS**: Framework CSS para estilização
- **TypeScript**: Tipagem estática para melhor desenvolvimento

## 🏗️ Estrutura do Projeto

```
animacao-computacao-grafica/
├── app/
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── components/
│   └── FootballAnimation.tsx # Componente principal da animação
├── lib/
│   ├── animation-systems.ts # Sistemas de IK, FK e Hinges
│   └── character-rig.ts    # Sistema de esqueleto e bones
└── utils/                  # Utilitários (vazio por enquanto)
```

## 🎮 Controles

- **Iniciar Animação**: Começa a animação do zero
- **Pausar**: Pausa a animação no momento atual
- **Resetar**: Volta para o estado inicial

## 🔧 Instalação e Execução

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd animacao-computacao-grafica
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute o projeto**:
   ```bash
   npm run dev
   ```

4. **Abra no navegador**:
   ```
   http://localhost:3000
   ```

## 🧮 Conceitos Técnicos Implementados

### Forward Kinematics (FK)
- Controle direto da rotação de cada osso
- Usado na animação de corrida e comemoração
- Simula movimento natural através de rotações coordenadas

### Inverse Kinematics (IK)
- Algoritmo FABRIK (Forward And Backward Reaching Inverse Kinematics)
- Posicionamento automático da cadeia de ossos para atingir um alvo
- Usado para posicionar a perna precisamente para o chute

### Hinge Joints (Dobradiças)
- Articulações com limitação de ângulo de rotação
- Implementação de pontos pivô para rotação realista
- Aplicado nos joelhos e cotovelos para movimento natural

### Sistema de Bones (Ossos)
- Esqueleto hierárquico com 15 ossos
- Skinned Mesh para deformação da geometria
- Sistema de pesos para influência de cada osso na mesh

## 🎨 Elementos Visuais

- **Cenário**: Campo de futebol com grama, linhas e gol
- **Iluminação**: Luz direcional com sombras suaves
- **Bola**: Geometria esférica com padrão de futebol
- **Personagem**: Mesh skinned com sistema de ossos completo
- **Interface**: Controles em tempo real e informações da animação

## 📱 Responsividade

O projeto se adapta automaticamente ao tamanho da tela e oferece controles intuitivos para diferentes dispositivos.

## 🚀 Possíveis Melhorias

- Adicionar mais tipos de animação (drible, defesa, etc.)
- Implementar física realista para a bola
- Adicionar sons e efeitos visuais
- Criar múltiplos personagens
- Implementar câmera cinemática
- Adicionar texturas mais detalhadas

## 📝 Licença

Este projeto é desenvolvido para fins educacionais em Computação Gráfica.

---

Desenvolvido com ❤️ usando Next.js, Three.js e TypeScript
