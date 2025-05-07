# News2Option

News2Option is a fullstack application that collects financial news, analyzes them using AI (Gemini), and provides investment recommendations based on the analysis.

## Features

- Collects financial news from various sources
- Analyzes news using Gemini AI to determine industry and company impacts
- Displays news articles and their analysis in a user-friendly interface
- Provides daily investment recommendations based on aggregated news analysis

## Project Structure

The project is organized as a fullstack application with:

- **Frontend**: React application with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Java Spring Boot application with H2 in-memory database

## Setup and Installation

### Backend (Java Spring Boot)

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Build the project using Maven:
   ```
   mvn clean install
   ```

3. Run the application:
   ```
   mvn spring-boot:run
   ```

The backend will start on http://localhost:8080/api

### Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd frontend/news2option-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The frontend will start on http://localhost:5173

## API Configuration

To use the Gemini API for news analysis, you need to set up API keys:

1. Get a Gemini API key from Google AI Studio
2. Update the `application.properties` file in the backend:
   ```
   gemini.api.key=your_gemini_api_key
   ```

## Usage

1. Start both the backend and frontend servers
2. Navigate to http://localhost:5173 in your browser
3. Use the "Collect Latest News" button to fetch financial news
4. View news analysis by clicking on a news article
5. Check investment recommendations in the Recommendations tab

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.1.0
- Spring Data JPA
- H2 Database
- JSoup for web scraping
- Google Cloud AI Platform for Gemini integration

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router
- React Query
- Axios

## License

This project is licensed under the MIT License.
