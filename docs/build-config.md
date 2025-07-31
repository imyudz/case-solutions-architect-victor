# Configuração de Build

## ⚡ Vite Configuration

O projeto utiliza **Vite 7** como build tool, proporcionando desenvolvimento rápido e builds otimizados para produção.

## 🔧 Configuração Principal

### **vite.config.ts**
```typescript
export default defineConfig({
  plugins: [
    react(),           // React SWC para fast refresh
    tailwindcss(),     // TailwindCSS 4 integrado
  ],
  
  build: {
    minify: 'esbuild',     // Minificação com esbuild
    sourcemap: false,      // Sem sourcemaps em produção
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          analytics: ['@amplitude/analytics-browser']
        }
      }
    }
  }
});
```

## 📦 Code Splitting

### **Manual Chunks**
```typescript
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],    // ~45KB
  analytics: ['@amplitude/analytics-browser']             // ~30KB
}
```

### **Route-based Splitting**
```typescript
// Lazy loading de páginas
const HouseDetailPage = lazy(() => import('./pages/HouseDetailPage'));

// Suspense boundaries
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/house/:id" element={<HouseDetailPage />} />
  </Routes>
</Suspense>
```

## 🎯 Otimizações de Produção

### **ESBuild Configuration**
```typescript
esbuild: {
  drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
}
```

### **Environment Variables**
```typescript
define: {
  __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
}
```

## 📊 Bundle Analysis

### **Scripts Disponíveis**
```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production tsc -b && vite build",
    "build:analyze": "cross-env NODE_ENV=production tsc -b && vite build --mode analyze",
    "preview": "vite preview"
  }
}
```

### **Bundle Size Targets**
- **Vendor chunk**: ~45KB gzipped
- **Analytics chunk**: ~30KB gzipped
- **Main bundle**: ~25KB gzipped
- **Total**: <100KB gzipped

## 🔄 TypeScript Integration

### **Build Process**
```bash
# 1. TypeScript compilation check
tsc -b

# 2. Vite build with esbuild
vite build
```

### **Configuration Files**
```
tsconfig.json          # Base configuration
tsconfig.app.json      # App-specific config
tsconfig.node.json     # Node.js tools config
```

## 🎨 CSS Processing

### **TailwindCSS 4**
```typescript
// Vite plugin integration
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),  // Automatic CSS processing
  ],
});
```

### **PostCSS Pipeline**
- TailwindCSS processing
- CSS minification
- Autoprefixer
- PurgeCSS (automatic unused removal)

## 🚀 Performance Optimizations

### **Asset Optimization**
```typescript
build: {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        const info = assetInfo.name.split('.');
        let extType = info[info.length - 1];
        
        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
          extType = 'img';
        }
        
        return `assets/${extType}/[name]-[hash][extname]`;
      },
      chunkFileNames: 'assets/js/[name]-[hash].js',
      entryFileNames: 'assets/js/[name]-[hash].js',
    }
  }
}
```

### **Compression**
- **Brotli**: Automatic via Vercel
- **Gzip**: Fallback compression
- **Asset hashing**: Cache busting

## 🔒 Security

### **CSP Headers** (via Vercel)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.amplitude.com; connect-src 'self' *.amplitude.com https://wizard-world-api.herokuapp.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

### **Environment Variables**
```bash
# Build-time variables
VITE_AMPLITUDE_API_KEY=    # Analytics key
VITE_ENABLE_ANALYTICS=     # Feature flag
```

## 📈 Build Performance

### **Development**
- **HMR**: Hot Module Replacement sub-segundo
- **Fast Refresh**: Preserva estado do componente
- **TypeScript**: Incremental compilation

### **Production**
- **Build time**: ~15-30 segundos
- **Parallel processing**: Multi-core utilization
- **Caching**: Dependency caching agressivo

## 🔧 Environment Configuration

### **Development**
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  define: {
    __DEV__: mode === 'development',
  },
  
  server: {
    port: 3000,
    open: true,
    cors: true
  }
}));
```

### **Production**
```typescript
// Optimizations específicas para produção
build: {
  target: 'es2020',
  minify: 'esbuild',
  cssMinify: 'esbuild',
  reportCompressedSize: false,  // Skip size reporting for faster builds
}
```

## 📊 Monitoring

### **Build Metrics**
- Bundle size tracking
- Build time monitoring
- Dependency analysis
- Performance budgets

### **Runtime Metrics**
- Core Web Vitals
- Error tracking
- Performance monitoring
- User analytics

## 🔮 Future Optimizations

### **Potential Improvements**

#### **SWC Integration**
```typescript
// Substituir Babel por SWC completamente
export default defineConfig({
  plugins: [reactSWC()],
});
```

#### **Module Federation**
```typescript
// Para micro-frontends
build: {
  rollupOptions: {
    external: ['@shared/components'],
  }
}
```

#### **Edge-Side Rendering**
```typescript
// Vercel Edge Functions
export const config = {
  runtime: 'edge',
};
```

### **Performance Targets**
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms