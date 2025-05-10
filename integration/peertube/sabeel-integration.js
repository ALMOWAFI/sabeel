/**
 * Sabeel PeerTube Integration
 * 
 * Extends PeerTube functionality with features specific to
 * Islamic educational video content and integration with Sabeel platform.
 */

(function () {
  // Sabeel API endpoints
  const SABEEL_API = {
    baseUrl: '/api/sabeel',
    authentication: '/api/sabeel/auth',
    metadata: '/api/sabeel/metadata',
    scholars: '/api/sabeel/scholars',
    taxonomy: '/api/sabeel/taxonomy',
    recommendations: '/api/sabeel/recommendations'
  };

  // Plugin configuration
  const config = {
    enableIslamicMetadata: true,
    enableScholarsDirectory: true,
    enableTaxonomyIntegration: true,
    enableArabicTranscription: true,
    enableQuranReferences: true,
    enableHadithVerification: true
  };

  // Register plugin when PeerTube is ready
  registerHook({
    target: 'action:application.init',
    handler: () => {
      console.log('Sabeel PeerTube Integration initialized');
      initSabeelIntegration();
    }
  });

  // Initialize the Sabeel integration
  function initSabeelIntegration() {
    injectCustomCSSForRTL();
    extendVideoUploadForm();
    enhanceVideoPlayer();
    addIslamicSearchFilters();
    integrateSabeelAuthentication();
    addScholarVerificationBadges();
    implementArabicTranscriptionSupport();
  }

  // Add RTL support for Arabic content
  function injectCustomCSSForRTL() {
    const style = document.createElement('style');
    style.textContent = `
      .video-language-ar .video-info-name,
      .video-language-ar .video-info-description,
      .video-language-ar .comment-html {
        direction: rtl;
        text-align: right;
        font-family: "Noto Sans Arabic", sans-serif;
      }
      
      .sabeel-scholar-badge {
        background-color: #10B981;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin-left: 8px;
      }
      
      .sabeel-quran-reference {
        background-color: rgba(99, 102, 241, 0.1);
        color: #6366F1;
        padding: 4px 8px;
        border-radius: 4px;
        margin: 4px 0;
        display: inline-block;
      }
      
      .sabeel-hadith-reference {
        background-color: rgba(16, 185, 129, 0.1);
        color: #10B981;
        padding: 4px 8px;
        border-radius: 4px;
        margin: 4px 0;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
  }

  // Extend video upload form with Islamic metadata
  function extendVideoUploadForm() {
    registerHook({
      target: 'action:video-edit.init',
      handler: ({ videoEdit }) => {
        // Get the upload form element
        const formEl = document.querySelector('my-video-edit');
        if (!formEl) return;
        
        // Create Islamic metadata section
        const metadataSection = document.createElement('div');
        metadataSection.className = 'sabeel-islamic-metadata form-group';
        metadataSection.innerHTML = `
          <h3 class="sabeel-section-title">بيانات المحتوى الإسلامي</h3>
          
          <div class="form-group">
            <label for="scholarName">اسم الشيخ أو العالم</label>
            <input id="scholarName" class="form-control" type="text" placeholder="أدخل اسم العالم أو الشيخ">
          </div>
          
          <div class="form-group">
            <label for="islamicCategory">التصنيف الشرعي</label>
            <select id="islamicCategory" class="form-control">
              <option value="">-- اختر تصنيفاً --</option>
              <option value="quran">القرآن الكريم</option>
              <option value="tafsir">التفسير</option>
              <option value="hadith">الحديث</option>
              <option value="fiqh">الفقه</option>
              <option value="aqeedah">العقيدة</option>
              <option value="seerah">السيرة</option>
              <option value="general">محاضرات عامة</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="quranReferences">آيات قرآنية مرجعية</label>
            <input id="quranReferences" class="form-control" type="text" placeholder="مثال: البقرة: 255، آل عمران: 103-105">
          </div>
          
          <div class="form-group">
            <label for="hadithReferences">أحاديث مرجعية</label>
            <input id="hadithReferences" class="form-control" type="text" placeholder="مثال: البخاري: 1، مسلم: 2614">
          </div>
          
          <div class="form-check">
            <input id="scholarVerified" class="form-check-input" type="checkbox">
            <label for="scholarVerified" class="form-check-label">محتوى موثق من علماء معتمدين</label>
          </div>
        `;
        
        // Add the section to the form
        const descriptionField = formEl.querySelector('#description');
        if (descriptionField) {
          descriptionField.parentNode.parentNode.insertBefore(metadataSection, descriptionField.parentNode.nextSibling);
        }
        
        // Handle saving the extra metadata
        videoEdit.hookOnFormSubmit(() => {
          const scholarName = document.getElementById('scholarName').value;
          const islamicCategory = document.getElementById('islamicCategory').value;
          const quranReferences = document.getElementById('quranReferences').value;
          const hadithReferences = document.getElementById('hadithReferences').value;
          const scholarVerified = document.getElementById('scholarVerified').checked;
          
          // Add the metadata to the video
          videoEdit.form.pluginData = {
            ...videoEdit.form.pluginData,
            'sabeel-metadata': {
              scholarName,
              islamicCategory,
              quranReferences,
              hadithReferences,
              scholarVerified
            }
          };
        });
      }
    });
  }

  // Enhance video player with Islamic features
  function enhanceVideoPlayer() {
    registerHook({
      target: 'action:video-watch.video.loaded',
      handler: ({ video }) => {
        if (!video.pluginData || !video.pluginData['sabeel-metadata']) return;
        
        const metadata = video.pluginData['sabeel-metadata'];
        
        // Add scholar name if available
        if (metadata.scholarName) {
          const videoInfoName = document.querySelector('.video-info-name');
          if (videoInfoName) {
            const scholarBadge = document.createElement('span');
            scholarBadge.className = 'sabeel-scholar-badge';
            scholarBadge.textContent = metadata.scholarName;
            videoInfoName.appendChild(scholarBadge);
          }
        }
        
        // Add Quran references if available
        if (metadata.quranReferences) {
          const videoDescription = document.querySelector('.video-info-description');
          if (videoDescription) {
            const quranReferences = document.createElement('div');
            quranReferences.className = 'sabeel-quran-reference';
            quranReferences.textContent = `آيات قرآنية: ${metadata.quranReferences}`;
            videoDescription.appendChild(quranReferences);
          }
        }
        
        // Add Hadith references if available
        if (metadata.hadithReferences) {
          const videoDescription = document.querySelector('.video-info-description');
          if (videoDescription) {
            const hadithReferences = document.createElement('div');
            hadithReferences.className = 'sabeel-hadith-reference';
            hadithReferences.textContent = `أحاديث: ${metadata.hadithReferences}`;
            videoDescription.appendChild(hadithReferences);
          }
        }
      }
    });
  }

  // Add Islamic-specific search filters
  function addIslamicSearchFilters() {
    registerHook({
      target: 'action:search.init',
      handler: ({ advancedSearch }) => {
        // Add filters for Islamic categories
        advancedSearch.categories.push(
          { id: 'quran', label: 'القرآن الكريم' },
          { id: 'tafsir', label: 'التفسير' },
          { id: 'hadith', label: 'الحديث' },
          { id: 'fiqh', label: 'الفقه' },
          { id: 'aqeedah', label: 'العقيدة' },
          { id: 'seerah', label: 'السيرة' }
        );
        
        // Add filter for scholar-verified content
        const advancedFiltersEl = document.querySelector('.advanced-search-filters');
        if (advancedFiltersEl) {
          const scholarVerifiedFilter = document.createElement('div');
          scholarVerifiedFilter.className = 'form-check';
          scholarVerifiedFilter.innerHTML = `
            <input id="scholarVerifiedFilter" class="form-check-input" type="checkbox">
            <label for="scholarVerifiedFilter" class="form-check-label">محتوى موثق من علماء</label>
          `;
          advancedFiltersEl.appendChild(scholarVerifiedFilter);
          
          // Hook into the search query
          document.getElementById('scholarVerifiedFilter').addEventListener('change', (event) => {
            if (event.target.checked) {
              advancedSearch.queryString += ' scholar-verified:true';
            } else {
              advancedSearch.queryString = advancedSearch.queryString.replace(' scholar-verified:true', '');
            }
          });
        }
      }
    });
  }

  // Integrate with Sabeel authentication
  function integrateSabeelAuthentication() {
    // Check if user is already logged in to Sabeel
    fetch(SABEEL_API.authentication)
      .then(response => response.json())
      .then(data => {
        if (data.authenticated) {
          console.log('User is authenticated with Sabeel');
          // Update UI to show Sabeel integration
          const userMenuEl = document.querySelector('.logged-in-menu');
          if (userMenuEl) {
            const sabeelLink = document.createElement('a');
            sabeelLink.href = '/sabeel-profile';
            sabeelLink.className = 'dropdown-item';
            sabeelLink.innerHTML = '<i class="icon icon-sabeel"></i> بوابة سبيل';
            userMenuEl.appendChild(sabeelLink);
          }
        }
      })
      .catch(error => console.error('Error checking Sabeel authentication:', error));
  }

  // Add scholar verification badges
  function addScholarVerificationBadges() {
    registerHook({
      target: 'action:video-channel.loaded',
      handler: ({ videoChannel }) => {
        // Check if channel belongs to a verified scholar
        fetch(`${SABEEL_API.scholars}/verify?channelId=${videoChannel.id}`)
          .then(response => response.json())
          .then(data => {
            if (data.verified) {
              const channelNameEl = document.querySelector('.channel-name');
              if (channelNameEl) {
                const verificationBadge = document.createElement('span');
                verificationBadge.className = 'sabeel-scholar-badge';
                verificationBadge.innerHTML = `
                  <i class="icon icon-check"></i> عالم موثق
                `;
                channelNameEl.appendChild(verificationBadge);
              }
            }
          })
          .catch(error => console.error('Error checking scholar verification:', error));
      }
    });
  }

  // Implement Arabic transcription support
  function implementArabicTranscriptionSupport() {
    registerHook({
      target: 'action:video-watch.video.loaded',
      handler: ({ video }) => {
        // Check if video has Arabic transcription
        if (video.language === 'ar') {
          // Mark video container as Arabic
          const videoContainer = document.querySelector('.video-js');
          if (videoContainer) {
            videoContainer.classList.add('video-language-ar');
          }
          
          // Check for available transcriptions
          fetch(`${SABEEL_API.metadata}/transcriptions?videoId=${video.id}`)
            .then(response => response.json())
            .then(data => {
              if (data.hasTranscription) {
                // Add button to toggle Arabic transcription
                const controlBar = document.querySelector('.vjs-control-bar');
                if (controlBar) {
                  const transcriptionButton = document.createElement('button');
                  transcriptionButton.className = 'vjs-control vjs-button sabeel-transcription-button';
                  transcriptionButton.innerHTML = '<span class="vjs-icon-placeholder">نص</span>';
                  transcriptionButton.title = 'عرض النص العربي';
                  
                  controlBar.appendChild(transcriptionButton);
                  
                  // Handle click to show transcription
                  transcriptionButton.addEventListener('click', () => {
                    fetch(`${SABEEL_API.metadata}/transcriptions/${video.id}`)
                      .then(response => response.json())
                      .then(transcriptionData => {
                        showTranscription(transcriptionData.text);
                      });
                  });
                }
              }
            });
        }
      }
    });
    
    // Helper function to display transcription
    function showTranscription(text) {
      let transcriptionEl = document.querySelector('.sabeel-transcription');
      
      if (!transcriptionEl) {
        transcriptionEl = document.createElement('div');
        transcriptionEl.className = 'sabeel-transcription';
        transcriptionEl.style.cssText = `
          padding: 20px;
          background: #f9f9f9;
          border-radius: 4px;
          margin-top: 20px;
          direction: rtl;
          text-align: right;
          font-family: "Noto Sans Arabic", sans-serif;
          line-height: 1.6;
          max-height: 300px;
          overflow-y: auto;
        `;
        
        const videoWatchLeftPanel = document.querySelector('#video-watch-left-column');
        if (videoWatchLeftPanel) {
          videoWatchLeftPanel.appendChild(transcriptionEl);
        }
      }
      
      transcriptionEl.innerHTML = `
        <h4>نص المحتوى:</h4>
        <div class="transcription-text">${text}</div>
      `;
    }
  }
})();
