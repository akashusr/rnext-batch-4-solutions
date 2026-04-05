# CoderFlix - Video Streaming Platform

A modern video streaming platform built with Next.js 14, featuring a clean UI inspired by popular streaming services. CoderFlix allows users to browse coding-related videos and discover similar content based on categories.

## 🎯 Project Description

CoderFlix is a video discovery and viewing platform designed specifically for coding and technology enthusiasts. The application provides a seamless experience for browsing, searching, and watching educational videos. Built with Next.js 14 and styled with Tailwind CSS, it offers a responsive design that works flawlessly across all devices.

## ✨ Features

- **Video Grid Layout**: Browse videos in a responsive grid format on the home page
- **Dynamic Video Details**: Click on any video to view detailed information including:
  - Embedded YouTube player
  - Video metadata (views, publish date, duration)
  - Channel information
  - Like/Dislike counts
  - Video categories
- **Smart URL Routing**: SEO-friendly URLs based on video titles (e.g., `/video/how-to-build-an-app`)
- **Similar Videos**: Intelligent recommendation system that suggests related videos based on shared categories
- **Direct URL Access**: Navigate directly to any video page via URL without navigation
- **404 Handling**: Custom "Not Found" page when a video doesn't exist
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Modern UI**: Dark theme with smooth transitions and hover effects
- **Image Optimization**: Next.js Image component for optimized loading

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (React 18)
- **Styling**: Tailwind CSS
- **Font**: Google Fonts (Roboto)
- **Image Optimization**: Next.js Image component
- **Data Source**: Static JSON file
- **Video Player**: YouTube Embed API

## 📁 Project Structure

```
coderflix/
├── app/
│   ├── video/
│   │   └── [slug]/
│   │       ├── page.js           # Dynamic video details page
│   │       └── not-found.js      # Custom 404 page for videos
│   ├── layout.js                 # Root layout with metadata
│   ├── page.js                   # Home page with video grid
│   ├── globals.css               # Global styles and CSS variables
│   └── favicon.ico               # Site favicon
├── components/
│   ├── Header.js                 # Reusable header component
│   ├── VideoCard.js              # Video card for grid layout
│   └── VideoCardHorizontal.js   # Horizontal video card for sidebar
├── lib/
│   └── utils.js                  # Utility functions
├── data/
│   └── videos.json               # Video data source
├── public/
│   └── Logo.svg                  # CoderFlix logo
├── html/                         # Original HTML templates (reference)
│   ├── index.html
│   └── details.html
├── next.config.mjs               # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── package.json                  # Project dependencies
└── README.md                     # Project documentation
```

## 🏗️ Component Architecture

### **Page Components**

1. **Home Page (`app/page.js`)**

   - Fetches all videos from JSON
   - Renders video grid using VideoCard components
   - Server-side rendered for better SEO

2. **Video Details Page (`app/video/[slug]/page.js`)**

   - Dynamic route based on video title slug
   - Fetches specific video by slug
   - Displays similar videos in sidebar
   - Handles 404 for non-existent videos

3. **Not Found Page (`app/video/[slug]/not-found.js`)**
   - Custom 404 page for missing videos
   - Provides navigation back to home

### **Reusable Components**

1. **Header (`components/Header.js`)**

   - Site navigation and branding
   - Search bar (UI only)
   - User actions (notifications, profile)
   - Used across all pages

2. **VideoCard (`components/VideoCard.js`)**

   - Displays video thumbnail, title, and metadata
   - Used in grid layout on home page
   - Optimized images with Next.js Image
   - Hover effects for better UX

3. **VideoCardHorizontal (`components/VideoCardHorizontal.js`)**
   - Compact horizontal layout
   - Used for similar videos sidebar
   - Same functionality as VideoCard but different layout

### **Utility Functions (`lib/utils.js`)**

- `generateSlug()`: Converts video titles to URL-friendly slugs
- `getAllVideos()`: Fetches all videos from JSON
- `getVideoBySlug()`: Finds specific video by slug
- `getSimilarVideos()`: Recommends videos based on category matching
- `formatNumber()`: Formats numbers to K/M notation

## 🚀 How to Run Locally

### Prerequisites

- Node.js 18.17 or higher
- npm or yarn package manager

### Installation Steps

1. **Clone or download the project**

   ```bash
   cd coderflix
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

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 🎨 Key Features Explained

### Dynamic Routing & Slug Generation

Videos are accessible via clean URLs like `/video/how-to-build-an-app`. The slug is generated from the video title by:

- Converting to lowercase
- Removing special characters
- Replacing spaces with hyphens
- Ensuring uniqueness

### Similar Videos Algorithm

The recommendation system:

1. Extracts categories from the current video
2. Finds all videos sharing at least one category
3. Calculates match score based on number of shared categories
4. Sorts by relevance (most shared categories first)
5. Returns top 10 matches

### Image Optimization

Uses Next.js Image component for:

- Automatic lazy loading
- Responsive images
- WebP format when supported
- Proper sizing for different viewports

## 🔮 Future Improvement Plans

### Phase 1: Enhanced User Experience

- [ ] Implement functional search with filtering
- [ ] Add video bookmarking/favorites
- [ ] Create playlist functionality
- [ ] Add watch history tracking
- [ ] Implement dark/light theme toggle

### Phase 2: Advanced Features

- [ ] User authentication and profiles
- [ ] Comment system for videos
- [ ] Video rating system
- [ ] Advanced filtering (by category, duration, date)
- [ ] Pagination or infinite scroll for large datasets

### Phase 3: Performance & Scalability

- [ ] Implement server-side API instead of static JSON
- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] Implement caching strategy (Redis)
- [ ] Add video upload functionality
- [ ] Integrate with multiple video platforms

### Phase 4: Social Features

- [ ] Share videos on social media
- [ ] Subscribe to channels
- [ ] Video recommendations based on watch history
- [ ] Trending videos section
- [ ] User-generated playlists

### Phase 5: Analytics & Monetization

- [ ] View analytics dashboard
- [ ] Video performance metrics
- [ ] Advertisement integration
- [ ] Premium subscription model
- [ ] Content creator dashboard

## 📝 Design Decisions

1. **Next.js App Router**: Chosen for better performance, automatic code splitting, and improved routing
2. **Static JSON Data**: Simplifies initial development without backend dependency
3. **Tailwind CSS**: Enables rapid UI development with utility-first approach
4. **Component-Based Architecture**: Promotes reusability and maintainability
5. **SEO-Friendly URLs**: Improves discoverability and sharing

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment with new features!

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as part of Learn With Sumit - Module 7 Assignment

---

**Note**: This project uses YouTube embeds for video playback. Ensure you have a stable internet connection for the best experience.
