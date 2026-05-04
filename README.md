# Aviator Frontend

A React-based frontend for the Aviator multiplayer betting game. Build with Vite for fast development and real-time gameplay using WebSocket connections.

## Features

- **User Authentication**: Login and registration system with protected routes
- **Real-time Gameplay**: WebSocket-based communication for live game updates
- **Multiplier Display**: Dynamic multiplier tracking during game rounds
- **Betting System**: Intuitive bet panel for placing and managing bets
- **Wallet Management**: User balance tracking and transaction history
- **Responsive Design**: Modern UI components for desktop and mobile

## Tech Stack

- **React 19.2** - UI framework
- **Vite** - Build tool with HMR
- **React Router 7.14** - Client-side routing
- **Socket.IO** - Real-time communication
- **CSS** - Styling

## Project Structure

```
src/
├── api/              # API client configuration
├── components/       # Reusable React components
│   ├── BetPanel      # Betting interface
│   ├── GameCanvas    # Main game rendering
│   ├── Multiplier    # Multiplier display
│   ├── Navbar        # Navigation bar
│   └── WalletManager # Balance management
├── context/          # React Context API
│   └── AuthContext   # Authentication state
├── hooks/            # Custom React hooks
│   └── useSocket     # WebSocket integration
├── pages/            # Page components
│   ├── Game          # Main game page
│   ├── Login         # Login page
│   └── Register      # Registration page
├── routes/           # Route components
│   └── ProtectedRoute # Auth-protected routes
└── styles/           # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

```bash
# Build for production
npm build
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Authentication Flow

1. User registers or logs in via `/register` or `/login`
2. Valid credentials grant access to protected routes
3. Authenticated users can access the game at `/game`
4. Session managed via AuthContext

## API Integration

API requests are configured in `src/api/api.js`. The frontend communicates with the backend for:
- User authentication
- Balance management
- Game state updates

## Real-time Communication

Socket.IO is used to handle real-time events:
- Multiplier updates during active rounds
- Player bet confirmations
- Game state changes
- Payout notifications

See `src/hooks/useSocket.js` for WebSocket integration details.

## 🌐 Live Deployment

**Frontend**: https://aviator-frontend-eta.vercel.app (Hosted on Vercel)

**Backend**: Hosted on Render

**⚠️ Important Note**: The backend is deployed on a free tier hosting service. Please allow **10-15 minutes for the server to start up** on first access. Subsequent requests will be faster. This is normal behavior for free tier deployments.

