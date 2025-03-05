# Inoxcrom Storefront

This is the frontend storefront for Inoxcrom's e-commerce platform, built with Next.js 14.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Medusa.js Integration
- Stripe Integration
- Nodemailer for contact form

## Prerequisites

- Node.js 16 or higher
- Yarn package manager
- Medusa backend server running
- Stripe account for payments

## Local Development Setup

1. Clone the repository and navigate to the storefront directory:
```bash
cd inoxcrom-backend-storefront
```

2. Install dependencies:
```bash
yarn
```
Note: The project uses Yarn v3.2.3 as the package manager. All dependencies are locked in yarn.lock, ensuring consistent installations across different environments.

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Configure the following variables in your `.env.local`:
```bash
# Backend API
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Stripe Configuration (Required for payments)
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx  # Stripe publishable key

# Email settings (for contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
CONTACT_EMAIL=contact@yourdomain.com
```

5. Start the development server:
```bash
yarn dev
```

The storefront will be available at `http://localhost:8000`

## Package Management

The project uses Yarn for dependency management. When you add a new package:

```bash
yarn add package-name    # For production dependencies
yarn add -D package-name # For development dependencies
```

This will automatically:
- Install the package
- Add it to package.json
- Update yarn.lock
- Install any necessary TypeScript types

You don't need to manually edit package.json - Yarn handles everything automatically. The yarn.lock file ensures that all developers use the exact same package versions.

## Stripe Integration

1. Get your Stripe API keys:
   - Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
   - Get your publishable key (`pk_test_xxx` for test mode)
   - Add it to your `.env.local` as `NEXT_PUBLIC_STRIPE_KEY`

2. For production:
   - Use live mode Stripe publishable key
   - Ensure the backend is configured with the corresponding live mode secret key
   - Test the payment flow in production before going live

## Production Deployment

### Building for Production

1. Update your `.env.local` with production values:
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxxxx  # Live mode Stripe publishable key
# ... other production environment variables
```

2. Build the project:
```bash
yarn build
```

3. Start the production server:
```bash
yarn start
```

### Deployment Options

#### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - Set `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
   - Set `NEXT_PUBLIC_STRIPE_KEY`
   - Set email configuration variables
3. Deploy with zero configuration

```bash
vercel --prod
```

#### Traditional Hosting

1. Build the project locally:
```bash
yarn build
```

2. Move the following to your production server:
   - `.next` directory
   - `public` directory
   - `package.json`
   - `yarn.lock` (important for consistent dependencies)
   - `.env.local` (with production values)

3. Install dependencies on the production server:
```bash
yarn install --production
```

4. Start the production server:
```bash
yarn start
```

## Project Structure

```
├── public/          # Static files
├── src/
│   ├── app/        # Next.js app router pages
│   ├── components/ # Reusable components
│   ├── lib/        # Utility functions and services
│   ├── modules/    # Feature-specific modules
│   ├── styles/     # Global styles
│   └── types/      # TypeScript type definitions
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn analyze` - Analyze bundle size

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_MEDUSA_BACKEND_URL | URL of Medusa backend | Yes |
| NEXT_PUBLIC_STRIPE_KEY | Stripe publishable key | Yes |
| EMAIL_USER | Email for contact form | Yes |
| EMAIL_PASSWORD | App-specific password | Yes |
| CONTACT_EMAIL | Contact form recipient | Yes |

## Features

- Responsive design
- Product catalog with search and filtering
- Shopping cart functionality
- Secure checkout with Stripe
- User account management
- Contact form with email support
- Order tracking
- Collection browsing
- Real-time inventory updates

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Medusa Documentation](https://docs.medusajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/about/)
