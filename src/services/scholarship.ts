import ApiClient from './api';
import { Scholarship } from '../types/scholarship';

/**
 * Service for scholarship-related API operations
 */
export class ScholarshipService {
  /**
   * Get a list of scholarships with optional filtering
   * @param params - Query parameters for filtering, pagination, etc.
   * @returns Promise with scholarships and pagination data
   */
  static async getScholarships(params = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    const endpoint = `scholarships/${queryString ? `?${queryString}` : ''}`;
    
    return ApiClient.get(endpoint);
  }

  /**
   * Get a single scholarship by ID
   * @param id - Scholarship ID
   * @returns Promise with the scholarship data
   */
  static async getScholarshipById(id: string | number) {
    return ApiClient.get(`scholarships/${id}/`);
  }

  /**
   * Save a scholarship to user's favorites
   * @param scholarshipId - ID of the scholarship to save
   * @returns Promise with the saved scholarship data
   */
  static async saveScholarship(scholarshipId: string | number) {
    return ApiClient.post('users/saved-scholarships/', { scholarship: scholarshipId });
  }

  /**
   * Remove a scholarship from user's favorites
   * @param savedId - ID of the saved scholarship record
   * @returns Promise with the operation result
   */
  static async removeSavedScholarship(savedId: string | number) {
    return ApiClient.delete(`users/saved-scholarships/${savedId}/`);
  }

  /**
   * Get user's saved scholarships
   * @returns Promise with the saved scholarships data
   */
  static async getSavedScholarships() {
    return ApiClient.get('users/saved-scholarships/');
  }

  /**
   * Apply for a scholarship
   * @param scholarshipId - ID of the scholarship to apply for
   * @param applicationData - Application form data
   * @returns Promise with the application data
   */
  static async applyForScholarship(scholarshipId: string | number, applicationData: any) {
    return ApiClient.post(`scholarships/${scholarshipId}/apply/`, applicationData);
  }
}

export default ScholarshipService;
