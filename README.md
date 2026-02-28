# RenovateIQ — Backend API

> RESTful API server for the RenovateIQ Home Renovation Tracker, built with Node.js, Express, and Supabase.

---

## Project Overview

RenovateIQ Backend is a secure REST API that powers the RenovateIQ home renovation management platform. It handles all data operations including project management, task tracking, expense monitoring, contractor management, permits, inventory, shopping lists, and maintenance scheduling. All routes are protected with JWT-based authentication via Supabase Auth.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js v4 | Web framework |
| Supabase | PostgreSQL database + Authentication |
| @supabase/supabase-js | Supabase client library |
| dotenv | Environment variable management |
| helmet | HTTP security headers |
| cors | Cross-Origin Resource Sharing |
| express-rate-limit | API rate limiting |
| multer | File upload handling |
| jspdf + jspdf-autotable | PDF report generation |
| nodemon | Development auto-restart |
| Render | Cloud deployment platform |

---

## Deployment Link

 **Live API:** [https://homerenovation-backend.onrender.com](https://homerenovation-backend.onrender.com)

**Health Check:** [https://homerenovation-backend.onrender.com/api/health](https://homerenovation-backend.onrender.com/api/health)

> **Note:** The backend is hosted on Render's free tier. It may take 30–60 seconds to respond on the first request after inactivity.

---

## Installation Steps

### Prerequisites
- Node.js v18 or higher
- npm
- Supabase account and project

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Sarithatammineni/HomeRenovation_backend.git

# 2. Navigate into the project folder
cd HomeRenovation_backend

# 3. Install dependencies
npm install

# 4. Create a .env file in the root directory
touch .env
```

Add the following to your `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# 5. Start the development server
npm run dev

# OR start the production server
npm start
```

The API will be running at `http://localhost:4000`

---

## Authentication

All API routes (except `/api/health`) are protected using **Supabase JWT authentication**.

Every request must include the Authorization header:

```
Authorization: Bearer <supabase_access_token>
```

The token is validated using the Supabase `auth.getUser()` method. If the token is missing, invalid, or expired, the API returns:

```json
{ "error": "Unauthorized — invalid or expired token" }
```

---

##  API Documentation

### Base URL
```
https://homerenovation-backend.onrender.com/api
```

---

###  Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check if the API is running |

**Response:**
```json
{
  "status": "ok",
  "service": "RenovateIQ API",
  "version": "2.0.0",
  "timestamp": "2026-02-28T00:00:00.000Z"
}
```

---

###  Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects for logged-in user |
| GET | `/api/projects/:id` | Get a single project with tasks, expenses, permits, shopping items |
| POST | `/api/projects` | Create a new project |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

**POST /api/projects — Request Body:**
```json
{
  "name": "Kitchen Renovation",
  "description": "Full kitchen remodel",
  "budget": 15000,
  "deadline": "2026-06-30",
  "status": "planning",
  "color": "#c17b3a",
  "progress": 0
}
```

---

###  Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (filter by `project_id`, `priority`, `status`) |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

**POST /api/tasks — Request Body:**
```json
{
  "name": "Install new cabinets",
  "project_id": "uuid",
  "priority": "high",
  "status": "todo",
  "assignee": "John Doe",
  "due_date": "2026-04-15",
  "description": "Install upper and lower cabinets"
}
```

**Query Filters:**
```
GET /api/tasks?project_id=uuid
GET /api/tasks?priority=high
GET /api/tasks?status=in_progress
```

---

###  Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses (filter by `project_id`) |
| GET | `/api/expenses/summary` | Get expense totals by category and project |
| POST | `/api/expenses` | Create a new expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

**POST /api/expenses — Request Body:**
```json
{
  "description": "Granite countertops",
  "project_id": "uuid",
  "category": "Materials",
  "amount": 3500,
  "expense_date": "2026-03-01"
}
```

**Categories:** `Materials`, `Labour`, `Equipment`, `Permits`, `Design`, `Other`

---

###  Contractors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contractors` | Get all contractors |
| POST | `/api/contractors` | Add a new contractor |
| PATCH | `/api/contractors/:id` | Update a contractor |
| DELETE | `/api/contractors/:id` | Delete a contractor |

**POST /api/contractors — Request Body:**
```json
{
  "name": "Mike Johnson",
  "trade": "Plumbing",
  "company": "Johnson Plumbing LLC",
  "phone": "555-1234",
  "email": "mike@johnsonplumbing.com",
  "rating": 5,
  "notes": "Reliable and punctual"
}
```

---

### Shopping Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shopping` | Get all shopping items (filter by `project_id`) |
| POST | `/api/shopping` | Add a shopping item |
| PATCH | `/api/shopping/:id` | Update a shopping item |
| DELETE | `/api/shopping/:id` | Delete a shopping item |

**POST /api/shopping — Request Body:**
```json
{
  "name": "Paint brushes",
  "project_id": "uuid",
  "quantity": "5",
  "unit": "pieces",
  "estimated_cost": 25.00,
  "purchased": false
}
```

---

###  Inventory

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get all inventory items |
| POST | `/api/inventory` | Add an inventory item |
| PATCH | `/api/inventory/:id` | Update an inventory item |
| DELETE | `/api/inventory/:id` | Delete an inventory item |

**POST /api/inventory — Request Body:**
```json
{
  "name": "Power Drill",
  "category": "Tools",
  "quantity": 1,
  "unit": "piece",
  "condition": "Good",
  "location": "Garage shelf 2",
  "notes": "Needs new battery"
}
```

**Conditions:** `New`, `Good`, `Fair`, `Poor`

---

### Permits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/permits` | Get all permits (filter by `project_id`) |
| POST | `/api/permits` | Add a new permit |
| PATCH | `/api/permits/:id` | Update a permit |
| DELETE | `/api/permits/:id` | Delete a permit |

**POST /api/permits — Request Body:**
```json
{
  "name": "Building Permit",
  "project_id": "uuid",
  "issuer": "City of Springfield",
  "status": "pending",
  "expiry_date": "2026-12-31",
  "notes": "Applied on Feb 1"
}
```

**Statuses:** `required`, `pending`, `approved`

---

### Maintenance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/maintenance` | Get all maintenance schedules |
| POST | `/api/maintenance` | Add a maintenance task |
| PATCH | `/api/maintenance/:id` | Update a maintenance task |
| DELETE | `/api/maintenance/:id` | Delete a maintenance task |

**POST /api/maintenance — Request Body:**
```json
{
  "name": "HVAC Filter Replacement",
  "description": "Replace air filters",
  "frequency": "Every 3 months",
  "last_date": "2025-12-01",
  "next_date": "2026-03-01",
  "notes": "Use MERV-11 filters"
}
```

---

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | Get all project templates |

**Available Templates:**
- Kitchen Remodel
- Bathroom Renovation
- Deck Build
- Bedroom Repaint
- Flooring Replacement

---

## Database Schema

The database is hosted on **Supabase (PostgreSQL)** with **Row Level Security (RLS)** enabled on all tables. Each user can only access their own data.

---

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | References auth.users |
| full_name | text | User's full name |
| avatar_url | text | Profile picture URL |
| created_at | timestamptz | Account creation time |

---

### projects
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique project ID |
| user_id | uuid (FK) | References profiles |
| name | text | Project name |
| description | text | Project description |
| status | text | planning / active / paused / completed |
| budget | numeric | Total project budget |
| color | text | UI color hex code |
| progress | int | Progress percentage (0–100) |
| deadline | date | Target completion date |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

---

### tasks
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique task ID |
| project_id | uuid (FK) | References projects |
| user_id | uuid (FK) | References profiles |
| name | text | Task name |
| description | text | Task details |
| priority | text | low / medium / high |
| status | text | todo / in_progress / done |
| assignee | text | Person assigned to task |
| due_date | date | Task due date |
| created_at | timestamptz | Creation timestamp |

---

### expenses
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique expense ID |
| project_id | uuid (FK) | References projects |
| user_id | uuid (FK) | References profiles |
| description | text | Expense description |
| category | text | Materials / Labour / Equipment / Permits / Design / Other |
| amount | numeric | Expense amount |
| expense_date | date | Date of expense |
| created_at | timestamptz | Creation timestamp |

---

### shopping_items
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique item ID |
| project_id | uuid (FK) | References projects |
| user_id | uuid (FK) | References profiles |
| name | text | Item name |
| quantity | text | Amount needed |
| unit | text | Unit of measurement |
| estimated_cost | numeric | Estimated price |
| purchased | boolean | Whether item is purchased |
| created_at | timestamptz | Creation timestamp |

---

### contractors
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique contractor ID |
| user_id | uuid (FK) | References profiles |
| name | text | Contractor name |
| trade | text | Specialization (e.g. Plumbing) |
| company | text | Company name |
| phone | text | Contact phone |
| email | text | Contact email |
| rating | int | Rating 1–5 |
| notes | text | Additional notes |
| created_at | timestamptz | Creation timestamp |

---

### inventory
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique inventory ID |
| user_id | uuid (FK) | References profiles |
| name | text | Item name |
| category | text | Item category |
| quantity | int | Quantity in stock |
| unit | text | Unit of measurement |
| condition | text | New / Good / Fair / Poor |
| location | text | Storage location |
| notes | text | Additional notes |
| created_at | timestamptz | Creation timestamp |

---

### permits
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique permit ID |
| project_id | uuid (FK) | References projects |
| user_id | uuid (FK) | References profiles |
| name | text | Permit name |
| issuer | text | Issuing authority |
| status | text | required / pending / approved |
| expiry_date | date | Permit expiry date |
| notes | text | Additional notes |
| created_at | timestamptz | Creation timestamp |

---

### maintenance
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique maintenance ID |
| user_id | uuid (FK) | References profiles |
| name | text | Maintenance task name |
| description | text | Task description |
| frequency | text | How often (e.g. Monthly) |
| last_date | date | Last completed date |
| next_date | date | Next scheduled date |
| notes | text | Additional notes |
| created_at | timestamptz | Creation timestamp |

---

### templates
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Unique template ID |
| name | text | Template name |
| description | text | Template description |
| tasks | jsonb | Array of predefined tasks |
| is_public | boolean | Publicly available |
| created_at | timestamptz | Creation timestamp |

---

##  Project Structure

```
HomeRenovation_backend/
├── lib/
│   └── supabase.js         # Supabase client initialization
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   ├── projects.js         # Project CRUD routes
│   ├── tasks.js            # Task CRUD routes
│   ├── expenses.js         # Expense CRUD routes
│   ├── shopping.js         # Shopping list routes
│   ├── contractors.js      # Contractor CRUD routes
│   ├── inventory.js        # Inventory CRUD routes
│   ├── permits.js          # Permit CRUD routes
│   ├── maintenance.js      # Maintenance CRUD routes
│   └── templates.js        # Project templates routes
├── .env                    # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js               # Main Express server entry point
```

---

##  Available Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

---

##  Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (keep secret!) |
| `PORT` | Server port (default: 4000, Render uses 10000) |
| `NODE_ENV` | Environment (development / production) |
| `FRONTEND_URL` | Allowed CORS origin URL |

---

##  Author

**Sarithatammineni**
- GitHub: [@Sarithatammineni](https://github.com/Sarithatammineni)
