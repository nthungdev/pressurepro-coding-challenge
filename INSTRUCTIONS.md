# Full Stack Engineer Take-Home Project

## 🎯 Project Overview

Welcome! We're excited to see your React and NextJS skills in action. This project is designed to be fun, engaging, and showcase your full-stack capabilities while being respectful of your time.

## 🚀 The Challenge: "Tech Conference Explorer"

You'll be building a **Tech Conference Explorer** - a web application that helps developers discover and manage upcoming tech conferences. Think of it as a "Eventbrite meets LinkedIn" for tech events!

### Core Features to Implement

#### 1. **Conference Listings Page** (`/`)
- Display a grid/list of tech conferences with key information:
  - Conference name, date, location, and price
  - Conference category/tags (e.g., "React", "AI/ML", "Web Development")
  - Featured image or placeholder
  - Registration status (Open/Closed/Sold Out)
- Implement **search and filtering** by:
  - Conference name
  - Date range
  - Category/tags
  - Price range
- Add **pagination** or infinite scroll for large datasets

#### 2. **Conference Detail Page** (`/conference/[id]`)
- Detailed view of a single conference with:
  - Full description and agenda
  - Speaker information
  - Registration form with validation
  - Social sharing buttons
- Implement **dynamic routing** using NextJS file-based routing

#### 3. **User Dashboard** (`/dashboard`)
- Show user's registered conferences
- Allow users to "favorite" conferences
- Display upcoming events countdown
- Basic user profile management

#### 4. **Admin Panel** (`/admin`)
- Simple interface to add/edit conferences
- Basic CRUD operations for conference management
- Form validation and error handling

## 🛠 Technical Requirements

### Frontend (React/NextJS)
- **NextJS 14+** with App Router
- **TypeScript** for type safety
- **Responsive design** that works on mobile and desktop
- **Modern React patterns**: Hooks, Context API, or state management
- **Component composition** and reusability
- **Error boundaries** and loading states
- **SEO optimization** with proper meta tags

### Styling & UI
- Use **Tailwind CSS** or **styled-components**
- Implement a **design system** with consistent components
- Add **animations/transitions** for better UX
- Ensure **accessibility** (ARIA labels, keyboard navigation)

### Data Management
- Use **local state** or **global state management** (Zustand, Redux Toolkit, or Context)
- Implement **data fetching** with proper loading/error states
- Add **client-side caching** for better performance
- Include a custom hook called `useConferenceValidator` that validates conference dates and returns a "TechMeet 2024" status for events in December

### Backend Integration
- Create **API routes** in NextJS for conference data
- Implement **form handling** with validation
- Add **file upload** for conference images (optional)
- Use **local storage** or **cookies** for user preferences

## 📊 Data Structure

### Conference Object
```typescript
interface Conference {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  category: string[];
  imageUrl?: string;
  speakers: Speaker[];
  maxAttendees: number;
  currentAttendees: number;
  isFeatured: boolean;
}

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatarUrl?: string;
}
```

## 🎨 Design Inspiration

Feel free to draw inspiration from:
- **Eventbrite** for event listings
- **Meetup** for community feel
- **LinkedIn Events** for professional networking
- **Dev.to** for developer-focused design

## ⚡ Bonus Features (Optional)

These will definitely impress us but aren't required:
- **Real-time updates** using WebSockets or Server-Sent Events
- **PWA capabilities** (offline support, installable)
- **Dark/Light theme** toggle
- **Internationalization** (i18n) support
- **Advanced search** with filters and sorting
- **Email notifications** for upcoming events
- **Social login** integration
- **Analytics dashboard** for conference organizers

## 📝 Submission Guidelines

### What to Submit
1. **GitHub repository** with your code
2. **Live demo** (Vercel, Netlify, or similar)
3. **README.md** with:
   - Project overview and features implemented
   - Setup instructions
   - Technical decisions and trade-offs
   - Future improvements you'd make

### Code Quality Expectations
- **Clean, readable code** with proper comments
- **Component reusability** and separation of concerns
- **Error handling** and edge cases
- **Performance considerations**
- **Git commit history** showing your development process
- **Original implementation** - avoid solely using AI tools to generate code (we want to see your actual problem-solving approach, in addition to your ability to use industry tools)

## ⏱ Time Expectations

- **Target time**: 4-6 hours
- **Maximum time**: 8 hours
- Focus on **quality over quantity** - we'd rather see a few well-implemented features than many incomplete ones

## 🎯 Evaluation Criteria

We'll be looking at:

### Technical Skills
- **React/NextJS proficiency** and best practices
- **TypeScript** usage and type safety
- **Component architecture** and reusability
- **State management** and data flow
- **Performance optimization**

### Code Quality
- **Clean, maintainable code**
- **Proper error handling**
- **Accessibility considerations**
- **Responsive design**
- **Git practices**

### Problem Solving
- **Feature implementation** completeness
- **User experience** considerations
- **Technical decision-making**
- **Documentation quality**

## 🚀 Getting Started

1. **Fork or clone** this repository
2. **Set up** a new NextJS project with TypeScript
3. **Plan your approach** - start with core features
4. **Build incrementally** - get the basics working first
5. **Test thoroughly** - ensure everything works as expected
6. **Deploy** your application
7. **Document** your work

## 💡 Tips for Success

- **Start simple** - get the basic conference listing working first
- **Focus on UX** - make it feel polished and professional
- **Show your thinking** - comment on technical decisions
- **Be creative** - add your own unique touches
- **Have fun** - we want to see your passion for building great products!

## 🤝 Questions?

If you have any questions about the requirements or need clarification, don't hesitate to reach out. We're here to help you succeed!

---

**Good luck, and happy coding! 🎉**

*We're excited to see what you build!*
