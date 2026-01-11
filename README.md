# PantryChef

PantryChef is a full-stack web app that lets users manage a personal pantry and generate AI-powered recipes using the ingredients they already have. Users can generate recipes from their full pantry or a selected subset, then save and manage those recipes in their profile.


## Features
### Authentication & Security
- User registration and login system
- JWT-based authentication with access and refresh tokens
- Protected API routes with middleware authorization
- Secure password hashing with bcrypt

### Pantry Management
- Add pantry items with name, quantity, and unit
- View all pantry items (user-scoped)
- Update existing pantry items
- Delete pantry items
- Real-time inventory tracking

### AI-Powered Recipe Generation
- Generate recipes using **all pantry items**
- Generate recipes from **selected pantry items**
- Powered by **Claude 3 Haiku** via Anthropic API
- Structured JSON recipe responses
- Smart recipe suggestions with optional ingredient additions

### Recipe Management
- Save generated recipes to your account
- View all saved recipes
- Delete saved recipes
- Recipes include: title, ingredients, instructions, cooking time, and difficulty level

---
## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side routing
- **TailwindCSS** for styling
- **Context API** for state management (Auth, Pantry, Generator)

### Backend
- **Node.js** with Express framework
- **PostgreSQL** for data persistence
- **JWT** (`jsonwebtoken`) for authentication
- **bcrypt** for password hashing
- **Anthropic SDK** (`@anthropic-ai/sdk`) for AI integration
---
## Architecture

### API Response Format
All API endpoints follow a consistent response structure:

**Success Response:**
```json
{
  "ok": true,
  "data": { ... },
  "error": null
}
```

**Error Response:**
```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Authentication Flow
1. User logs in and receives access token (1h expiry) and refresh token (7d expiry)
2. Access token is sent with each protected API request
3. On access token expiration, frontend automatically refreshes using refresh token
4. Refresh tokens are stored in the database and invalidated on logout

### Frontend Architecture
- **Vite** development server with hot module replacement
- **Context Providers** for global state management
- **Custom hooks** for API calls with automatic token refresh
- **Protected routes** requiring authentication


---
## Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **PostgreSQL** (local or hosted)
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pantrychef.git
cd pantrychef
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

# Server
PORT=3000

# JWT Secrets (generate random strings for production)
JWT_ACCESS_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Initialize the Database:**
```bash
# Connect to PostgreSQL and run the schema
psql $DATABASE_URL < schema.sql
```

**Start the Backend:**
```bash
npm run dev
# or for production
npm start
```

Backend will run at: `http://localhost:3000`

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

**Start the Frontend:**
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`


---
## 📚 API Documentation

### Authentication Endpoints (Public)

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### Log In
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

#### Refresh Access Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

#### Log Out
```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```



### Pantry Endpoints (Protected)

All pantry endpoints require authentication:
```http
Authorization: Bearer <accessToken>
```

#### Get All Pantry Items
```http
GET /api/pantry
```

#### Add Pantry Item
```http
POST /api/pantry
Content-Type: application/json

{
  "name": "Chicken Breast",
  "quantity": 2,
  "unit": "lbs"
}
```

#### Update Pantry Item
```http
PUT /api/pantry/:itemId
Content-Type: application/json

{
  "name": "Chicken Breast",
  "quantity": 3,
  "unit": "lbs"
}
```

#### Delete Pantry Item
```http
DELETE /api/pantry/:itemId
```



### Recipe Endpoints (Protected)

#### Generate Recipes

**Mode 1: Use All Pantry Items**
```http
POST /api/recipes/generate
Content-Type: application/json

{}
```

**Mode 2: Use Selected Items**
```http
POST /api/recipes/generate
Content-Type: application/json

{
  "mode": "select",
  "selectedItemIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "title": "Garlic Butter Chicken",
      "ingredients_used": ["chicken breast", "garlic", "butter"],
      "optional_additions": ["salt", "pepper", "olive oil"],
      "instructions": [
        "Season chicken with salt and pepper",
        "Heat butter in pan over medium heat",
        "Cook chicken 6-7 minutes per side",
        "Add minced garlic in last 2 minutes"
      ],
      "cooking_time": "20 minutes",
      "difficulty": "easy"
    }
  ],
  "error": null
}
```

#### Get Saved Recipes
```http
GET /api/recipes
```

#### Save Recipe
```http
POST /api/recipes
Content-Type: application/json

{
  "title": "Garlic Butter Chicken",
  "ingredients_used": ["chicken breast", "garlic", "butter"],
  "optional_additions": ["salt", "pepper"],
  "instructions": ["Step 1...", "Step 2..."],
  "cooking_time": "20 minutes",
  "difficulty": "easy"
}
```

#### Delete Saved Recipe
```http
DELETE /api/recipes/:recipeId
```

---
## Database Schema

### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### `pantry_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FOREIGN KEY (users.id) ON DELETE CASCADE |
| name | VARCHAR(255) | NOT NULL |
| quantity | DECIMAL(10,2) | NOT NULL |
| unit | VARCHAR(50) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### `saved_recipes`
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FOREIGN KEY (users.id) ON DELETE CASCADE |
| title | VARCHAR(255) | NOT NULL |
| ingredients_used | JSONB | NOT NULL |
| optional_additions | JSONB | |
| instructions | JSONB | NOT NULL |
| cooking_time | VARCHAR(50) | |
| difficulty | VARCHAR(20) | |
| created_at | TIMESTAMP | DEFAULT NOW() |

### `refresh_tokens`
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FOREIGN KEY (users.id) ON DELETE CASCADE |
| token | TEXT | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |


---
## AI Recipe Generation

### Claude Integration
- Uses **Claude 3 Haiku** model via Anthropic SDK
- Configured to return **JSON-only** responses (no markdown formatting)
- Generates multiple recipe variations from the same ingredients
- Ensures recipes are meaningfully different from each other

### Recipe Generation Rules
1. Recipes must use the specified pantry ingredients
2. Can suggest common staples (oil, water, salt, pepper) as optional additions
3. Difficulty levels: `easy`, `medium`, `hard`
4. Recipes include estimated cooking time
5. Instructions are step-by-step and beginner-friendly


---
## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Refresh tokens stored in database for revocation capability
- CORS configured for frontend origin only
- SQL injection prevention via parameterized queries
- User-scoped data access (users can only see their own data)

---
## CORS Configuration

Backend is configured to accept requests from:
- **Origin:** `http://localhost:5173` (development)
- **Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

For production, update the CORS origin in `backend/server.js`:
```javascript
const corsOptions = {
  origin: 'https://your-production-domain.com',
  credentials: true
};
```


---
## 📁 Project Structure

```
pantrychef/
├── backend/
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── pantryController.js   # Pantry CRUD
│   │   └── recipeController.js   # Recipe generation & storage
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   └── api.js                # Protected routes
│   ├── services/
│   │   └── claudeService.js      # Anthropic API integration
│   ├── .env.example
│   ├── server.js                 # Express app entry point
│   ├── schema.sql                # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── context/              # Context providers
│   │   ├── pages/                # Page components
│   │   ├── utils/                # API utilities
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```


---
## Future Improvements

### High Priority
- [ ] Persist auth session across page refresh
- [ ] Hash refresh tokens in database
- [ ] Implement refresh token rotation
- [ ] Add optimistic UI updates
- [ ] Better loading states and error handling

### Features
- [ ] Pantry item categories (protein, vegetables, spices, etc.)
- [ ] Search and filter pantry items
- [ ] Sort pantry by name, quantity, or date added
- [ ] Recipe favoriting and rating system
- [ ] Share recipes with other users
- [ ] Meal planning calendar
- [ ] Shopping list generation from recipes

### Technical Improvements
- [ ] Migrate frontend to TypeScript
- [ ] Add unit tests (Jest/Vitest)
- [ ] Add integration tests
- [ ] Implement proper logging
- [ ] Add rate limiting
- [ ] Database migrations tool (e.g., Knex.js)
- [ ] API documentation with Swagger/OpenAPI

