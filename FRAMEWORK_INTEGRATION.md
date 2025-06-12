# Sabeel Framework Integration

## Overview

This document explains the integration of Canvas LMS, Jupyter Book, and Kingraph into the Sabeel project. These frameworks have been customized and integrated to create a comprehensive Islamic knowledge platform.

## Integrated Components

### 1. Canvas LMS Integration

The Canvas LMS integration provides a learning management system tailored for Islamic education:

- **CanvasDashboard**: A dashboard showing courses, assignments, and calendar events
- **Arabic-first interface**: Full RTL support and Arabic typography
- **Islamic course structure**: Designed for Islamic studies curriculum

To view the Canvas LMS integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "نظام إدارة التعلم" tab

### 2. Jupyter Book Integration

The Jupyter Book integration provides interactive Islamic knowledge exploration:

- **JupyterBookViewer**: An interactive book viewer for Islamic content
- **Code execution**: Run Python code for Islamic text analysis
- **Interactive notebooks**: Create and share interactive Islamic research

To view the Jupyter Book integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "الكتب التفاعلية" tab

### 3. Kingraph Integration

The Kingraph integration visualizes Islamic knowledge networks:

- **KnowledgeGraphViewer**: Interactive visualization of Islamic knowledge
- **Isnad chains**: Visualize hadith transmission chains
- **Scholar networks**: Explore relationships between scholars and their works

To view the Kingraph integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "شبكة المعرفة الإسلامية" tab

## Implementation Details

### File Structure

```
src/
├── components/
│   └── external/
│       ├── CanvasLMSIntegration/
│       │   └── index.tsx
│       ├── JupyterBookIntegration/
│       │   └── index.tsx
│       └── KingraphIntegration/
│           └── index.tsx
└── pages/
    └── IntegratedShowcase.tsx
```

### Integration Approach

Rather than directly importing the original frameworks (which would be impractical due to their size and complexity), we've created React components that implement the core functionality of each framework:

1. **Adapter Pattern**: Each integration uses an adapter pattern to implement the framework's functionality in a React-compatible way
2. **Mock Data**: The integrations use mock data that represents what would be fetched from APIs in a production environment
3. **Consistent UI**: All integrations use the same UI component library for a consistent look and feel

## Future Enhancements

### Canvas LMS Enhancements

- Connect to a real Canvas LMS API
- Implement authentication and user roles
- Add course creation and management features

### Jupyter Book Enhancements

- Implement real code execution
- Add support for Arabic markdown
- Create specialized cells for Quran and Hadith content

### Kingraph Enhancements

- Implement a more sophisticated force-directed layout
- Add search and filtering capabilities
- Connect to a knowledge graph database

## Usage Guidelines

### Development

To extend the integrations:

1. Modify the components in `src/components/external/`
2. Update the mock data to reflect your specific content
3. Add new features by extending the existing components

### Production

For a production environment:

1. Replace mock data with API calls to the actual frameworks
2. Implement proper authentication and authorization
3. Optimize the components for performance

## Troubleshooting

If you encounter issues with the integrations:

1. **Rendering issues**: Check browser console for errors
2. **Performance problems**: Reduce the complexity of the mock data
3. **Layout issues**: Adjust the CSS for RTL support

## Resources

- [Canvas LMS API Documentation](https://canvas.instructure.com/doc/api/)
- [Jupyter Book Documentation](https://jupyterbook.org/en/stable/intro.html)
- [Kingraph GitHub Repository](https://github.com/rstacruz/kingraph)# Sabeel Framework Integration

## Overview

This document explains the integration of Canvas LMS, Jupyter Book, and Kingraph into the Sabeel project. These frameworks have been customized and integrated to create a comprehensive Islamic knowledge platform.

## Integrated Components

### 1. Canvas LMS Integration

The Canvas LMS integration provides a learning management system tailored for Islamic education:

- **CanvasDashboard**: A dashboard showing courses, assignments, and calendar events
- **Arabic-first interface**: Full RTL support and Arabic typography
- **Islamic course structure**: Designed for Islamic studies curriculum

To view the Canvas LMS integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "نظام إدارة التعلم" tab

### 2. Jupyter Book Integration

The Jupyter Book integration provides interactive Islamic knowledge exploration:

- **JupyterBookViewer**: An interactive book viewer for Islamic content
- **Code execution**: Run Python code for Islamic text analysis
- **Interactive notebooks**: Create and share interactive Islamic research

To view the Jupyter Book integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "الكتب التفاعلية" tab

### 3. Kingraph Integration

The Kingraph integration visualizes Islamic knowledge networks:

- **KnowledgeGraphViewer**: Interactive visualization of Islamic knowledge
- **Isnad chains**: Visualize hadith transmission chains
- **Scholar networks**: Explore relationships between scholars and their works

To view the Kingraph integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "شبكة المعرفة الإسلامية" tab

## Implementation Details

### File Structure

```
src/
├── components/
│   └── external/
│       ├── CanvasLMSIntegration/
│       │   └── index.tsx
│       ├── JupyterBookIntegration/
│       │   └── index.tsx
│       └── KingraphIntegration/
│           └── index.tsx
└── pages/
    └── IntegratedShowcase.tsx
```

### Integration Approach

Rather than directly importing the original frameworks (which would be impractical due to their size and complexity), we've created React components that implement the core functionality of each framework:

1. **Adapter Pattern**: Each integration uses an adapter pattern to implement the framework's functionality in a React-compatible way
2. **Mock Data**: The integrations use mock data that represents what would be fetched from APIs in a production environment
3. **Consistent UI**: All integrations use the same UI component library for a consistent look and feel

## Future Enhancements

### Canvas LMS Enhancements

- Connect to a real Canvas LMS API
- Implement authentication and user roles
- Add course creation and management features

### Jupyter Book Enhancements

- Implement real code execution
- Add support for Arabic markdown
- Create specialized cells for Quran and Hadith content

### Kingraph Enhancements

- Implement a more sophisticated force-directed layout
- Add search and filtering capabilities
- Connect to a knowledge graph database

## Usage Guidelines

### Development

To extend the integrations:

1. Modify the components in `src/components/external/`
2. Update the mock data to reflect your specific content
3. Add new features by extending the existing components

### Production

For a production environment:

1. Replace mock data with API calls to the actual frameworks
2. Implement proper authentication and authorization
3. Optimize the components for performance

## Troubleshooting

If you encounter issues with the integrations:

1. **Rendering issues**: Check browser console for errors
2. **Performance problems**: Reduce the complexity of the mock data
3. **Layout issues**: Adjust the CSS for RTL support

## Resources

- [Canvas LMS API Documentation](https://canvas.instructure.com/doc/api/)
- [Jupyter Book Documentation](https://jupyterbook.org/en/stable/intro.html)
- [Kingraph GitHub Repository](https://github.com/rstacruz/kingraph)# Sabeel Framework Integration

## Overview

This document explains the integration of Canvas LMS, Jupyter Book, and Kingraph into the Sabeel project. These frameworks have been customized and integrated to create a comprehensive Islamic knowledge platform.

## Integrated Components

### 1. Canvas LMS Integration

The Canvas LMS integration provides a learning management system tailored for Islamic education:

- **CanvasDashboard**: A dashboard showing courses, assignments, and calendar events
- **Arabic-first interface**: Full RTL support and Arabic typography
- **Islamic course structure**: Designed for Islamic studies curriculum

To view the Canvas LMS integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "نظام إدارة التعلم" tab

### 2. Jupyter Book Integration

The Jupyter Book integration provides interactive Islamic knowledge exploration:

- **JupyterBookViewer**: An interactive book viewer for Islamic content
- **Code execution**: Run Python code for Islamic text analysis
- **Interactive notebooks**: Create and share interactive Islamic research

To view the Jupyter Book integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "الكتب التفاعلية" tab

### 3. Kingraph Integration

The Kingraph integration visualizes Islamic knowledge networks:

- **KnowledgeGraphViewer**: Interactive visualization of Islamic knowledge
- **Isnad chains**: Visualize hadith transmission chains
- **Scholar networks**: Explore relationships between scholars and their works

To view the Kingraph integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "شبكة المعرفة الإسلامية" tab

## Implementation Details

### File Structure

```
src/
├── components/
│   └── external/
│       ├── CanvasLMSIntegration/
│       │   └── index.tsx
│       ├── JupyterBookIntegration/
│       │   └── index.tsx
│       └── KingraphIntegration/
│           └── index.tsx
└── pages/
    └── IntegratedShowcase.tsx
```

### Integration Approach

Rather than directly importing the original frameworks (which would be impractical due to their size and complexity), we've created React components that implement the core functionality of each framework:

1. **Adapter Pattern**: Each integration uses an adapter pattern to implement the framework's functionality in a React-compatible way
2. **Mock Data**: The integrations use mock data that represents what would be fetched from APIs in a production environment
3. **Consistent UI**: All integrations use the same UI component library for a consistent look and feel

## Future Enhancements

### Canvas LMS Enhancements

- Connect to a real Canvas LMS API
- Implement authentication and user roles
- Add course creation and management features

### Jupyter Book Enhancements

- Implement real code execution
- Add support for Arabic markdown
- Create specialized cells for Quran and Hadith content

### Kingraph Enhancements

- Implement a more sophisticated force-directed layout
- Add search and filtering capabilities
- Connect to a knowledge graph database

## Usage Guidelines

### Development

To extend the integrations:

1. Modify the components in `src/components/external/`
2. Update the mock data to reflect your specific content
3. Add new features by extending the existing components

### Production

For a production environment:

1. Replace mock data with API calls to the actual frameworks
2. Implement proper authentication and authorization
3. Optimize the components for performance

## Troubleshooting

If you encounter issues with the integrations:

1. **Rendering issues**: Check browser console for errors
2. **Performance problems**: Reduce the complexity of the mock data
3. **Layout issues**: Adjust the CSS for RTL support

## Resources

- [Canvas LMS API Documentation](https://canvas.instructure.com/doc/api/)
- [Jupyter Book Documentation](https://jupyterbook.org/en/stable/intro.html)
- [Kingraph GitHub Repository](https://github.com/rstacruz/kingraph)# Sabeel Framework Integration

## Overview

This document explains the integration of Canvas LMS, Jupyter Book, and Kingraph into the Sabeel project. These frameworks have been customized and integrated to create a comprehensive Islamic knowledge platform.

## Integrated Components

### 1. Canvas LMS Integration

The Canvas LMS integration provides a learning management system tailored for Islamic education:

- **CanvasDashboard**: A dashboard showing courses, assignments, and calendar events
- **Arabic-first interface**: Full RTL support and Arabic typography
- **Islamic course structure**: Designed for Islamic studies curriculum

To view the Canvas LMS integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "نظام إدارة التعلم" tab

### 2. Jupyter Book Integration

The Jupyter Book integration provides interactive Islamic knowledge exploration:

- **JupyterBookViewer**: An interactive book viewer for Islamic content
- **Code execution**: Run Python code for Islamic text analysis
- **Interactive notebooks**: Create and share interactive Islamic research

To view the Jupyter Book integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "الكتب التفاعلية" tab

### 3. Kingraph Integration

The Kingraph integration visualizes Islamic knowledge networks:

- **KnowledgeGraphViewer**: Interactive visualization of Islamic knowledge
- **Isnad chains**: Visualize hadith transmission chains
- **Scholar networks**: Explore relationships between scholars and their works

To view the Kingraph integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "شبكة المعرفة الإسلامية" tab

## Implementation Details

### File Structure

```
src/
├── components/
│   └── external/
│       ├── CanvasLMSIntegration/
│       │   └── index.tsx
│       ├── JupyterBookIntegration/
│       │   └── index.tsx
│       └── KingraphIntegration/
│           └── index.tsx
└── pages/
    └── IntegratedShowcase.tsx
```

### Integration Approach

Rather than directly importing the original frameworks (which would be impractical due to their size and complexity), we've created React components that implement the core functionality of each framework:

1. **Adapter Pattern**: Each integration uses an adapter pattern to implement the framework's functionality in a React-compatible way
2. **Mock Data**: The integrations use mock data that represents what would be fetched from APIs in a production environment
3. **Consistent UI**: All integrations use the same UI component library for a consistent look and feel

## Future Enhancements

### Canvas LMS Enhancements

- Connect to a real Canvas LMS API
- Implement authentication and user roles
- Add course creation and management features

### Jupyter Book Enhancements

- Implement real code execution
- Add support for Arabic markdown
- Create specialized cells for Quran and Hadith content

### Kingraph Enhancements

- Implement a more sophisticated force-directed layout
- Add search and filtering capabilities
- Connect to a knowledge graph database

## Usage Guidelines

### Development

To extend the integrations:

1. Modify the components in `src/components/external/`
2. Update the mock data to reflect your specific content
3. Add new features by extending the existing components

### Production

For a production environment:

1. Replace mock data with API calls to the actual frameworks
2. Implement proper authentication and authorization
3. Optimize the components for performance

## Troubleshooting

If you encounter issues with the integrations:

1. **Rendering issues**: Check browser console for errors
2. **Performance problems**: Reduce the complexity of the mock data
3. **Layout issues**: Adjust the CSS for RTL support

## Resources

- [Canvas LMS API Documentation](https://canvas.instructure.com/doc/api/)
- [Jupyter Book Documentation](https://jupyterbook.org/en/stable/intro.html)
- [Kingraph GitHub Repository](https://github.com/rstacruz/kingraph)# Sabeel Framework Integration

## Overview

This document explains the integration of Canvas LMS, Jupyter Book, and Kingraph into the Sabeel project. These frameworks have been customized and integrated to create a comprehensive Islamic knowledge platform.

## Integrated Components

### 1. Canvas LMS Integration

The Canvas LMS integration provides a learning management system tailored for Islamic education:

- **CanvasDashboard**: A dashboard showing courses, assignments, and calendar events
- **Arabic-first interface**: Full RTL support and Arabic typography
- **Islamic course structure**: Designed for Islamic studies curriculum

To view the Canvas LMS integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "نظام إدارة التعلم" tab

### 2. Jupyter Book Integration

The Jupyter Book integration provides interactive Islamic knowledge exploration:

- **JupyterBookViewer**: An interactive book viewer for Islamic content
- **Code execution**: Run Python code for Islamic text analysis
- **Interactive notebooks**: Create and share interactive Islamic research

To view the Jupyter Book integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "الكتب التفاعلية" tab

### 3. Kingraph Integration

The Kingraph integration visualizes Islamic knowledge networks:

- **KnowledgeGraphViewer**: Interactive visualization of Islamic knowledge
- **Isnad chains**: Visualize hadith transmission chains
- **Scholar networks**: Explore relationships between scholars and their works

To view the Kingraph integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "شبكة المعرفة الإسلامية" tab

## Implementation Details

### File Structure

```
src/
├── components/
│   └── external/
│       ├── CanvasLMSIntegration/
│       │   └── index.tsx
│       ├── JupyterBookIntegration/
│       │   └── index.tsx
│       └── KingraphIntegration/
│           └── index.tsx
└── pages/
    └── IntegratedShowcase.tsx
```

### Integration Approach

Rather than directly importing the original frameworks (which would be impractical due to their size and complexity), we've created React components that implement the core functionality of each framework:

1. **Adapter Pattern**: Each integration uses an adapter pattern to implement the framework's functionality in a React-compatible way
2. **Mock Data**: The integrations use mock data that represents what would be fetched from APIs in a production environment
3. **Consistent UI**: All integrations use the same UI component library for a consistent look and feel

## Future Enhancements

### Canvas LMS Enhancements

- Connect to a real Canvas LMS API
- Implement authentication and user roles
- Add course creation and management features

### Jupyter Book Enhancements

- Implement real code execution
- Add support for Arabic markdown
- Create specialized cells for Quran and Hadith content

### Kingraph Enhancements

- Implement a more sophisticated force-directed layout
- Add search and filtering capabilities
- Connect to a knowledge graph database

## Usage Guidelines

### Development

To extend the integrations:

1. Modify the components in `src/components/external/`
2. Update the mock data to reflect your specific content
3. Add new features by extending the existing components

### Production

For a production environment:

1. Replace mock data with API calls to the actual frameworks
2. Implement proper authentication and authorization
3. Optimize the components for performance

## Troubleshooting

If you encounter issues with the integrations:

1. **Rendering issues**: Check browser console for errors
2. **Performance problems**: Reduce the complexity of the mock data
3. **Layout issues**: Adjust the CSS for RTL support

## Resources

- [Canvas LMS API Documentation](https://canvas.instructure.com/doc/api/)
- [Jupyter Book Documentation](https://jupyterbook.org/en/stable/intro.html)
- [Kingraph GitHub Repository](https://github.com/rstacruz/kingraph)# Sabeel Framework Integration

## Overview

This document explains the integration of Canvas LMS, Jupyter Book, and Kingraph into the Sabeel project. These frameworks have been customized and integrated to create a comprehensive Islamic knowledge platform.

## Integrated Components

### 1. Canvas LMS Integration

The Canvas LMS integration provides a learning management system tailored for Islamic education:

- **CanvasDashboard**: A dashboard showing courses, assignments, and calendar events
- **Arabic-first interface**: Full RTL support and Arabic typography
- **Islamic course structure**: Designed for Islamic studies curriculum

To view the Canvas LMS integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "نظام إدارة التعلم" tab

### 2. Jupyter Book Integration

The Jupyter Book integration provides interactive Islamic knowledge exploration:

- **JupyterBookViewer**: An interactive book viewer for Islamic content
- **Code execution**: Run Python code for Islamic text analysis
- **Interactive notebooks**: Create and share interactive Islamic research

To view the Jupyter Book integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "الكتب التفاعلية" tab

### 3. Kingraph Integration

The Kingraph integration visualizes Islamic knowledge networks:

- **KnowledgeGraphViewer**: Interactive visualization of Islamic knowledge
- **Isnad chains**: Visualize hadith transmission chains
- **Scholar networks**: Explore relationships between scholars and their works

To view the Kingraph integration:
1. Navigate to `/integrated-showcase` in the application
2. Select the "شبكة المعرفة الإسلامية" tab

## Implementation Details

### File Structure

```
src/
├── components/
│   └── external/
│       ├── CanvasLMSIntegration/
│       │   └── index.tsx
│       ├── JupyterBookIntegration/
│       │   └── index.tsx
│       └── KingraphIntegration/
│           └── index.tsx
└── pages/
    └── IntegratedShowcase.tsx
```

### Integration Approach

Rather than directly importing the original frameworks (which would be impractical due to their size and complexity), we've created React components that implement the core functionality of each framework:

1. **Adapter Pattern**: Each integration uses an adapter pattern to implement the framework's functionality in a React-compatible way
2. **Mock Data**: The integrations use mock data that represents what would be fetched from APIs in a production environment
3. **Consistent UI**: All integrations use the same UI component library for a consistent look and feel

## Future Enhancements

### Canvas LMS Enhancements

- Connect to a real Canvas LMS API
- Implement authentication and user roles
- Add course creation and management features

### Jupyter Book Enhancements

- Implement real code execution
- Add support for Arabic markdown
- Create specialized cells for Quran and Hadith content

### Kingraph Enhancements

- Implement a more sophisticated force-directed layout
- Add search and filtering capabilities
- Connect to a knowledge graph database

## Usage Guidelines

### Development

To extend the integrations:

1. Modify the components in `src/components/external/`
2. Update the mock data to reflect your specific content
3. Add new features by extending the existing components

### Production

For a production environment:

1. Replace mock data with API calls to the actual frameworks
2. Implement proper authentication and authorization
3. Optimize the components for performance

## Troubleshooting

If you encounter issues with the integrations:

1. **Rendering issues**: Check browser console for errors
2. **Performance problems**: Reduce the complexity of the mock data
3. **Layout issues**: Adjust the CSS for RTL support

## Resources

- [Canvas LMS API Documentation](https://canvas.instructure.com/doc/api/)
- [Jupyter Book Documentation](https://jupyterbook.org/en/stable/intro.html)
- [Kingraph GitHub Repository](https://github.com/rstacruz/kingraph)