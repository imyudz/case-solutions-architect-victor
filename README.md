# Hogwarts Houses Explorer 🏰

A magical React application that explores the Houses of Hogwarts School of Witchcraft and Wizardry using the WizardWorld API. Built with modern React, TypeScript, and a production-ready scalable architecture.

## ✨ Features

- **House Gallery**: Browse all four Hogwarts houses with beautiful card layouts
- **Detailed House Information**: View comprehensive details about each house including:
  - Founder information
  - House colors, animal, and element
  - House traits and characteristics
  - Common room location
  - House ghost
  - House heads throughout history
- **Magical UI/UX**: Harry Potter-themed design with:
  - Animated magical elements
  - House-specific color schemes
  - Responsive glassmorphism design
  - Magical loading animations
- **Production-Ready Architecture**: Scalable codebase with:
  - Dependency injection for analytics
  - Comprehensive error handling
  - TypeScript for type safety
  - Modular component structure

## 🏗️ Architecture

### Service Layer
- **HTTP Client**: Configurable HTTP service with error handling
- **Analytics Service**: Dependency injection pattern for easy SDK integration
- **API Service**: WizardWorld API integration with analytics tracking
- **Service Container**: Centralized dependency management

### State Management
- **React Context**: Global state management for houses data
- **useReducer**: Predictable state updates with actions
- **Custom Hooks**: Reusable state logic

### Components
- **Error Boundary**: Catches and handles React errors gracefully
- **Loading Spinner**: Magical wand-spinning loader
- **Error Message**: User-friendly error display with retry functionality
- **House Card**: Interactive house preview cards
- **Page Components**: Houses list and house detail pages

### Styling
- **CSS Modules**: Scoped component styling
- **Responsive Design**: Mobile-first approach
- **Harry Potter Theme**: Magical animations and color schemes
- **Dark Mode Support**: Automatic theme adaptation
- **Accessibility**: WCAG compliant with reduced motion support

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd case-solutions-architect-victor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔧 Configuration

### Analytics Integration

The application is prepared for analytics SDK integration. To add a real analytics service:

1. **Install your analytics SDK** (e.g., Segment, Google Analytics):
   ```bash
   npm install @segment/analytics-node
   ```

2. **Create a new analytics service** in `src/services/analytics.ts`:
   ```typescript
   export class SegmentAnalyticsService implements AnalyticsService {
     private analytics: Analytics;

     constructor(writeKey: string) {
       this.analytics = new Analytics({ writeKey });
     }

     async track(event: AnalyticsEvent): Promise<void> {
       this.analytics.track({
         userId: event.userId,
         event: event.name,
         properties: event.properties
       });
     }
     // ... implement other methods
   }
   ```

3. **Update the service container** in `src/services/container.ts`:
   ```typescript
   getAnalyticsService(): AnalyticsService {
     if (this.config.analyticsConfig?.writeKey) {
       return new SegmentAnalyticsService(this.config.analyticsConfig.writeKey);
     }
     return new ConsoleAnalyticsService();
   }
   ```

### API Configuration

Update the API base URL in `src/services/container.ts`:

```typescript
const defaultConfig: AppConfig = {
  apiBaseUrl: 'https://your-api-endpoint.com',
  enableAnalytics: true,
  // ...
};
```

## 📱 Usage

### Navigation
- **Houses Page** (`/houses`): Browse all Hogwarts houses
- **House Detail** (`/house/:id`): View detailed information about a specific house
- **Auto-redirect**: Unknown routes redirect to the houses page

### Analytics Events

The application tracks the following events:
- `page_view`: Page navigation
- `house_card_clicked`: House card interactions
- `api_request_started/success/error`: API call monitoring
- `retry_button_clicked`: Error recovery actions
- `back_to_houses_clicked`: Navigation actions

## 🏛️ API Integration

The application consumes the WizardWorld API:
- **Base URL**: `https://wizard-world-api.herokuapp.com`
- **Houses Endpoint**: `GET /Houses`
- **House Detail Endpoint**: `GET /Houses/{id}`

### Data Types

```typescript
interface HouseDto {
  id: string;
  name: string | null;
  houseColours: string | null;
  founder: string | null;
  animal: string | null;
  element: string | null;
  ghost: string | null;
  commonRoom: string | null;
  heads: HouseHeadDto[] | null;
  traits: TraitDto[] | null;
}
```

## 🎨 Theming

### House Colors
The application automatically adapts to house-specific color schemes:
- **Gryffindor**: Red and Gold
- **Slytherin**: Green and Silver
- **Ravenclaw**: Blue and Bronze
- **Hufflepuff**: Yellow and Black

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 📦 Dependencies

### Core Dependencies
- `react` (^19.1.0): UI library
- `react-dom` (^19.1.0): DOM bindings
- `react-router-dom` (^6.26.1): Client-side routing

### Development Dependencies
- `typescript` (~5.8.3): Type checking
- `vite` (^7.0.4): Build tool
- `eslint` (^9.30.1): Code linting

## 🚀 Deployment

### Vercel
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🧙‍♂️ Magic Notes

- The application uses real data from the WizardWorld API
- All animations respect `prefers-reduced-motion` for accessibility
- Error messages use magical Harry Potter terminology
- The loading spinner features a spinning wand with sparkles
- House cards have hover effects with color-shifting animations

---

*May your code be as magical as the wizarding world! ⚡*
