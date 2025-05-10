/**
 * API Routes for Sabeel Project
 * 
 * This file contains API endpoints to support the integrated frontend components
 * from the webfrontend folder.
 */

module.exports = function(app) {
  // Course API endpoints
  app.get('/api/courses', (req, res) => {
    // Mock data - would be replaced with database queries
    res.json([
      { 
        id: '1', 
        title: 'Islamic Studies 101', 
        description: 'Introduction to Islamic studies',
        imageUrl: '/placeholder.svg'
      },
      { 
        id: '2', 
        title: 'Arabic Language', 
        description: 'Learn Arabic fundamentals',
        imageUrl: '/placeholder.svg'
      },
      { 
        id: '3', 
        title: 'Quran Recitation', 
        description: 'Proper techniques for Quran recitation',
        imageUrl: '/placeholder.svg'
      },
    ]);
  });

  app.get('/api/courses/:id', (req, res) => {
    const courseId = req.params.id;
    // Mock data - would be replaced with database lookup
    const courses = {
      '1': { 
        id: '1', 
        title: 'Islamic Studies 101', 
        description: 'Introduction to Islamic studies',
        imageUrl: '/placeholder.svg',
        modules: [
          { id: 'm1', title: 'Introduction to Islam', lessons: 3 },
          { id: 'm2', title: 'The Five Pillars', lessons: 5 },
          { id: 'm3', title: 'Islamic History', lessons: 4 },
        ]
      },
      '2': { 
        id: '2', 
        title: 'Arabic Language', 
        description: 'Learn Arabic fundamentals',
        imageUrl: '/placeholder.svg',
        modules: [
          { id: 'm1', title: 'Arabic Alphabet', lessons: 4 },
          { id: 'm2', title: 'Basic Grammar', lessons: 6 },
          { id: 'm3', title: 'Conversation', lessons: 5 },
        ]
      },
      '3': { 
        id: '3', 
        title: 'Quran Recitation', 
        description: 'Proper techniques for Quran recitation',
        imageUrl: '/placeholder.svg',
        modules: [
          { id: 'm1', title: 'Tajweed Rules', lessons: 7 },
          { id: 'm2', title: 'Pronunciation', lessons: 5 },
          { id: 'm3', title: 'Practice Sessions', lessons: 4 },
        ]
      },
    };
    
    if (courses[courseId]) {
      res.json(courses[courseId]);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  });

  // Calendar API endpoints
  app.get('/api/calendar/events', (req, res) => {
    // Mock data - would be replaced with database queries
    res.json([
      { id: '1', title: 'Islamic Studies Lecture', date: '2023-06-15', type: 'lecture' },
      { id: '2', title: 'Arabic Assignment Due', date: '2023-06-18', type: 'assignment' },
      { id: '3', title: 'Quran Recitation Session', date: '2023-06-20', type: 'other' },
      { id: '4', title: 'Islamic History Exam', date: '2023-06-25', type: 'exam' },
    ]);
  });

  app.post('/api/calendar/events', (req, res) => {
    // In a real app, this would save to a database
    console.log('New calendar event:', req.body);
    res.json({ 
      id: Date.now().toString(), 
      ...req.body,
      status: 'created' 
    });
  });

  // H5P content API endpoints
  app.get('/api/h5p/content/:id', (req, res) => {
    const contentId = req.params.id;
    // Mock data - would be replaced with actual H5P content
    res.json({
      id: contentId,
      title: 'H5P Interactive Content',
      type: 'quiz',
      // Additional H5P content data would go here
    });
  });

  // Islamic resources API endpoints
  app.get('/api/resources', (req, res) => {
    res.json([
      { 
        id: '1', 
        title: 'Introduction to Islamic Studies', 
        type: 'pdf',
        url: '/resources/intro-islamic-studies.pdf'
      },
      { 
        id: '2', 
        title: 'Arabic Grammar Basics', 
        type: 'pdf',
        url: '/resources/arabic-grammar.pdf'
      },
      { 
        id: '3', 
        title: 'Quran Recitation Guide', 
        type: 'video',
        url: '/resources/quran-recitation.mp4'
      },
    ]);
  });

  // Scholar directory API endpoint
  app.get('/api/scholars', (req, res) => {
    res.json([
      { 
        id: '1', 
        name: 'Dr. Ahmad Al-Farooq', 
        specialty: 'Islamic Jurisprudence',
        institution: 'Al-Azhar University',
        imageUrl: '/placeholder.svg'
      },
      { 
        id: '2', 
        name: 'Dr. Fatima Al-Zahra', 
        specialty: 'Islamic History',
        institution: 'Islamic University of Madinah',
        imageUrl: '/placeholder.svg'
      },
      { 
        id: '3', 
        name: 'Dr. Yusuf Abdullah', 
        specialty: 'Quranic Studies',
        institution: 'International Islamic University Malaysia',
        imageUrl: '/placeholder.svg'
      },
    ]);
  });
};