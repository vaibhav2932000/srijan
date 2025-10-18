# Contributing to SRIJAN

First off, thank you for considering contributing to SRIJAN! It's people like you that make SRIJAN a great tool for celebrating Indian handicrafts.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues list. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Note your environment** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes**
3. **Add tests** if applicable
4. **Ensure the test suite passes**
5. **Make sure your code lints** (`npm run lint`)
6. **Update documentation** if needed
7. **Write a clear commit message**

#### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test updates
- `chore/` - Maintenance tasks

Examples:
- `feature/add-wishlist-page`
- `fix/cart-total-calculation`
- `docs/update-api-guide`

#### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(products): add product comparison feature

Add ability to compare up to 4 products side by side.
Includes new comparison page and compare button on product cards.

Closes #123
```

```
fix(cart): correct total price calculation

Fixed issue where sale prices weren't being used in cart total.

Fixes #456
```

## Development Setup

1. **Clone your fork**
```bash
git clone https://github.com/your-username/srijan-frontend.git
cd srijan-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Start development server**
```bash
npm run dev
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define types explicitly
- Avoid `any` type
- Use interfaces for objects
- Use type for unions/intersections

### React Components

- Use functional components with hooks
- Use meaningful component names
- Keep components focused and small
- Extract reusable logic to custom hooks
- Use proper prop types

Good:
```typescript
interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  // Component logic
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use custom classes from `globals.css` when appropriate
- Keep consistency with design system

Good:
```tsx
<button className="btn-primary">
  Add to Cart
</button>
```

Bad:
```tsx
<button className="px-6 py-3 bg-saffron text-white rounded-lg hover:bg-saffron-dark">
  Add to Cart
</button>
```

### File Organization

- One component per file
- Co-locate related files
- Use index files for cleaner imports
- Keep file names in kebab-case for components
- Keep utility files in camelCase

## Testing

- Write tests for new features
- Update tests when modifying existing code
- Ensure all tests pass before submitting PR
- Aim for meaningful test coverage

```bash
npm run test
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Update type definitions
- Include examples in documentation

## Review Process

1. **Automated checks** must pass:
   - TypeScript compilation
   - Linting
   - Tests (if applicable)
   - Build

2. **Code review** by maintainers:
   - Code quality
   - Adherence to guidelines
   - Architecture decisions
   - Performance considerations

3. **Testing** in various scenarios

4. **Merge** once approved

## Getting Help

- 💬 GitHub Discussions for questions
- 🐛 GitHub Issues for bugs
- 📧 Email for security issues

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project README

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SRIJAN! 🙏✨

