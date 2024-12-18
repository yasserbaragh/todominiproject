# Todo Application (FastAPI + Next.js + MySQL)

This repository contains a **FastAPI** backend, a **Next.js** frontend, and a **MySQL** database for a simple **Todo application**.

- **Backend**: FastAPI (Python) for the API layer.
- **Frontend**: Next.js (JavaScript/React) for the user interface.
- **Database**: MySQL with a database named `todo`.
---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Python 3.7+** (for the backend FastAPI app)
- **Node.js** (for the frontend Next.js app)
- **MySQL** (for the database)

You can download these from the official websites:
- [Python](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/installer/)

---

## Project Setup

### 1. Clone the Repository

Clone the repository to your local machine:

git clone https://github.com/yasserbaragh/todominiproject.git
cd todominiproject

#### Backend Setup (FastAPI with Pipenv)
Step 1: Install Python Dependencies
Navigate to the backend directory:

cd backend
Install project dependencies using Pipenv:

python -m venv env
Activate the virtual environment:

On macOS/Linux:
source env/bin/activate
On Windows:
.\env\Scripts\activate

pipenv install
pipenv shell

### set up mysql database
in mysql wokbench create a database called todo
add the url of the database in /backend/db => URL_DATABASE (remplace the existing url)

##### run the backend
uvicorn main:app --reload

## frontend setup
Install Dependencies
cd frontend/spike-nextjs-free-main/package
npm install

#### Run the Frontend
in the same directory run:
npm run dev
The frontend will be available at http://localhost:3000.
if it's not on ttp://localhost:3000. you have to change cors origins to the url in /backend/main => origins = ["your urls"]

for any issues contact: yasserbaragh@gmail.com
