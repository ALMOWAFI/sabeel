/**
 * Sabeel Canvas LMS Theme Customization
 * 
 * This file contains custom theming and branding for Canvas LMS
 * to integrate with the Sabeel Islamic Knowledge Platform.
 */

(function() {
  // Sabeel brand colors
  const SABEEL_COLORS = {
    primary: '#10B981',
    secondary: '#0F172A',
    accent: '#6366F1',
    light: '#F8FAFC',
    dark: '#1E293B',
  };

  // Add custom CSS
  const addCustomStyles = () => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root {
        --ic-brand-primary: ${SABEEL_COLORS.primary};
        --ic-brand-button--primary-bgd: ${SABEEL_COLORS.primary};
        --ic-brand-button--primary-text: #ffffff;
        --ic-brand-font-color-dark: ${SABEEL_COLORS.secondary};
        --ic-link-color: ${SABEEL_COLORS.accent};
        --ic-brand-global-nav-bgd: ${SABEEL_COLORS.secondary};
        --ic-brand-global-nav-logo-bgd: ${SABEEL_COLORS.dark};
      }
      
      /* RTL Support for Arabic */
      [dir="rtl"] {
        font-family: "Noto Sans Arabic", sans-serif;
      }
      
      /* Prayer Times Widget */
      .sabeel-prayer-times {
        background: ${SABEEL_COLORS.light};
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 16px;
        border-left: 4px solid ${SABEEL_COLORS.primary};
      }
      
      /* Islamic Calendar */
      .sabeel-islamic-date {
        color: ${SABEEL_COLORS.accent};
        font-weight: 500;
        display: inline-block;
        margin-left: 8px;
      }
      
      /* Scholar Verification Badge */
      .sabeel-verified-scholar {
        background: ${SABEEL_COLORS.accent}20;
        color: ${SABEEL_COLORS.accent};
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      
      /* Islamic Custom Modules */
      .sabeel-module-header {
        border-bottom: 2px solid ${SABEEL_COLORS.primary};
        padding-bottom: 8px;
        margin-bottom: 16px;
      }
    `;
    document.head.appendChild(styleElement);
  };

  // Add Sabeel logo to Canvas
  const updateLogo = () => {
    const logoElement = document.querySelector('.ic-app-header__logomark');
    if (logoElement) {
      logoElement.innerHTML = '<img src="/sabeel-logo.png" alt="Sabeel" height="30" />';
    }
  };

  // Add Islamic date to header
  const addIslamicDate = () => {
    const header = document.querySelector('#dashboard_header_container');
    if (header) {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'sabeel-islamic-date';
      // This would ideally call a function to get the actual Islamic date
      dateDiv.innerHTML = 'التاريخ الهجري: ١٥ رمضان ١٤٤٦';
      header.appendChild(dateDiv);
    }
  };

  // Add prayer times widget
  const addPrayerTimesWidget = () => {
    const sidebar = document.querySelector('.right-side-wrapper');
    if (sidebar) {
      const prayerWidget = document.createElement('div');
      prayerWidget.className = 'sabeel-prayer-times';
      prayerWidget.innerHTML = `
        <h4>مواقيت الصلاة</h4>
        <div class="prayer-times-list">
          <div class="prayer-time-item">الفجر: 4:32 ص</div>
          <div class="prayer-time-item">الظهر: 12:15 م</div>
          <div class="prayer-time-item">العصر: 3:45 م</div>
          <div class="prayer-time-item">المغرب: 6:52 م</div>
          <div class="prayer-time-item">العشاء: 8:22 م</div>
        </div>
      `;
      sidebar.prepend(prayerWidget);
    }
  };

  // Initialize functionality when DOM is ready
  const initialize = () => {
    addCustomStyles();
    
    // Run these only on main dashboard and pages where relevant
    if (window.location.pathname.includes('/dashboard') || window.location.pathname === '/') {
      updateLogo();
      addIslamicDate();
      addPrayerTimesWidget();
    }
    
    console.log('Sabeel Canvas theming initialized');
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
