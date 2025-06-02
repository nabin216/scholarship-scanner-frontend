import { getApiUrl } from '../utils/config';

/**
 * Base API client for making HTTP requests to the backend
 */
export class ApiClient {
  /**
   * Perform a GET request
   * @param endpoint - API endpoint path (without the base URL)
   * @param options - Additional fetch options
   * @returns Promise with the JSON response
   */
  static async get(endpoint: string, options: RequestInit = {}) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this._getAuthHeader(),
        ...(options.headers || {})
      },
      ...options
    });
    
    return this._handleResponse(response);
  }

  /**
   * Perform a POST request
   * @param endpoint - API endpoint path (without the base URL)
   * @param data - Data to send in the request body
   * @param options - Additional fetch options
   * @returns Promise with the JSON response
   */
  static async post(endpoint: string, data: any, options: RequestInit = {}) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this._getAuthHeader(),
        ...(options.headers || {})
      },
      body: JSON.stringify(data),
      ...options
    });
    
    return this._handleResponse(response);
  }

  /**
   * Perform a PUT request
   * @param endpoint - API endpoint path (without the base URL)
   * @param data - Data to send in the request body
   * @param options - Additional fetch options
   * @returns Promise with the JSON response
   */
  static async put(endpoint: string, data: any, options: RequestInit = {}) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this._getAuthHeader(),
        ...(options.headers || {})
      },
      body: JSON.stringify(data),
      ...options
    });
    
    return this._handleResponse(response);
  }

  /**
   * Perform a DELETE request
   * @param endpoint - API endpoint path (without the base URL)
   * @param options - Additional fetch options
   * @returns Promise with the JSON response
   */
  static async delete(endpoint: string, options: RequestInit = {}) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this._getAuthHeader(),
        ...(options.headers || {})
      },
      ...options
    });
    
    return this._handleResponse(response);
  }

  /**
   * Get the authentication header if a token exists
   * @returns Object with Authorization header or empty object
   * @private
   */
  private static _getAuthHeader() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    return {};
  }

  /**
   * Handle API response
   * @param response - Fetch response object
   * @returns Promise with the parsed response
   * @private
   */
  private static async _handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      };
    }
    
    // Check if the response is empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
}

export default ApiClient;
