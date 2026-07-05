# API Test Plan - Game Catalog API v1.0.0

**Date Created:** 2026-07-04  
**API URL:** https://gamecatalog-ivashchenko.azurewebsites.net  
**API Base Path:** /api

---

## Executive Summary

This document outlines the comprehensive test plan for the Game Catalog API. The API provides endpoints for managing games and genres with full CRUD operations (Create, Read, Update, Delete).

---

## API Endpoints Overview

### Games Resource
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Games` | List all games with pagination and filtering |
| POST | `/api/Games` | Create a new game |
| GET | `/api/Games/{id}` | Get a specific game by ID |
| PUT | `/api/Games/{id}` | Update an existing game |
| DELETE | `/api/Games/{id}` | Delete a game |

### Genres Resource
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Genres` | List all available genres |

---

## Test Cases

### 1. GET /api/Games - List All Games

**Test ID:** TC_GET_GAMES_001  
**Priority:** High  
**Purpose:** Verify that the API returns a list of all games with correct structure

**Prerequisites:**
- API server is running
- Database contains at least one game record

**Test Steps:**
1. Send GET request to `/api/Games`
2. Verify response status code is 200 (OK)
3. Verify response contains paginated results
4. Verify response structure includes:
   - `items[]` or `data[]` array with game objects
   - Pagination metadata (pageNumber, pageSize, total, etc.)
5. Verify each game object contains expected fields:
   - `id` (GUID/UUID)
   - `name` (string)
   - `description` (string)
   - `genreId` (GUID/UUID)
   - `releaseDate` (ISO 8601 date)
   - `price` (decimal)

**Expected Result:**
- Status: 200 OK
- Response body contains valid JSON with paginated games list
- All game objects have complete data

**Test Data:** No request body required

---

### 2. GET /api/Games - With Pagination Parameters

**Test ID:** TC_GET_GAMES_002  
**Priority:** High  
**Purpose:** Verify pagination works correctly

**Test Steps:**
1. Send GET request with query parameters: `?pageNumber=1&pageSize=10`
2. Verify response status code is 200
3. Verify returned items count ≤ pageSize
4. Verify pagination metadata is correct
5. Send request with `pageNumber=2` and verify different results

**Expected Result:**
- Status: 200 OK
- Pagination parameters are respected
- Results differ between pages

---

### 3. GET /api/Games - Error Handling

**Test ID:** TC_GET_GAMES_003  
**Priority:** Medium  
**Purpose:** Verify error handling for invalid pagination

**Test Steps:**
1. Send GET request with invalid pageNumber (e.g., -1 or 999999)
2. Verify appropriate error response
3. Send GET request with invalid pageSize (e.g., 0 or -1)
4. Verify appropriate error response

**Expected Result:**
- Status: 400 (Bad Request) or 422 (Unprocessable Entity)
- Error message is descriptive

---

### 4. POST /api/Games - Create New Game

**Test ID:** TC_POST_GAMES_001  
**Priority:** High  
**Purpose:** Verify ability to create a new game

**Prerequisites:**
- At least one genre exists in the system

**Test Steps:**
1. Get list of genres from GET /api/Genres
2. Create request body with valid game data:
   ```json
   {
     "name": "Test Game Alpha",
     "description": "A test game for API validation",
     "genreId": "<valid-genre-id>",
     "releaseDate": "2026-07-04",
     "price": 29.99
   }
   ```
3. Send POST request to `/api/Games`
4. Verify response status code is 201 (Created) or 200 (OK)
5. Verify response contains created game object with ID
6. Verify returned game has all submitted fields

**Expected Result:**
- Status: 201 Created (or 200 OK)
- Response contains game object with generated ID
- Game ID can be used for subsequent GET/PUT/DELETE operations

---

### 5. POST /api/Games - Validation Errors

**Test ID:** TC_POST_GAMES_002  
**Priority:** High  
**Purpose:** Verify input validation

**Test Cases:**

**5a. Missing Required Fields**
- Test Steps: Send POST with missing `name` field
- Expected: 400/422 Bad Request with validation error

**5b. Invalid Genre ID**
- Test Steps: Send POST with non-existent `genreId`
- Expected: 400/422 Bad Request or 404 Not Found

**5c. Invalid Price**
- Test Steps: Send POST with negative price
- Expected: 400/422 Bad Request with validation error

**5d. Invalid Release Date Format**
- Test Steps: Send POST with malformed date
- Expected: 400/422 Bad Request with validation error

**5e. Empty Name**
- Test Steps: Send POST with empty string for `name`
- Expected: 400/422 Bad Request with validation error

---

### 6. GET /api/Games/{id} - Get Single Game

**Test ID:** TC_GET_GAMES_BY_ID_001  
**Priority:** High  
**Purpose:** Verify ability to retrieve a specific game

**Prerequisites:**
- At least one game exists in the system

**Test Steps:**
1. Get a game ID from GET /api/Games
2. Send GET request to `/api/Games/{id}` with valid ID
3. Verify response status code is 200 (OK)
4. Verify response contains correct game object
5. Verify all game fields are present

**Expected Result:**
- Status: 200 OK
- Response contains complete game object matching the requested ID

---

### 7. GET /api/Games/{id} - Not Found

**Test ID:** TC_GET_GAMES_BY_ID_002  
**Priority:** High  
**Purpose:** Verify error handling for non-existent game

**Test Steps:**
1. Send GET request with non-existent ID (e.g., `00000000-0000-0000-0000-000000000000`)
2. Verify response status code is 404 (Not Found)
3. Verify error response is descriptive

**Expected Result:**
- Status: 404 Not Found
- Error message indicates game not found

---

### 8. GET /api/Games/{id} - Invalid ID Format

**Test ID:** TC_GET_GAMES_BY_ID_003  
**Priority:** Medium  
**Purpose:** Verify validation of ID parameter

**Test Steps:**
1. Send GET request with invalid ID format (e.g., `not-a-uuid`)
2. Verify response status code is 400 (Bad Request) or 404
3. Verify error message

**Expected Result:**
- Status: 400 or 404
- Error indicates invalid ID format

---

### 9. PUT /api/Games/{id} - Update Game

**Test ID:** TC_PUT_GAMES_001  
**Priority:** High  
**Purpose:** Verify ability to update an existing game

**Prerequisites:**
- At least one game exists in the system

**Test Steps:**
1. Get a game ID from GET /api/Games
2. Prepare update request body:
   ```json
   {
     "name": "Updated Game Name",
     "description": "Updated description",
     "genreId": "<valid-genre-id>",
     "releaseDate": "2026-07-05",
     "price": 39.99
   }
   ```
3. Send PUT request to `/api/Games/{id}`
4. Verify response status code is 200 (OK)
5. Verify response contains updated game object
6. Send GET request to verify changes persisted
7. Verify all updated fields are correct

**Expected Result:**
- Status: 200 OK
- Response contains updated game object
- Changes are persisted (verified by GET request)

---

### 10. PUT /api/Games/{id} - Partial Update

**Test ID:** TC_PUT_GAMES_002  
**Priority:** Medium  
**Purpose:** Verify partial updates work correctly

**Test Steps:**
1. Get a game and its current state
2. Update only one field (e.g., just the name)
3. Verify other fields remain unchanged
4. Verify updated field has new value

**Expected Result:**
- Updated fields are changed
- Non-updated fields retain their previous values

---

### 11. PUT /api/Games/{id} - Validation Errors

**Test ID:** TC_PUT_GAMES_003  
**Priority:** High  
**Purpose:** Verify input validation on update

**Test Cases:**

**11a. Invalid Genre ID**
- Test Steps: Update with non-existent `genreId`
- Expected: 400/422 Bad Request

**11b. Negative Price**
- Test Steps: Update with negative price
- Expected: 400/422 Bad Request

**11c. Empty Name**
- Test Steps: Update with empty string name
- Expected: 400/422 Bad Request

---

### 12. PUT /api/Games/{id} - Not Found

**Test ID:** TC_PUT_GAMES_004  
**Priority:** High  
**Purpose:** Verify error handling for non-existent game

**Test Steps:**
1. Send PUT request to non-existent game ID
2. Verify response status code is 404 (Not Found)

**Expected Result:**
- Status: 404 Not Found
- Error message indicates game not found

---

### 13. DELETE /api/Games/{id} - Delete Game

**Test ID:** TC_DELETE_GAMES_001  
**Priority:** High  
**Purpose:** Verify ability to delete a game

**Prerequisites:**
- At least one game exists that can be deleted

**Test Steps:**
1. Create a new game via POST /api/Games
2. Get the created game's ID
3. Send DELETE request to `/api/Games/{id}`
4. Verify response status code is 204 (No Content) or 200 (OK)
5. Send GET request to verify game no longer exists
6. Verify error response is 404 when trying to GET deleted game

**Expected Result:**
- Status: 204 No Content or 200 OK
- Game no longer exists after deletion
- Subsequent GET request returns 404

---

### 14. DELETE /api/Games/{id} - Not Found

**Test ID:** TC_DELETE_GAMES_002  
**Priority:** High  
**Purpose:** Verify error handling for non-existent game

**Test Steps:**
1. Send DELETE request to non-existent game ID
2. Verify response status code is 404 (Not Found)

**Expected Result:**
- Status: 404 Not Found
- Idempotent behavior expected (no error on already-deleted resource)

---

### 15. DELETE /api/Games/{id} - Cascading Deletes

**Test ID:** TC_DELETE_GAMES_003  
**Priority:** Medium  
**Purpose:** Verify data integrity after deletion

**Test Steps:**
1. Delete a game
2. Verify that related data (if any) is handled correctly
3. Verify no orphaned records remain

**Expected Result:**
- No database integrity violations
- Related data is properly handled

---

### 16. GET /api/Genres - List All Genres

**Test ID:** TC_GET_GENRES_001  
**Priority:** High  
**Purpose:** Verify ability to retrieve all available genres

**Test Steps:**
1. Send GET request to `/api/Genres`
2. Verify response status code is 200 (OK)
3. Verify response contains list of genres
4. Verify each genre object contains:
   - `id` (GUID/UUID)
   - `name` (string)

**Expected Result:**
- Status: 200 OK
- Response contains array of genre objects
- All genres have required fields

---

### 17. Cross-Resource Consistency

**Test ID:** TC_CROSS_RESOURCE_001  
**Priority:** Medium  
**Purpose:** Verify data consistency across resources

**Test Steps:**
1. Get all genres
2. Get all games
3. For each game, verify its `genreId` exists in genres list
4. Create a new game with a valid genre ID
5. Verify game references existing genre

**Expected Result:**
- All game genreIds reference valid genres
- No orphaned game-genre relationships

---

### 18. Concurrency and Performance

**Test ID:** TC_PERFORMANCE_001  
**Priority:** Low  
**Purpose:** Verify API performance under basic load

**Test Steps:**
1. Send 10 concurrent GET requests to `/api/Games`
2. Measure response time for each request
3. Verify all requests complete successfully
4. Verify response times are acceptable (< 2 seconds per request)

**Expected Result:**
- All requests return 200 OK
- Response times are consistent
- No race conditions or errors

---

### 19. Error Response Format

**Test ID:** TC_ERROR_RESPONSES_001  
**Priority:** Medium  
**Purpose:** Verify error response structure is consistent

**Test Steps:**
1. Trigger various error conditions (400, 404, 500, etc.)
2. Verify each error response has consistent structure:
   - Status code
   - Error message
   - Error details (if applicable)
   - Timestamp

**Expected Result:**
- All error responses follow same schema
- Error messages are clear and actionable

---

### 20. Content Type and Encoding

**Test ID:** TC_CONTENT_TYPE_001  
**Priority:** Medium  
**Purpose:** Verify correct content-type headers

**Test Steps:**
1. Send requests and verify Content-Type header
2. Verify all responses use `application/json`
3. Verify proper UTF-8 encoding for special characters

**Expected Result:**
- All responses have `Content-Type: application/json`
- Proper encoding for international characters

---

## Test Execution Order

1. **Phase 1 - Setup & Validation** (Run First)
   - TC_GET_GENRES_001 (Get genres to use for game creation)
   - TC_GET_GAMES_001 (Verify list endpoint works)

2. **Phase 2 - Create Operations**
   - TC_POST_GAMES_001 (Create valid game)
   - TC_POST_GAMES_002 (Test validation)

3. **Phase 3 - Read Operations**
   - TC_GET_GAMES_BY_ID_001 (Get single game)
   - TC_GET_GAMES_BY_ID_002 (Test not found)
   - TC_GET_GAMES_BY_ID_003 (Test invalid format)

4. **Phase 4 - Update Operations**
   - TC_PUT_GAMES_001 (Update game)
   - TC_PUT_GAMES_002 (Partial update)
   - TC_PUT_GAMES_003 (Validation)
   - TC_PUT_GAMES_004 (Not found)

5. **Phase 5 - Delete Operations**
   - TC_DELETE_GAMES_001 (Delete game)
   - TC_DELETE_GAMES_002 (Not found)

6. **Phase 6 - Cross-Functional Tests**
   - TC_GET_GAMES_002 (Pagination)
   - TC_GET_GAMES_003 (Error handling)
   - TC_CROSS_RESOURCE_001 (Data consistency)
   - TC_CONTENT_TYPE_001 (Headers)

7. **Phase 7 - Performance** (Run Last)
   - TC_PERFORMANCE_001 (Concurrency)

---

## Test Environment

- **Base URL:** https://gamecatalog-ivashchenko.azurewebsites.net
- **Protocol:** HTTPS
- **Content-Type:** application/json
- **Expected Response Time:** < 2 seconds

---

## Acceptance Criteria

- ✅ All GET endpoints return correct data
- ✅ All POST endpoints create resources correctly
- ✅ All PUT endpoints update resources correctly
- ✅ All DELETE endpoints remove resources correctly
- ✅ All validation errors return appropriate HTTP status codes
- ✅ Error responses are descriptive and actionable
- ✅ Data integrity is maintained across operations
- ✅ Pagination works correctly
- ✅ All endpoints return correct Content-Type headers
- ✅ Concurrent requests are handled properly

---

## Notes

- Ensure test data is properly cleaned up after tests
- Use consistent test data values across test runs
- Document any environment-specific behaviors
- Monitor API logs during testing for any warnings or errors
