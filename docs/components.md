# Estrutura de Componentes

## 🎨 Filosofia de Design

Os componentes seguem princípios de **composição**, **reutilização** e **responsabilidade única**, criando uma arquitetura escalável e manutenível.

## 📁 Organização

### **Estrutura de Pastas**
```
src/components/
├── ErrorBoundary.tsx     # Captura de erros
├── ErrorMessage.tsx      # Exibição de erros
├── LoadingSpinner.tsx    # Estados de loading
├── HouseCard.tsx         # Card das casas
└── EmailCapture.tsx      # Captura de email
```

### **Categorização**

#### **UI Components** (Apresentação)
- `LoadingSpinner`: Estados de carregamento
- `ErrorMessage`: Mensagens de erro
- `HouseCard`: Cartão de casa

#### **Utility Components** (Utilitários)
- `ErrorBoundary`: Captura e tratamento de erros
- `EmailCapture`: Funcionalidade específica

## 🧱 Padrões de Componentes

### **Composition Pattern**
```typescript
// Componente composável
<ErrorBoundary>
  <HousesProvider>
    <AppContent />
  </HousesProvider>
</ErrorBoundary>
```

### **Props Interface**
```typescript
interface HouseCardProps {
  house: HouseDto;
  className?: string;
  onClick?: (house: HouseDto) => void;
}

// Componente tipado
export function HouseCard({ house, className, onClick }: HouseCardProps) {
  // implementação
}
```

### **Render Props / Children Pattern**
```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; reset: () => void }>;
}
```

## 🎭 Componentes Principais

### **ErrorBoundary**
- **Propósito**: Captura erros em árvore de componentes
- **Features**: Recovery automático, logging de erros
- **Pattern**: Error Boundary + Analytics

```typescript
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Analytics tracking
    this.trackError(error, errorInfo);
  }
}
```

### **LoadingSpinner**
- **Propósito**: Estados de carregamento consistentes
- **Features**: Tamanhos variados, mensagens customizáveis
- **Pattern**: Compound Component

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}
```

### **HouseCard**
- **Propósito**: Exibição de informações da casa
- **Features**: Hover effects, click tracking, responsivo
- **Pattern**: Smart Component + Analytics

```typescript
export function HouseCard({ house }: HouseCardProps) {
  const { trackHouseCardHover, trackButtonClick } = useAnalytics();
  
  // Hover tracking com cleanup
  const handleMouseEnter = () => {
    const cleanup = trackHouseCardHover(house.id, house.name);
    return cleanup;
  };
}
```

## 🎨 Design System

### **Styling Strategy**
- **TailwindCSS**: Utility-first approach
- **CSS Variables**: Temas e customização
- **Glass Morphism**: Efeitos visuais modernos

### **Classes Utilitárias**
```css
/* Componentes customizados */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}

.glass-strong {
  @apply bg-white/20 backdrop-blur-lg border border-white/30;
}

.btn-magical {
  @apply px-6 py-3 rounded-xl font-semibold transition-all duration-300;
}
```

### **Responsividade**
```typescript
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
  {houses.map(house => <HouseCard key={house.id} house={house} />)}
</div>
```

## 🔄 Gerenciamento de Estado

### **Estado Local vs Global**

#### **Estado Local** (useState)
```typescript
// Estado específico do componente
const [isHovered, setIsHovered] = useState(false);
const [isAnimating, setIsAnimating] = useState(false);
```

#### **Estado Global** (Context)
```typescript
// Estado compartilhado
const { state, fetchHouses } = useHouses();
const { trackEvent } = useAnalytics();
```

### **Effect Management**
```typescript
// Cleanup automático
useEffect(() => {
  const cleanup = trackHouseCardHover(house.id);
  return cleanup; // Cleanup function
}, [house.id]);
```

## 🎯 Performance

### **Otimizações Aplicadas**

#### **React.memo**
```typescript
// Memorização para evitar re-renders
export const HouseCard = memo(function HouseCard({ house }: HouseCardProps) {
  // implementação
});
```

#### **useCallback**
```typescript
// Callbacks estáveis
const handleClick = useCallback(() => {
  trackButtonClick('house_card', house.name);
  navigate(`/house/${house.id}`);
}, [house.id, house.name, trackButtonClick, navigate]);
```

#### **Lazy Loading**
```typescript
// Componentes carregados sob demanda
const HouseDetailPage = lazy(() => import('./pages/HouseDetailPage'));
```

## 🧪 Testabilidade

### **Component Testing**
```typescript
// Props bem definidas facilitam testes
test('HouseCard renders house information', () => {
  const mockHouse = { id: '1', name: 'Gryffindor', ... };
  render(<HouseCard house={mockHouse} />);
  
  expect(screen.getByText('Gryffindor')).toBeInTheDocument();
});
```

### **Analytics Mocking**
```typescript
// Mock de analytics para testes
jest.mock('../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackHouseCardHover: jest.fn(),
    trackButtonClick: jest.fn()
  })
}));
```

## 🔧 Convenções

### **Naming**
- **PascalCase**: Nomes de componentes
- **camelCase**: Props e métodos
- **kebab-case**: CSS classes

### **File Organization**
```typescript
// Um componente por arquivo
// Export nomeado preferível ao default
export function ComponentName() { }

// Props interface no mesmo arquivo
interface ComponentNameProps { }
```

### **Props Design**
```typescript
// Props opcionais com defaults
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: ReactNode;
}

// Defaults via destructuring
export function Button({ 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  children 
}: ButtonProps) {
  // implementação
}
```

## 🔮 Evolução

### **Component Library**
- Extrair componentes para biblioteca externa
- Storybook para documentação
- Design tokens padronizados

### **Advanced Patterns**
- **Compound Components**: Para componentes complexos
- **Render Props**: Para lógica reutilizável
- **HOCs**: Para funcionalidades transversais

### **Performance Avançada**
- **Virtual Scrolling**: Para listas grandes
- **Code Splitting**: Por rota e componente
- **Bundle Optimization**: Tree shaking agressivo