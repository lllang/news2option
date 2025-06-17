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
   ```bash
   cd backend
   ```

2. Build the project using Maven:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on http://localhost:8080/api

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend/news2option-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```bash
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on http://localhost:5173

## API Configuration

To enable AI-powered news analysis, you'll need to configure the Gemini API:

1. **Get an API key**:
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key for Gemini
   - Copy your key (keep it secure!)

2. **Configure the backend**:
   - Open `backend/src/main/resources/application.properties`
   - Add or update this line with your key:
     ```properties
     gemini.api.key=your_actual_api_key_here
     ```
   - Save the file and restart the backend service

Note: The API key should be kept confidential and never committed to version control.

## Getting Started

After setting up both backend and frontend, here's how to use News2Option:

1. **Start the servers**: Run both backend and frontend servers as described above
2. **Open the app**: Visit http://localhost:5173 in your browser
3. **Fetch news**: Click "Collect Latest News" to retrieve current financial news
4. **View analysis**: Click any news article to see the AI-generated analysis
5. **Get recommendations**: Check the "Recommendations" tab for daily investment suggestions based on news analysis

Tip: For best results, collect news at least once per day to keep recommendations fresh!

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
