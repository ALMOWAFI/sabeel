# Webfrontend Integration for Sabeel Project

## Overview

This guide explains how to effectively integrate components from the `webfrontend` folder with the main Sabeel project. The integration approach focuses on selectively incorporating valuable components rather than merging entire codebases, which provides better maintainability and performance.

## Integration Files

The following files have been created to facilitate the integration:

1. **FRONTEND_INTEGRATION.md** - Comprehensive integration strategy and technical documentation
2. **integrate_frontend.js** - Script to automate the integration process
3. **api-routes.js** - Backend API endpoints to support the integrated frontend components
4. **src/pages/ComponentShowcase.tsx** - Demo page showing the integrated components

## Quick Start

### Prerequisites

Before starting the integration, ensure you have:

1. Fixed any Node.js environment issues (see TROUBLESHOOTING.md)
2. Installed all dependencies with `npm install`
3. Verified that the simplified application works with `node simplified-app.js`

### Integration Steps

1. **Run the integration script**:
   ```bash
   node integrate_frontend.js
   ```
   This script will:
   - Create necessary directories and files
   - Set up adapter components for EdX, Canvas, and H5P
   - Configure API services
   - Update the backend and frontend routes

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **View the showcase**:
   Open your browser and navigate to:
   ```
   http://localhost:8080/showcase
   ```

## What Gets Integrated

The integration focuses on these key components from the webfrontend folder:

### From EdX Platform
- Course listing and display components
- Course content structure

### From Canvas LMS
- Calendar and scheduling components
- Event management

### From H5P
- Interactive content elements
- Educational activities

## Customization

You can customize the integration by:

1. **Modifying the config section** in `integrate_frontend.js` to include additional components
2. **Editing the adapter components** created in `src/components/external/`
3. **Extending the API endpoints** in `api-routes.js`

## Troubleshooting

If you encounter issues during integration:

1. **Node.js Environment Issues**:
   - Refer to TROUBLESHOOTING.md for solutions to common Node.js problems

2. **Component Rendering Issues**:
   - Check the browser console for errors
   - Verify that all dependencies are installed
   - Ensure paths in the integration script are correct

3. **API Connection Issues**:
   - Confirm the backend server is running
   - Check that API routes are properly registered
   - Verify network requests in the browser developer tools

## Next Steps

After successful integration:

1. **Refine the UI/UX** of integrated components to match Sabeel's design system
2. **Connect to real data sources** instead of mock data
3. **Add authentication** for protected resources
4. **Implement additional components** as needed

## Additional Resources

- See FRONTEND_INTEGRATION.md for detailed technical documentation
- Explore the ComponentShowcase page for examples of integrated components
- Review the original webfrontend repositories for component documentation

## Support

If you need assistance with the integration process, please:

1. Check the troubleshooting section above
2. Review the detailed documentation in FRONTEND_INTEGRATION.md
3. Reach out to the development team for specific issues