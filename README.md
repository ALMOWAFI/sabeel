# Sabeel Platform v2.0 - Islamic Knowledge Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)

A comprehensive Islamic Knowledge Platform rebuilt from the ground up with modern web technologies. Features Canvas LMS integration, real-time collaboration, advanced authentication, and performance optimizations.

## 🚀 Features

### ✅ Modern Architecture
- **React 18** with TypeScript for robust frontend development
- **Vite** for lightning-fast build and development experience
- **Zustand** for lightweight and performant state management
- **TanStack Query** for efficient server state management
- **React Router** for client-side routing

### ✅ Authentication & Authorization
- **Multi-provider OAuth** (Canvas LMS, JupyterHub, Google, Microsoft)
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (Student, Instructor, Admin, Scholar, Moderator)
- **Secure session management** with proper token storage

### ✅ UI/UX Excellence
- **Tailwind CSS** with custom Islamic-themed design system
- **Radix UI** components for accessibility and consistent design
- **Framer Motion** for smooth animations and transitions
- **Arabic & English typography** support with proper RTL handling
- **Dark/Light theme** support with system preference detection

### ✅ Canvas LMS Integration
- **Real API connections** with rate limiting and error handling
- **Course and assignment management** with Islamic content enhancement
- **OAuth authentication** flow with Canvas LMS
- **Performance caching** for optimal API usage

### ✅ Real-time Collaboration
- **WebSocket-based** document collaboration
- **Live cursor tracking** and user presence indicators
- **Comment and annotation** system
- **Conflict resolution** for concurrent editing

### ✅ Performance Optimizations
- **Multi-level caching** strategies (LRU, FIFO, TTL)
- **Request batching** and deduplication
- **Lazy loading** with proper code splitting
- **Image optimization** with WebP support

## 🏗️ Project Structure

```
sabeel-v2/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── canvas/          # Canvas LMS integration components
│   │   ├── collaboration/   # Real-time collaboration components
│   │   └── knowledge/       # Knowledge graph components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components
│   ├── services/            # API and business logic services
│   ├── store/               # State management (Zustand stores)
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helper functions
├── public/                  # Static assets
├── docs/                    # Documentation
└── tests/                   # Test files
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure your environment variables:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Canvas LMS Configuration
VITE_CANVAS_API_URL=https://canvas.instructure.com/api/v1
VITE_CANVAS_CLIENT_ID=your_canvas_client_id
VITE_CANVAS_CLIENT_SECRET=your_canvas_client_secret
VITE_CANVAS_REDIRECT_URI=http://localhost:3000/auth/canvas/callback

# JupyterHub Configuration
VITE_JUPYTER_API_URL=https://your-jupyter-hub.com/hub/api
VITE_JUPYTER_CLIENT_ID=your_jupyter_client_id
VITE_JUPYTER_CLIENT_SECRET=your_jupyter_client_secret

# Authentication Configuration
VITE_JWT_SECRET=your_jwt_secret_key_here
VITE_JWT_EXPIRES_IN=24h
VITE_OAUTH_STATE_SECRET=your_oauth_state_secret

# WebSocket Configuration
VITE_WS_URL=ws://localhost:8080
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sabeel-platform/sabeel-v2.git
cd sabeel-v2
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Start WebSocket server (in separate terminal):
```bash
npm run ws-server
```

5. Open browser to `http://localhost:3000`

## 📚 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - TypeScript type checking
- `npm run ws-server` - Start WebSocket server
- `npm start` - Start both dev server and WebSocket server

### Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting (auto-configured with Tailwind)
- **Conventional Commits** for commit messages

### Testing

- **Vitest** for unit and integration testing
- **Testing Library** for component testing
- **Coverage reports** with v8

## 🎨 Design System

### Islamic Theme Colors

```css
islamic: {
  50: '#f0f9f7',   /* Light background */
  100: '#dbf0eb',  /* Very light accent */
  200: '#bbe1d8',  /* Light accent */
  300: '#8fcac0',  /* Medium light */
  400: '#5daba2',  /* Medium */
  500: '#429087',  /* Primary */
  600: '#337369',  /* Dark primary */
  700: '#2a5c55',  /* Darker */
  800: '#234a45',  /* Very dark */
  900: '#1f3e3a',  /* Darkest */
}
```

### Typography

- **Amiri** - Arabic content and general Islamic text
- **Scheherazade New** - Quranic verses and formal Arabic
- **Inter** - English content and UI elements

### Responsive Breakpoints

- `sm: 640px` - Small tablets
- `md: 768px` - Tablets  
- `lg: 1024px` - Laptops
- `xl: 1280px` - Desktops
- `2xl: 1536px` - Large screens

## 🔐 Authentication Flow

1. **Email/Password**: Standard authentication with JWT tokens
2. **OAuth Providers**: Canvas LMS, JupyterHub, Google, Microsoft
3. **Token Management**: Automatic refresh with secure storage
4. **Role-based Access**: Different permissions based on user roles

## 🌐 API Integration

### Canvas LMS
- Course and assignment management
- Gradebook integration
- OAuth authentication
- Rate limiting and caching

### JupyterHub
- Notebook management
- User authentication
- Resource allocation

### Real-time Features
- WebSocket connections
- Live collaboration
- Presence indicators
- Auto-reconnection

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- Configure production environment variables
- Set up SSL certificates
- Configure domain and routing
- Set up database migrations

### Recommended Platforms
- **Vercel** - For frontend deployment
- **Railway** - For backend services  
- **Supabase** - For database and authentication
- **CloudFlare** - For CDN and DNS

## � Performance

### Optimization Features
- Code splitting with dynamic imports
- Image optimization and lazy loading
- Service worker for caching
- Bundle analysis and optimization
- WebP image format support

### Monitoring
- Performance metrics tracking
- Error boundary handling
- Analytics integration ready
- Real-time performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Run linting (`npm run lint:fix`)
7. Commit with conventional commit format
8. Push to your branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Canvas LMS API and community
- Supabase for backend infrastructure
- Radix UI for accessible components
- Islamic scholarly sources and references
- Open source community for excellent libraries

---

**Built with ❤️ for the Islamic education community**