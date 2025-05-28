# 🎮 Como Usar a Animação

## 🚀 Executando o Projeto

1. **Certifique-se de ter o Node.js instalado** (versão 18 ou superior)

2. **Navegue até o diretório do projeto**:
   ```bash
   cd "c:\Users\hugoc\Documents\GitHub\animacao-computacao-grafica"
   ```

3. **Instale as dependências** (se ainda não fez):
   ```bash
   npm install
   ```

4. **Execute o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

5. **Abra no navegador**:
   ```
   http://localhost:3000
   ```

## 🎯 Controles da Animação

### Botões Disponíveis
- **"Iniciar Animação"**: Inicia a sequência completa de 18 segundos
- **"Pausar"**: Pausa a animação no momento atual
- **"Resetar"**: Volta tudo para o estado inicial

### Informações Exibidas
- **Tempo atual**: Mostra o progresso da animação em segundos
- **Fases da animação**: Breakdown dos diferentes momentos

## 🎬 O Que Você Verá

### Sequência da Animação (18 segundos)

1. **🏃‍♂️ Corrida (0-5.4s)**
   - Boneco corre em direção à bola
   - Uso de **Forward Kinematics (FK)**
   - Movimento natural de pernas e braços

2. **⚽ Preparação (5.4-9s)**
   - Boneco se posiciona para o chute
   - Uso de **Inverse Kinematics (IK)**
   - Perna automaticamente posicionada

3. **🦵 Chute (9-12.6s)**
   - Movimento de chute da perna
   - Uso de **Hinge Joints** com limitação de ângulo
   - Bola voa em direção ao gol

4. **🎉 Comemoração (12.6-18s)**
   - Celebração do gol
   - Combinação de **FK + IK**
   - Movimento de salto e braços para cima

## 🔧 Conceitos Técnicos Demonstrados

### ✅ Hinge Joints (Dobradiças)
- **Localização**: Joelhos e cotovelos
- **Função**: Limitam o ângulo de rotação das articulações
- **Realismo**: Previnem movimentos impossíveis na anatomia humana

### ✅ Sistema de Bones (Ossos)
- **Quantidade**: 15 ossos interconectados
- **Hierarquia**: Sistema pai-filho para propagação de transformações
- **Deformação**: Mesh skinned que se deforma com os ossos

### ✅ Forward Kinematics (FK)
- **Uso**: Corrida e comemoração
- **Método**: Controle direto da rotação de cada osso
- **Vantagem**: Controle preciso do movimento

### ✅ Inverse Kinematics (IK)
- **Uso**: Posicionamento da perna para o chute
- **Método**: Algoritmo FABRIK (Forward And Backward Reaching)
- **Vantagem**: Posicionamento automático para atingir alvos

## 🎨 Elementos Visuais

- **Campo de futebol** com grama verde e linhas brancas
- **Bola de futebol** com padrão tradicional preto e branco
- **Gol** posicionado ao fundo
- **Iluminação dinâmica** com sombras suaves
- **Interface de controle** no canto superior direito

## 🛠️ Tecnologias Utilizadas

- **Next.js 14**: Framework React
- **Three.js**: Renderização 3D
- **TailwindCSS**: Estilização
- **TypeScript**: Tipagem estática

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Dispositivos**: Desktop, tablet, mobile
- **WebGL**: Necessário para renderização 3D

## 🐛 Solução de Problemas

### Se a animação não aparecer:
1. Verifique se o WebGL está habilitado no navegador
2. Atualize para a versão mais recente do navegador
3. Verifique o console do navegador para erros

### Se os controles não funcionarem:
1. Aguarde o carregamento completo da página
2. Clique em "Resetar" e tente novamente
3. Recarregue a página se necessário

### Performance lenta:
1. Feche outras abas do navegador
2. Verifique se a GPU está sendo utilizada
3. Reduza a qualidade gráfica se necessário

---

## 🎓 Valor Educacional

Esta animação demonstra conceitos fundamentais de **Computação Gráfica**:

- **Cinemática de Personagens**
- **Sistemas de Animação Procedural**
- **Hierarquias de Transformação**
- **Algoritmos de Inverse Kinematics**
- **Limitações Físicas em Articulações**

Perfeito para estudantes de Ciência da Computação, Jogos Digitais e áreas relacionadas! 🎯
