import ApiService from './apiService';
import { Scholarship } from '../types/scholarship';

/**
 * Service for scholarship-related API operations
 */
export class ScholarshipService {
  /**
   * Get all scholarships with optional filtering
   */
  static async getScholarships(filters: Record<string, any> = {}) {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `scholarships/${queryString ? `?${queryString}` : ''}`;
    
    return ApiService.get(endpoint);
  }
  
  /**
   * Get a scholarship by ID
   */
  static async getScholarshipById(id: string | number) {
    return ApiService.get(`scholarships/${id}/`);
  }
  
  /**
   * Get filter options for scholarships
   */
  static async getFilterOptions() {
    return ApiService.get('scholarships/filter-options/');
  }
  
  /**
   * Search scholarships by keyword
   */
  static async searchScholarships(keyword: string, limit: number = 10) {
    return ApiService.get(`scholarships/?search=${encodeURIComponent(keyword)}&limit=${limit}`);
  }
  
  /**
   * Get featured scholarships
   */
  static async getFeaturedScholarships(limit: number = 8) {
    return ApiService.get(`scholarships/?is_featured=true&limit=${limit}`);
  }
  
  /**
   * Get saved scholarships for current user
   */
  static async getSavedScholarships() {
    return ApiService.get('user/saved-scholarships/', true);
  }
  
  /**
   * Save a scholarship
   */
  static async saveScholarship(scholarshipId: number) {
    return ApiService.post('user/saved-scholarships/', { scholarship: scholarshipId }, true);
  }
  
  /**
   * Remove a saved scholarship
   */
  static async removeSavedScholarship(savedId: number) {
    return ApiService.delete(`user/saved-scholarships/${savedId}/`, true);
  }
  
  /**
   * Get scholarship applications for current user
   */
  static async getApplications() {
    return ApiService.get('user/applications/', true);
  }
}

export default ScholarshipService;
