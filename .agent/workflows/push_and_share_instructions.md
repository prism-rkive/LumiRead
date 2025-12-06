---
description: Steps to push changes to a new branch and instructions for the teammate to run the updated project.
---

# 1. Push to a New Branch
Run these commands in your terminal (root of the project):
```bash
# Create and switch to a new branch (e.g., 'feature/modern-update')
git checkout -b feature/modern-update

# Stage all changes
git add .

# Commit changes
git commit -m "Refactor: Modern backend, new frontend design with Tailwind, and auth fixes"

# Push the branch to the remote repository
git push origin feature/modern-update
```

# 2. Instructions for Your Teammate
Send these instructions to the person who needs to run the code:

**"Hey, I've pushed a major update to the `feature/modern-update` branch. It includes a modern UI, new authentication system, and backend fixes. Please follow these steps to run it:"**

1.  **Pull the new branch:**
    ```bash
    git fetch origin
    git checkout feature/modern-update
    git pull origin feature/modern-update
    ```

2.  **Install New Backend Dependencies:**
    ```bash
    cd backend
    npm install
    # Ensure .env exists with JWT_SECRET=lumireadsecret123
    ```

3.  **Install New Frontend Dependencies (Tailwind, Lucide, etc.):**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Run the Project:**
    *   **Terminal 1 (Backend):** `cd backend && npm run dev`
    *   **Terminal 2 (Frontend):** `cd frontend && npm start`

**Note:** You may need to register a NEW user account because the user database model has changed.
