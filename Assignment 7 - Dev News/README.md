# 📰 Dev News

A modern, multilingual news platform built with Next.js 14, featuring advanced routing patterns, internationalization, and a beautiful dark-themed UI.

## 🌟 Project Overview

Dev News is a cutting-edge developer news aggregator that showcases the latest trends, tutorials, and insights from the tech world. Built with Next.js 14's App Router, it demonstrates advanced patterns like parallel routing, intercepting routes, and server-side internationalization.

## ✨ Key Features

### Core Functionality

- 📱 **Responsive News Grid** - Browse news articles in a beautiful, card-based layout
- 🔍 **Dynamic News Details** - View full article details with metadata, tags, and author information
- 🌐 **Multi-language Support** - Automatic language detection (English & Bengali) based on browser preferences
- 🎯 **Smart Number Formatting** - Displays views and votes in human-readable format (e.g., 2.5K, 1M)
- 📅 **Relative Dates** - Shows "2 days ago" style timestamps for better readability

### Advanced Routing

- 🎭 **Parallel Routing** - Uses `@modal` slot for seamless modal rendering
- 🔄 **Intercepting Routes** - Opens news details in a modal while updating the URL
- 🔗 **Deep Linking** - Share or bookmark specific news articles
- 🔃 **Graceful Fallback** - Reloading a modal URL shows the full page view

### API Endpoints (Not Connected to UI)

- `GET /api/news` - Retrieve all news articles
- `GET /api/news/[slug]` - Get a specific news article by slug
- `PATCH /api/news/[slug]` - Update article title or description (with field validation)
- `DELETE /api/news/[slug]` - Delete a specific news article

### Error Handling

- 🚫 **General 404 Page** - For non-existent routes
- 📰 **News-Specific 404** - Custom message showing the missing news slug
- ✅ **API Error Handling** - Proper HTTP status codes and error messages

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Custom Properties** - For theming and design tokens

### Internationalization

- **@formatjs/intl-localematcher** - Language matching
- **Negotiator** - HTTP content negotiation
- **server-only** - Ensures dictionary loading happens server-side

### Routing & Navigation

- **Parallel Routes** - For modal overlay patterns
- **Intercepting Routes** - For seamless navigation UX
- **Dynamic Routes** - For news detail pages

### Data Management

- **Dynamic Imports** - For data.json (no fetch/axios)
- **File System** - Node.js fs module for API operations

## 📁 Project Structure

```
dev-news/
├── app/
│   ├── [lang]/                          # Language-based routing
│   │   ├── @modal/                      # Parallel route slot for modals
│   │   │   ├── (.)news/[slug]/         # Intercepting route for modal view
│   │   │   │   └── page.js
│   │   │   └── default.js               # Returns null when no modal active
│   │   ├── dictionaries/                # Translation files
│   │   │   ├── en.json                  # English translations
│   │   │   └── bn.json                  # Bengali translations
│   │   ├── news/[slug]/                 # Full page news details
│   │   │   ├── page.js
│   │   │   └── not-found.js             # News-specific 404
│   │   ├── dictionaries.js              # Dictionary loader
│   │   ├── layout.js                    # Handles parallel routing
│   │   └── page.js                      # Main news list page
│   ├── api/
│   │   └── news/
│   │       ├── route.js                 # GET all news
│   │       └── [slug]/
│   │           └── route.js             # GET, PATCH, DELETE single news
│   ├── fonts/                           # Custom fonts
│   ├── globals.css                      # Global styles with CSS variables
│   ├── layout.js                        # Root layout
│   ├── not-found.js                     # General 404 page
│   └── page.js                          # Root redirect to /en
├── components/
│   ├── Header.jsx                       # Site header with search
│   ├── Modal.jsx                        # Reusable modal component
│   ├── NewsCard.jsx                     # Individual news card
│   ├── NewsDetails.jsx                  # News detail view
│   └── NewsList.jsx                     # News grid container
├── lib/
│   └── utils.js                         # Utility functions (formatCount, formatDate)
├── public/
│   ├── data.json                        # News data source
│   └── images/                          # News images and avatars
├── middleware.js                        # Language detection & redirect
├── next.config.mjs                      # Next.js configuration
├── tailwind.config.js                   # Tailwind CSS configuration
└── package.json                         # Dependencies and scripts
```

## 🏗️ Component Architecture

### Component Hierarchy

```
App
├── RootLayout
│   └── [lang]
│       ├── LangLayout (handles parallel routing)
│       │   ├── @modal slot
│       │   │   └── (.)news/[slug] (Intercepting Route)
│       │   │       └── Modal
│       │   │           └── NewsDetails
│       │   └── children
│       │       └── Page (News List)
│       │           ├── Header
│       │           └── NewsList
│       │               └── NewsCard (multiple)
│       └── news/[slug]
│           └── NewsDetails (full page view)
```

### Component Responsibilities

#### **Layouts**

- `RootLayout` - Provides modal root container and global HTML structure
- `LangLayout` - Manages parallel routing with `{children, modal}` props

#### **Page Components**

- `[lang]/page.js` - Main news list page with background effects
- `news/[slug]/page.js` - Full page view for news details
- `@modal/(.)news/[slug]/page.js` - Modal view using intercepting routes

#### **UI Components**

- `Header` - Logo, site title, search bar, and user profile
- `NewsList` - Grid container for news cards with heading
- `NewsCard` - Individual news preview with image, metadata, tags, and stats
- `NewsDetails` - Complete news article with sidebar (engagement, tags, author)
- `Modal` - Reusable modal with close button and portal rendering

#### **Utility Modules**

- `dictionaries.js` - Loads language-specific translations
- `utils.js` - Format numbers (2.5K), dates, and calculate relative time

## 🚀 How to Run Locally

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dev-news
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

   The app will automatically detect your browser's language and redirect to either `/en` or `/bn`.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🧪 Testing API Endpoints

### Get All News

```bash
curl http://localhost:3000/api/news
```

### Get Single News

```bash
curl http://localhost:3000/api/news/the-css-if-function-has-arrived
```

### Update News (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/news/the-css-if-function-has-arrived \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "description": "Updated description"}'
```

### Delete News

```bash
curl -X DELETE http://localhost:3000/api/news/the-css-if-function-has-arrived
```

### Invalid PATCH (Will Return Error)

```bash
curl -X PATCH http://localhost:3000/api/news/some-slug \
  -H "Content-Type: application/json" \
  -d '{"author_name": "New Author"}'  # Error: Invalid field
```

## 🎨 Design Features

### Visual Elements

- **Dark Theme** - Professional dark color scheme with cyan/emerald accents
- **Glassmorphism** - Semi-transparent cards with backdrop blur effects
- **Gradient Borders** - Subtle gradient borders on cards and buttons
- **Ambient Glow** - Radial gradient background effects for depth
- **Noise Texture** - Subtle grain overlay for premium feel
- **Smooth Animations** - Fade-up reveal animations and hover effects

### Typography

- **DM Sans** - Primary font for body text
- **Sora** - Display font for headings
- Responsive sizing with proper hierarchy

### Responsive Design

- Mobile-first approach
- 3-column grid on desktop
- 2-column grid on tablet
- 1-column grid on mobile

## 🔮 Future Improvement Plans

### Features

- [ ] **Search Functionality** - Full-text search across news articles
- [ ] **Filtering** - Filter by tags, date range, author
- [ ] **Sorting** - Sort by date, popularity, votes
- [ ] **Pagination** - Infinite scroll or page-based pagination
- [ ] **User Authentication** - Login/signup with JWT
- [ ] **Voting System** - Interactive upvote/downvote buttons
- [ ] **Comments** - User comments on news articles
- [ ] **Bookmarks** - Save articles for later reading
- [ ] **Dark/Light Mode Toggle** - User preference for theme
- [ ] **Share Functionality** - Social media sharing buttons

### Technical Improvements

- [ ] **Database Integration** - Replace JSON with PostgreSQL/MongoDB
- [ ] **Image Optimization** - Use Next.js Image component throughout
- [ ] **Caching Strategy** - Implement ISR (Incremental Static Regeneration)
- [ ] **SEO Optimization** - Add metadata, sitemap, robots.txt
- [ ] **Analytics** - Integrate Google Analytics or Plausible
- [ ] **Error Boundary** - Better error handling in React
- [ ] **Testing** - Unit tests (Jest) and E2E tests (Playwright)
- [ ] **Accessibility** - WCAG 2.1 AA compliance audit
- [ ] **Performance** - Lighthouse score optimization
- [ ] **PWA** - Progressive Web App capabilities

### Content Management

- [ ] **Admin Dashboard** - CRUD operations for news articles
- [ ] **Rich Text Editor** - Better content editing experience
- [ ] **Image Upload** - Upload and manage images
- [ ] **Draft System** - Save articles as drafts before publishing
- [ ] **Scheduled Publishing** - Schedule articles for future dates

### Internationalization

- [ ] **More Languages** - Add support for additional languages
- [ ] **RTL Support** - Right-to-left language support
- [ ] **Translation UI** - In-app translation management

## 📄 License

This project is created for educational purposes.

## 👤 Author

**Shuvra**

## 🙏 Acknowledgments

- Design inspiration from modern developer platforms
- Next.js team for excellent documentation
- Learn with Sumit for project requirements
