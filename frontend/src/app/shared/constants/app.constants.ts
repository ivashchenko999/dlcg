/** Base path of the backend API; proxied to ASP.NET Core in development. */
export const API_BASE_URL = '/api';

/** Number of games shown per page on the browse screen. */
export const PAGE_SIZE = 10;

/** Pause after the last keystroke before a search request is sent. */
export const SEARCH_DEBOUNCE_MS = 300;

/** Lifetime and size limits for the in-memory catalogue query cache. */
export const GAME_QUERY_CACHE_TTL_MS = 60_000;
export const GAME_QUERY_CACHE_MAX_ENTRIES = 50;

/** Genres change rarely, so their lookup list can be retained longer. */
export const GENRE_CACHE_TTL_MS = 10 * 60_000;

/** How long a toast notification stays on screen. */
export const TOAST_DELAY_MS = 3000;
