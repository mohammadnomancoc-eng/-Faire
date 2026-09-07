# Contributing to À Faire 🎯

Thank you for your interest in contributing to **À Faire**! We welcome bug reports, feature suggestions, and code contributions.

---

## 🛠️ Development Setup

1. **Fork & Clone** the repository:
   ```bash
   git clone https://github.com/your-username/-Faire.git
   cd -Faire
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 🌿 Branch & Commit Guidelines

- **Branches**: Use descriptive branch names:
  - `feat/feature-name`
  - `fix/bug-description`
  - `docs/documentation-update`

- **Conventional Commits**: Please format commit messages consistently:
  - `feat(...)`: A new feature
  - `fix(...)`: A bug fix
  - `docs(...)`: Documentation only changes
  - `refactor(...)`: Code change that neither fixes a bug nor adds a feature

---

## 🚀 Submitting a Pull Request

1. Push your branch to your fork.
2. Open a Pull Request against the `main` branch.
3. Provide a clear title and description of your changes.
4. Ensure code adheres to ESLint rules (`npm run lint`).
