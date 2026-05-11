export interface PageResponse<T> {
  content?: T[];
}

export function extractCollection<T>(response: T[] | PageResponse<T>): T[] {
  return Array.isArray(response) ? response : response.content ?? [];
}

export function apiErrorMessage(error: unknown, fallback = 'Nao foi possivel concluir a operacao.'): string {
  if (typeof error === 'object' && error && 'error' in error) {
    const payload = (error as { error?: { message?: string; erro?: string } }).error;
    return payload?.message ?? payload?.erro ?? fallback;
  }

  return fallback;
}
