# Animação 3D - Computação Gráfica 🎮⚽

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hugoc/animacao-computacao-grafica)

Este projeto implementa uma animação 3D completa de um personagem jogando futebol, desenvolvida com **Next.js**, **Three.js** e **TypeScript**. A animação de 18 segundos demonstra conceitos fundamentais de computação gráfica e animação de personagens.

## 🎯 Requisitos Implementados

### ✅ Hinge Joints (Articulações de Dobradiça)
- **Implementação**: Limitação angular em joelhos e cotovelos usando pontos pivô
- **Aplicação**: Movimento realístico das articulações com restrições anatômicas
- **Código**: `lib/animation-systems.ts` - Classe `HingeJoint`

### ✅ Sistema de Bones (Ossos)
- **Estrutura**: Esqueleto hierárquico com 15 ossos interconectados
- **Hierarquia**: Hip → Spine → Head | Shoulders → Arms → Forearms | Thighs → Shins → Feet
- **Código**: `lib/character-rig.ts` - Classe `CharacterRig`

### ✅ Forward Kinematics (FK)
- **Uso**: Animações de corrida, chute e comemoração
- **Técnica**: Controle direto da rotação de cada osso
- **Propagação**: Transformações hierárquicas dos ossos pais para filhos

### ✅ Inverse Kinematics (IK)
- **Algoritmo**: FABRIK (Forward And Backward Reaching IK)
- **Aplicação**: Posicionamento preciso da perna para o chute
- **Código**: `lib/animation-systems.ts` - Classe `IKSolver`

## 🎬 Sequência da Animação (18 segundos)

1. **Corrida Ida e Volta (0-8s)**: FK para movimento natural das pernas e braços
2. **Preparação do Chute (8-11s)**: IK para posicionamento preciso da perna
3. **Execução do Chute (11-14s)**: Hinge Joints com limitação angular + timing da bola
4. **Comemoração (14-18s)**: Combinação de FK e IK para celebração

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

## 🚀 Deploy na Vercel

### Opção 1: Deploy Automático
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hugoc/animacao-computacao-grafica)

### Opção 2: Deploy Manual

1. **Fork/Clone o repositório**
2. **Conecte à Vercel**:
   - Vá para [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Selecione este repositório

3. **Configurações de Build**:
   ```bash
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Variáveis de Ambiente** (se necessárias):
   ```
   NODE_ENV=production
   ```

### Otimizações para Produção

- ✅ **Bundle Splitting**: Next.js otimiza automaticamente
- ✅ **Tree Shaking**: Código não usado é removido
- ✅ **Compressão**: Gzip/Brotli habilitados
- ✅ **CDN Global**: Vercel Edge Network
- ✅ **Cache de Assets**: Three.js e dependências cacheadas

## 📝 Licença

Este projeto é desenvolvido para fins educacionais em Computação Gráfica.

---

Desenvolvido com ❤️ usando Next.js, Three.js e TypeScript
