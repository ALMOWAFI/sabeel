/**
 * Service Worker for Sabeel platform
 * Provides offline content caching and network request interception
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `sabeel-offline-${CACHE_VERSION}`;
const CONTENT_CACHE_NAME = 'sabeel-content-cache';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index.js',  // Main JS bundle
  '/assets/index.css', // Main CSS bundle
  '/assets/logo.svg',
  // Add other shell assets here...
];

// Install event - cache app shell files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell');
        return cache.addAll(APP_SHELL_URLS);
      })
      .then(() => {
        console.log('[Service Worker] App Shell Cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== CACHE_NAME && key !== CONTENT_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    // For API requests, use network first with fallback to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache valid responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } 
  // Handle offline content requests (special handling)
  else if (url.pathname.startsWith('/offline-content/')) {
    event.respondWith(
      caches.open(CONTENT_CACHE_NAME)
        .then(cache => cache.match(event.request))
        .then(response => {
          if (response) {
            return response;
          }
          // Return placeholder response if not in cache
          return new Response(JSON.stringify({
            error: 'Offline content not available',
            message: 'This content has not been downloaded for offline use'
          }), {
            headers: {'Content-Type': 'application/json'}
          });
        })
    );
  }
  // For other requests, use cache first with network fallback
  else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          
          // Clone the request because it's a one-time use stream
          const fetchRequest = event.request.clone();
          
          return fetch(fetchRequest)
            .then(response => {
              // Check if valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clone response as it's a one-time use stream
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  // Don't cache video streams or other large resources automatically
                  const isLargeResource = 
                    responseToCache.headers.get('content-type')?.includes('video') ||
                    responseToCache.headers.get('content-length') > 1024 * 1024 * 10; // 10MB
                  
                  if (!isLargeResource) {
                    cache.put(event.request, responseToCache);
                  }
                });
              
              return response;
            })
            .catch(() => {
              // For navigation fallbacks
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
              
              return null;
            });
        })
    );
  }
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  const data = event.data;
  
  // Cache specific content
  if (data.type === 'cache_content' && data.contentId && data.contentUrl) {
    console.log(`[Service Worker] Caching content: ${data.contentId}`);
    
    // Inform client that download has started
    sendProgressUpdate({
      contentId: data.contentId,
      progress: 0,
      bytesDownloaded: 0,
      totalBytes: 0,
      status: 'downloading'
    });
    
    fetch(data.contentUrl)
      .then(response => {
        const contentLength = parseInt(response.headers.get('content-length') || '0');
        const reader = response.body.getReader();
        let receivedLength = 0;
        
        // Track download progress
        const trackProgress = async (result) => {
          if (result.done) {
            return response;
          }
          
          receivedLength += result.value.length;
          const progress = Math.round((receivedLength / contentLength) * 100);
          
          // Send progress update
          sendProgressUpdate({
            contentId: data.contentId,
            progress,
            bytesDownloaded: receivedLength,
            totalBytes: contentLength,
            status: 'downloading'
          });
          
          // Continue reading
          return reader.read().then(trackProgress);
        };
        
        // Start tracking progress
        return reader.read().then(trackProgress);
      })
      .then(response => {
        if (!response || !response.clone) {
          throw new Error('Invalid response');
        }
        
        // Add to cache
        return caches.open(CONTENT_CACHE_NAME)
          .then(cache => {
            return cache.put(data.contentUrl, response.clone())
              .then(() => {
                console.log(`[Service Worker] Content cached: ${data.contentId}`);
                // Notify complete
                sendProgressUpdate({
                  contentId: data.contentId,
                  progress: 100,
                  bytesDownloaded: 0,
                  totalBytes: 0,
                  status: 'completed'
                });
              });
          });
      })
      .catch(error => {
        console.error(`[Service Worker] Caching failed for ${data.contentId}:`, error);
        // Notify error
        sendProgressUpdate({
          contentId: data.contentId,
          progress: 0,
          bytesDownloaded: 0,
          totalBytes: 0,
          status: 'error',
          error: error.message
        });
      });
  }
  
  // Remove specific content
  else if (data.type === 'remove_content' && data.contentId) {
    console.log(`[Service Worker] Removing content: ${data.contentId}`);
    
    caches.open(CONTENT_CACHE_NAME)
      .then(cache => {
        return cache.keys()
          .then(requests => {
            const contentRequests = requests.filter(request => 
              request.url.includes(`/offline-content/${data.contentId}`)
            );
            
            const deletePromises = contentRequests.map(request => cache.delete(request));
            return Promise.all(deletePromises);
          })
          .then(() => {
            console.log(`[Service Worker] Content removed: ${data.contentId}`);
          });
      })
      .catch(error => {
        console.error(`[Service Worker] Error removing content ${data.contentId}:`, error);
      });
  }
  
  // Clear all content
  else if (data.type === 'clear_all_content') {
    console.log('[Service Worker] Clearing all content');
    
    caches.delete(CONTENT_CACHE_NAME)
      .then(() => {
        console.log('[Service Worker] All content cleared');
      })
      .catch(error => {
        console.error('[Service Worker] Error clearing content:', error);
      });
  }
});

// Helper to send progress updates to clients
const sendProgressUpdate = (progressData) => {
  self.clients.matchAll()
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'download_progress',
          ...progressData
        });
      });
    });
};
