# ShapeShift
Website link: https://shape-shift-vert.vercel.app/ 

## Summary

ShapeShift is an AI-powered weight management platform designed to help users achieve long-term health transformation through personalized fitness plans, smart diet planning with food image recognition, progress tracking, and daily accountability automation.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, ShadCN/ui
- **Charting**: Recharts or Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT-based (httpOnly cookies)
- **AI & NLP**: Google Gemini
- **Deployment**: Vercel (frontend), Render (backend)

## Project Status

**Status**: First phase complete: 

**Core features implemented:**

- Intake form for weight, BMI, and body fat
- AI workout planner and manual planner UI
- Meal search, food upload, and nutrient summary components
- Progress dashboard with basic charts
- Authentication (JWT) wired, Google/Apple/Meta login pending
- Deployed backend on Render and frontend on Vercel

## Current Results

- Users can log daily intake entries and view weight/BMI trends
- AI-generated workout plans display correctly; manual drag-and-drop planner functional
- Diet planner supports macro look-up and image-based calorie estimation
- Calendar view shows entries; basic insights (moving-average BMI) available
- AI chatbot prototype integrated for Q&A

## Future Improvements

- **Authentication Enhancements**: Add OAuth providers, enforce strong passwords, implement “Forgot Password” flow with rate limiting
- **UI/UX Polishing**: Refine sidebar design, improve planner card visuals, slot availability indicators
- **Custom Food Scanner**: Build an in-house food recognition model using a Kaggle dataset
- **AI Chatbot**: Expand prompt templates for richer nutrition and exercise guidance
- **Stretch Goals**: Community leaderboard, AI meal generator from fridge ingredients, mobile wrapper via Expo/React Native

