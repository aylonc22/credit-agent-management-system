# 🧾 Credit & Agent Management System

A full-featured platform for managing agents, clients, credits, and transactions.  
This monorepo contains both the **React-based frontend** and the **Node.js (Express) backend**.

---

## ✨ Features

### 📊 Admin Dashboard
- Real-time stats:
  - Total credits purchased (daily/monthly)
  - Active transactions
  - Active agents
  - Registered clients
- Sidebar menu:
  - Agent Management
  - Client Management
  - Transaction Management
  - Payment Link Generator
  - Reports & Statistics
  - System Settings
- Quick action: **Add New Agent**

---

### 🧑‍💼 Agent Management
- View & search agent list
- Agent details include:
  - ID, name, client count, available credit, status, actions (Edit, Add Credit, Block)
- Add agent form:
  - Name, phone, email, initial credit, username, password
- Manual credit updates
- Credit transfer history

---

### 👥 Client Management (via Agent)
- Client list by agent:
  - ID, name, credit, join date, status, actions
- Add client form:
  - Name, username, phone, initial credit, assign agent
- Update credit manually
- Search by client or agent

---

### 💰 Transaction Management
- View recent transactions:
  - ID, date, agent, client, amount, status, actions
- Filter by date, agent, or client
- View transaction details
- Option to cancel transaction

---

### 🔗 Payment Link Generator
- Accessible via sidebar
- Create personal payment links for clients:
  - Amount, notes, client selector
- Generated link example:
  - `https://mysite.com/payment?id=12345&amount=100`
- Actions:
  - Copy Link
  - Send Link (Email/SMS)
- View link history with filtering

---

### 📈 Reports & Statistics
- Weekly/monthly reports:
  - Revenue by agent
  - New client registrations
  - Success vs. failed transactions
- Export to Excel or PDF

---

### ⚙️ System Settings
- Admin user management:
  - Add new admins
  - Set roles & permissions
- Security settings:
  - Change passwords
  - Password expiry policies
- General UI settings:
  - Logo and background image
  - Welcome messages
  - Terms of use

---

### 🔔 Notifications & Alerts
- Real-time alerts:
  - Completed transactions
  - Blocked agents
  - Client credit requests
- Send messages directly to agents or clients

---

## 🖥️ Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Styling:** Tailwind CSS (recommended)
- **Database:** To be configured (PostgreSQL / MongoDB)
- **Notifications:** Email / SMS integration (optional)

---

## 🎨 UI/UX Principles

- Clean, dark-mode admin interface with intuitive navigation
- Responsive design (desktop, tablet, mobile)
- Secure access with admin-only controls and optional 2FA

---

## 🚀 Getting Started (coming soon)

Instructions to run frontend and backend locally:

```bash
# Clone repo
git clone https://github.com/your-username/credit-agent-management-system.git
cd credit-agent-management-system

# Setup frontend
cd frontend
npm install
npm run dev

# Setup backend
cd ../backend
npm install
node index.js
