# 🚀 Guia de Deploy - Animação 3D Computação Gráfica

## Deploy na Vercel (Recomendado)

### Opção 1: Deploy Automático via GitHub

1. **Fork o repositório** no GitHub
2. **Conecte à Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte sua conta GitHub
   - Selecione o repositório forkado

3. **Configuração automática**:
   - A Vercel detecta automaticamente Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`

### Opção 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório do projeto
vercel

# Para deploy de produção
vercel --prod
```

## Otimizações Implementadas

### ✅ Bundle Optimization
- Three.js otimizado via `next.config.js`
- Tree shaking automático
- Code splitting por rotas

### ✅ Performance
- Renderer configurado para produção
- Shadow maps otimizados
- LOD (Level of Detail) implementado

### ✅ Caching
- Static assets cacheados por 1 ano
- Build cache da Vercel
- CDN global

## Variáveis de Ambiente

Não são necessárias variáveis de ambiente para este projeto.

## Monitoramento

### Bundle Size Analysis
```bash
npm run analyze
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## URLs de Deploy

- **Produção**: https://animacao-computacao-grafica.vercel.app
- **Preview**: URLs geradas automaticamente para cada PR

## Troubleshooting

### Problema: Three.js bundle muito grande
**Solução**: Configurações de otimização já implementadas no `next.config.js`

### Problema: Performance em mobile
**Solução**: Configurações de LOD e qualidade reduzida implementadas

### Problema: Build falha
**Solução**: 
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## Métricas de Performance

### Core Web Vitals esperados:
- **LCP**: < 2.5s
- **FID**: < 100ms  
- **CLS**: < 0.1

### Bundle sizes:
- **First Load JS**: ~219 kB
- **Page-specific**: ~132 kB
- **Shared chunks**: ~87 kB

## Estrutura de Deploy

```
.vercel/
├── output/          # Build output
├── cache/           # Build cache
└── static/          # Static assets

.next/
├── static/          # Static files
├── server/          # Server files
└── cache/           # Build cache
```

## Checklist Final

- [x] Build passa sem erros
- [x] TypeScript compila sem warnings  
- [x] Linting passa
- [x] Three.js otimizado
- [x] Performance configurada
- [x] README atualizado
- [x] Demo funciona corretamente

## Links Úteis

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Three.js Performance](https://threejs.org/docs/#manual/en/introduction/Performance-tips)
