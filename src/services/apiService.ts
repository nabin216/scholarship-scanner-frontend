import config from '../utils/config';

/**
 * API Service for interacting with the backend
 */
export class ApiService {  /**
   * Get the full API URL for a specific endpoint
   * @param path - The API endpoint path
   * @returns The complete API URL
   */  static getApiUrl(path: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Ensure the API URL doesn't end with a slash before concatenating
    const baseUrl = config.apiUrl.endsWith('/') ? config.apiUrl.slice(0, -1) : config.apiUrl;
    return `${baseUrl}/${cleanPath}`;
  }
  
  /**
   * Get configuration values
   * @returns Application configuration object
   */
  static getConfig() {
    return config;
  }

  /**
   * Get authorization headers if user is authenticated
   * @returns Headers object with authorization token if available
   */
  static getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
    }

    return headers;
  }

  /**
   * Make a GET request
   * @param endpoint - API endpoint
   * @param authenticated - Whether request requires authentication
   * @returns Promise with response data
   */
  static async get(endpoint: string, authenticated: boolean = false): Promise<any> {
    const url = this.getApiUrl(endpoint);
    const headers = authenticated ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return this.parseResponse(response);
  }

  /**
   * Make a POST request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param authenticated - Whether request requires authentication
   * @returns Promise with response data
   */
  static async post(endpoint: string, data: any, authenticated: boolean = false): Promise<any> {
    const url = this.getApiUrl(endpoint);
    const headers = authenticated ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return this.parseResponse(response);
  }

  /**
   * Make a PUT request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param authenticated - Whether request requires authentication
   * @returns Promise with response data
   */
  static async put(endpoint: string, data: any, authenticated: boolean = true): Promise<any> {
    const url = this.getApiUrl(endpoint);
    const headers = authenticated ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return this.parseResponse(response);
  }

  /**
   * Make a DELETE request
   * @param endpoint - API endpoint
   * @param authenticated - Whether request requires authentication
   * @returns Promise with response data
   */
  static async delete(endpoint: string, authenticated: boolean = true): Promise<any> {
    const url = this.getApiUrl(endpoint);
    const headers = authenticated ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return this.parseResponse(response);
  }

  /**
   * Parse response based on content
   * @param response - Fetch response object
   * @returns Parsed response data
   */
  private static async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }
    return response.text();
  }

  /**
   * Handle error responses
   * @param response - Error response
   * @returns Error object
   */
  private static async handleError(response: Response): Promise<Error> {
    let errorMessage = `HTTP error ${response.status}`;
    
    try {
      const data = await response.json();
      if (data.detail) {
        errorMessage = data.detail;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      }
    } catch (e) {
      // If we can't parse JSON, just use the status text
      errorMessage = response.statusText;
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    return error;
  }
}

export default ApiService;
