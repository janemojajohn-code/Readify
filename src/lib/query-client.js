/**
 * Query Client state helper
 */
class SimpleQueryClient {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  invalidateQueries(key) {
    this.listeners.forEach((listener) => listener(key));
  }
}

export const queryClient = new SimpleQueryClient();
