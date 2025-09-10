import { logEvent } from 'firebase/analytics';
import { fireAnalytics } from './index';

export const analytics = {
  // Page views
  trackPageView(pageName) {
    logEvent(fireAnalytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  },

  // User actions
  trackSignUp(method) {
    logEvent(fireAnalytics, 'sign_up', { method });
  },

  trackLogin(method) {
    logEvent(fireAnalytics, 'login', { method });
  },

  // Job-related events
  trackJobView(jobId, jobTitle) {
    logEvent(fireAnalytics, 'view_item', {
      item_id: jobId,
      item_name: jobTitle,
      item_category: 'job'
    });
  },

  trackJobApplication(jobId, jobTitle) {
    logEvent(fireAnalytics, 'select_content', {
      content_type: 'job_application',
      item_id: jobId,
      item_name: jobTitle
    });
  },

  trackJobPost() {
    logEvent(fireAnalytics, 'post_score', {
      content_type: 'job_posting'
    });
  },

  // Search events
  trackSearch(searchTerm) {
    logEvent(fireAnalytics, 'search', {
      search_term: searchTerm
    });
  }
};