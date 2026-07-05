# Video Game Catalogue - Test Plan

## Overview

This document outlines the comprehensive test plan for the Video Game Catalogue application. It covers all functional features, edge cases, and quality criteria that should be verified before deployment.

**Live Demo:** https://gamecatalog-ivashchenko.azurewebsites.net

---

## Test Environment Setup

### Prerequisites
- Web browser (Chrome, Firefox, Safari, or Edge)
- Access to the live application
- Basic understanding of CRUD operations
- Sample data is pre-populated in the database

### Test Data
- Initial game count: 98 games
- Available genres: Action, Adventure, RPG, Shooter, Simulation, Strategy

---

## Feature Test Cases

### 1. Game List Display

#### TC-1.1: Display All Games
- **Objective:** Verify that the games list displays correctly on initial load
- **Steps:**
  1. Navigate to `https://gamecatalog-ivashchenko.azurewebsites.net/games`
  2. Verify the page loads without errors
- **Expected Result:** 
  - Games table displays with all columns (Title, Genre, Developer, Release Date, Price, Actions)
  - Game counter shows "98" (or current database count)
  - All games are visible in a tabular format
  - Edit and Delete buttons are present for each game

#### TC-1.2: Verify Column Headers
- **Objective:** Confirm all column headers are present and labeled correctly
- **Steps:**
  1. Inspect the table header row
- **Expected Result:**
  - Headers present: Title, Genre, Developer, Release Date, Price, Actions
  - All headers are clickable for sorting

#### TC-1.3: Verify Action Buttons
- **Objective:** Ensure edit and delete buttons are present for each game
- **Steps:**
  1. Look at any game row in the table
- **Expected Result:**
  - Edit icon (pencil) is visible and clickable
  - Delete icon (trash) is visible and clickable

---

### 2. Search Functionality

#### TC-2.1: Search by Game Title
- **Objective:** Verify search filters games by title in real-time
- **Steps:**
  1. Click on the "Search by title..." input field
  2. Type "assassin"
  3. Wait 1 second for results to update
- **Expected Result:**
  - URL changes to `?q=assassin`
  - Game counter updates to show 1 game
  - Only "Assassin's Creed Odyssey" is displayed
  - Search input shows "assassin"

#### TC-2.2: Search with Partial Title
- **Objective:** Verify partial word search works
- **Steps:**
  1. Clear the search field
  2. Type "war"
- **Expected Result:**
  - Multiple games with "war" in title appear (e.g., Warcraft, God of War)
  - Counter shows the correct number of results

#### TC-2.3: Search Case Insensitivity
- **Objective:** Verify search is case-insensitive
- **Steps:**
  1. Clear the search field
  2. Type "GOD OF WAR" (uppercase)
- **Expected Result:**
  - Results match "God of War" despite case difference
  - Same results as typing "god of war"

#### TC-2.4: Clear Search
- **Objective:** Verify search can be cleared
- **Steps:**
  1. Perform a search
  2. Click the "X" button that appears in the search field
  3. Or clear the field manually
- **Expected Result:**
  - Search field becomes empty
  - URL returns to `/games`
  - All games are displayed again
  - Counter shows 98 (or full count)

#### TC-2.5: Search with No Results
- **Objective:** Verify behavior when search returns no results
- **Steps:**
  1. Search for "xyzabc123notreal"
- **Expected Result:**
  - Counter shows "0"
  - Empty state message displays (or empty table)
  - No errors in console

---

### 3. Genre Filter

#### TC-3.1: Filter by Action Genre
- **Objective:** Verify filtering by genre works
- **Steps:**
  1. Navigate to `https://gamecatalog-ivashchenko.azurewebsites.net/games?genre=Action`
  2. Wait for results to load
- **Expected Result:**
  - Counter shows 16 games
  - All visible games have "Action" badge in the Genre column
  - URL contains `?genre=Action`
  - Games displayed include: Assassin's Creed Odyssey, Batman: Arkham City, etc.

#### TC-3.2: Filter by Strategy Genre
- **Objective:** Verify filtering works for different genre
- **Steps:**
  1. Navigate to `https://gamecatalog-ivashchenko.azurewebsites.net/games?genre=Strategy`
- **Expected Result:**
  - Counter updates to show Strategy games (typically 18)
  - All visible games show "Strategy" badge
  - URL shows `?genre=Strategy`

#### TC-3.3: Filter with Dropdown (UI)
- **Objective:** Verify genre dropdown selector works if implemented
- **Steps:**
  1. Click on "All genres" dropdown
  2. Select "RPG"
- **Expected Result:**
  - Dropdown updates to show "RPG"
  - Games list filters to RPG games
  - Counter updates
  - URL updates with `?genre=RPG`

#### TC-3.4: Clear Genre Filter
- **Objective:** Verify genre filter can be cleared
- **Steps:**
  1. With a genre filter applied, click on "All genres" in the dropdown
  2. Or navigate to `/games` without genre parameter
- **Expected Result:**
  - Dropdown shows "All genres"
  - All 98 games display
  - Counter shows 98

---

### 4. Sorting

#### TC-4.1: Sort by Title (A-Z)
- **Objective:** Verify sorting by title in ascending order
- **Steps:**
  1. Click on the "Title" column header
- **Expected Result:**
  - Games sort alphabetically A-Z
  - First game starts with "A" (Age of Empires II...)
  - URL shows `?sort=title&order=asc`
  - Title header shows up arrow indicator

#### TC-4.2: Sort by Title (Z-A)
- **Objective:** Verify sorting reverses on second click
- **Steps:**
  1. Click the "Title" header again
- **Expected Result:**
  - Games sort alphabetically Z-A
  - First game starts with "X" or "W" (XCOM, Wolfenstein, etc.)
  - URL shows `?sort=title&order=desc`
  - Title header shows down arrow indicator

#### TC-4.3: Sort by Price
- **Objective:** Verify sorting by price works
- **Steps:**
  1. Click on the "Price" column header
- **Expected Result:**
  - Games sort by price ascending ($9.99 first)
  - URL shows `?sort=price&order=asc`

#### TC-4.4: Sort by Release Date
- **Objective:** Verify sorting by release date
- **Steps:**
  1. Click on "Release Date" header
- **Expected Result:**
  - Games sort by date ascending (oldest first)
  - URL shows `?sort=releaseDate&order=asc`

#### TC-4.5: Sort by Developer
- **Objective:** Verify sorting by developer name
- **Steps:**
  1. Click on "Developer" header
- **Expected Result:**
  - Games sort by developer name alphabetically
  - URL shows `?sort=developer&order=asc`

#### TC-4.6: Sort by Genre
- **Objective:** Verify sorting by genre
- **Steps:**
  1. Click on "Genre" header
- **Expected Result:**
  - Games sort by genre alphabetically
  - URL shows `?sort=genre&order=asc`

---

### 5. Pagination

#### TC-5.1: Navigate to Page 2
- **Objective:** Verify pagination works
- **Steps:**
  1. On page 1, click the "2" button in pagination
  2. Wait for page to load
- **Expected Result:**
  - Page 2 loads with different games
  - URL shows `?page=2`
  - Pagination shows page "2" as active (highlighted)
  - Games are different from page 1

#### TC-5.2: Use Next Button
- **Objective:** Verify "Next" pagination button
- **Steps:**
  1. On page 1, click the "Next" (→) button
- **Expected Result:**
  - Navigates to page 2
  - URL shows `?page=2`

#### TC-5.3: Use Previous Button
- **Objective:** Verify "Previous" pagination button
- **Steps:**
  1. On page 2, click the "Previous" (←) button
- **Expected Result:**
  - Navigates back to page 1
  - URL shows `?page=1`

#### TC-5.4: Jump to Last Page
- **Objective:** Verify navigation to last page
- **Steps:**
  1. Click on the last page number (e.g., "10")
- **Expected Result:**
  - Last page loads
  - Fewer items may be displayed on last page
  - URL shows `?page=10`

#### TC-5.5: Pagination with Search
- **Objective:** Verify pagination works with active search
- **Steps:**
  1. Search for a term that returns multiple pages of results
  2. Navigate between pages
- **Expected Result:**
  - Pagination respects the search filter
  - URL shows both `?q=...&page=2`
  - Results are filtered and paginated correctly

---

### 6. Create Game

#### TC-6.1: Open Add Game Form
- **Objective:** Verify the add game form opens
- **Steps:**
  1. Click the "+ Add game" button (top right)
  2. Wait for form to load
- **Expected Result:**
  - Form page loads at `/games/new`
  - Form title shows "+ New game"
  - All form fields are visible: Title, Developer, Genre, Release date, Price
  - Save and Cancel buttons are present

#### TC-6.2: Fill Out Add Game Form
- **Objective:** Verify all form fields accept input
- **Steps:**
  1. Fill in the form with valid data:
     - Title: "Test Game 2025"
     - Developer: "Test Studio"
     - Genre: "Action" (select from dropdown)
     - Release date: "2025-03-15"
     - Price: "39.99"
- **Expected Result:**
  - All fields accept input
  - Data appears in the form as typed
  - No validation errors appear yet

#### TC-6.3: Save New Game
- **Objective:** Verify new game is created successfully
- **Steps:**
  1. With form completed, click "Save" button
  2. Wait for response
- **Expected Result:**
  - Form submits successfully
  - Redirects to games list
  - New game appears in the list (verify by searching for "Test Game 2025")
  - Game counter increases (98 → 99)
  - Toast notification shows success (optional)

#### TC-6.4: Verify Game Data Saved
- **Objective:** Verify all data was saved correctly
- **Steps:**
  1. Search for "Test Game 2025"
  2. Verify the game details in the list
- **Expected Result:**
  - Title: "Test Game 2025"
  - Developer: "Test Studio"
  - Genre: "Action"
  - Release Date: "Mar 15, 2025"
  - Price: "$39.99"

#### TC-6.5: Cancel Form Without Saving
- **Objective:** Verify cancel button doesn't save data
- **Steps:**
  1. Click "+ Add game"
  2. Enter some data
  3. Click "Cancel" button
- **Expected Result:**
  - Returns to games list without saving
  - No new game created
  - Game counter remains unchanged

#### TC-6.6: Form Validation - Empty Title
- **Objective:** Verify form requires title
- **Steps:**
  1. Click "+ Add game"
  2. Leave Title empty
  3. Fill other fields
  4. Try to click Save
- **Expected Result:**
  - Form shows validation error for Title field
  - Save button may be disabled or shows error message
  - Form does not submit

#### TC-6.7: Form Validation - Empty Developer
- **Objective:** Verify form requires developer
- **Steps:**
  1. Fill all fields except Developer
  2. Try to click Save
- **Expected Result:**
  - Validation error for Developer field
  - Form does not submit

#### TC-6.8: Form Validation - Empty Genre
- **Objective:** Verify form requires genre selection
- **Steps:**
  1. Fill all fields except Genre (leave as "Choose a genre...")
  2. Try to click Save
- **Expected Result:**
  - Validation error for Genre field
  - Form does not submit

#### TC-6.9: Form Validation - Invalid Price
- **Objective:** Verify price validation
- **Steps:**
  1. Complete form and enter invalid price: "-5" or "999999"
  2. Try to save
- **Expected Result:**
  - Price field shows validation error
  - Price must be between $0 and $10,000
  - Form does not submit with invalid price

---

### 7. Edit Game

#### TC-7.1: Open Edit Form
- **Objective:** Verify edit form opens for a game
- **Steps:**
  1. Search for "Test Game 2025" (created in TC-6.3)
  2. Click the edit icon (pencil) in the Actions column
- **Expected Result:**
  - Edit form opens at `/games/{id}/edit`
  - All fields are pre-populated with current data
  - Title shows "Edit game" (or similar)
  - Save and Cancel buttons are present

#### TC-7.2: Verify Form Data Pre-filled
- **Objective:** Verify all current game data loads in the form
- **Steps:**
  1. With edit form open, verify each field
- **Expected Result:**
  - Title field shows "Test Game 2025"
  - Developer field shows "Test Studio"
  - Genre dropdown shows "Action"
  - Release date shows "2025-03-15"
  - Price field shows "39.99"

#### TC-7.3: Edit Game Price
- **Objective:** Verify game data can be updated
- **Steps:**
  1. Change Price from "39.99" to "49.99"
  2. Click Save
- **Expected Result:**
  - Form submits successfully
  - Redirects to games list
  - Search for the game and verify new price is "$49.99"
  - URL shows updated parameter if applicable

#### TC-7.4: Edit Game Title
- **Objective:** Verify title can be edited
- **Steps:**
  1. Open edit form for Test Game
  2. Change title to "Test Game Updated"
  3. Click Save
- **Expected Result:**
  - Title updates in the list
  - Search for "Test Game Updated" finds the game

#### TC-7.5: Edit Game Genre
- **Objective:** Verify genre can be changed
- **Steps:**
  1. Open edit form for Test Game
  2. Change Genre from "Action" to "RPG"
  3. Click Save
- **Expected Result:**
  - Genre updates to "RPG"
  - Visible in the list immediately

#### TC-7.6: Cancel Edit Without Saving
- **Objective:** Verify cancel discards changes
- **Steps:**
  1. Open edit form
  2. Change some fields
  3. Click Cancel
- **Expected Result:**
  - Returns to games list without saving
  - Original game data is unchanged

#### TC-7.7: Edit Form Validation
- **Objective:** Verify edit form validates same as create form
- **Steps:**
  1. Open edit form
  2. Clear Title field
  3. Try to save
- **Expected Result:**
  - Validation error appears
  - Form does not submit

---

### 8. Delete Game

#### TC-8.1: Open Delete Confirmation
- **Objective:** Verify delete confirmation dialog appears
- **Steps:**
  1. Search for a game (e.g., "Test Game Updated")
  2. Click the delete icon (trash can) in Actions
- **Expected Result:**
  - Confirmation dialog appears
  - Dialog message shows: 'Are you sure you want to delete "Test Game Updated"? This cannot be undone.'
  - Two buttons: "Cancel" and "Delete"

#### TC-8.2: Cancel Delete
- **Objective:** Verify delete can be cancelled
- **Steps:**
  1. With delete dialog open, click "Cancel"
- **Expected Result:**
  - Dialog closes
  - Game is not deleted
  - List is unchanged
  - Game counter remains the same

#### TC-8.3: Confirm Delete
- **Objective:** Verify game is deleted successfully
- **Steps:**
  1. With delete dialog open, click "Delete" button
  2. Wait for deletion to complete
- **Expected Result:**
  - Dialog closes
  - Game is removed from the list
  - Game counter decreases (99 → 98)
  - Search for the deleted game returns no results

#### TC-8.4: Delete Confirmation Prevents Accidents
- **Objective:** Verify delete is protected by confirmation
- **Steps:**
  1. Click delete on any game
  2. Verify the confirmation shows the correct game name
- **Expected Result:**
  - Confirmation always shows which game is being deleted
  - Cannot delete without explicit confirmation

---

### 9. URL State Preservation

#### TC-9.1: Bookmark Search URL
- **Objective:** Verify search state can be bookmarked
- **Steps:**
  1. Search for "assassin"
  2. Copy the URL: `?q=assassin`
  3. Open the URL in a new tab
- **Expected Result:**
  - New tab shows search results for "assassin"
  - Same filtered results display
  - URL shows `?q=assassin`

#### TC-9.2: Bookmark Filter URL
- **Objective:** Verify filter state is preserved in URL
- **Steps:**
  1. Navigate to `?genre=Action`
  2. Bookmark the URL
  3. Open the bookmark
- **Expected Result:**
  - Same genre filter applies
  - 16 Action games display

#### TC-9.3: Bookmark Sort URL
- **Objective:** Verify sort state is in URL
- **Steps:**
  1. Click Title header to sort descending
  2. Copy the URL with `?sort=title&order=desc`
  3. Share with someone or open in new tab
- **Expected Result:**
  - Games display sorted Z-A
  - Exact same sort order as original

#### TC-9.4: Combined Filter URL
- **Objective:** Verify multiple filters work together in URL
- **Steps:**
  1. Navigate to: `?q=game&genre=Action&sort=price&order=asc&page=1`
- **Expected Result:**
  - Search filters for "game"
  - Genre filter for "Action"
  - Results sort by price ascending
  - Page 1 displays
  - All filters apply simultaneously

#### TC-9.5: Browser Back/Forward Navigation
- **Objective:** Verify browser back/forward preserves state
- **Steps:**
  1. Navigate to page with filters: `?genre=Action`
  2. Change to different filter: `?genre=RPG`
  3. Click browser Back button
- **Expected Result:**
  - Returns to `?genre=Action`
  - Previous state is restored
  - No need to reload filters manually

---

### 10. UI/UX Quality

#### TC-10.1: Page Loads Without Errors
- **Objective:** Verify no JavaScript errors on load
- **Steps:**
  1. Open browser DevTools (F12)
  2. Go to Console tab
  3. Navigate to application
- **Expected Result:**
  - No red error messages in console
  - No "Uncaught" exceptions
  - No failed asset loads (404 errors)

#### TC-10.2: Responsive Layout
- **Objective:** Verify application works on different screen sizes
- **Steps:**
  1. Resize browser window to narrow width (mobile)
  2. Verify layout adjusts
  3. Resize to tablet width
  4. Resize to full width
- **Expected Result:**
  - All content remains readable
  - Table scrolls if necessary
  - Buttons are clickable at all sizes
  - No broken layout

#### TC-10.3: Loading States
- **Objective:** Verify loading indicators appear when appropriate
- **Steps:**
  1. Perform search and watch for loading state
  2. Navigate between pages
- **Expected Result:**
  - Brief loading indicator appears (if API is slow)
  - Prevents multiple clicks while loading
  - State clears after data loads

#### TC-10.4: Button States
- **Objective:** Verify buttons appear clickable and have proper states
- **Steps:**
  1. Hover over buttons
  2. Click buttons
  3. Try to click disabled buttons if any
- **Expected Result:**
  - Buttons show hover state (color change, cursor)
  - Buttons show active/pressed state
  - Buttons are accessible with keyboard Tab key

#### TC-10.5: Empty State
- **Objective:** Verify UI when no games match search
- **Steps:**
  1. Search for text that matches no games
- **Expected Result:**
  - Friendly message displays: "No games match your search"
  - Table doesn't show broken layout
  - Options to clear search or try again are available

#### TC-10.6: Table Readability
- **Objective:** Verify table data is easy to read
- **Steps:**
  1. Examine table styling
  2. Check alternating row colors if applicable
  3. Verify column widths are appropriate
- **Expected Result:**
  - Rows are easy to distinguish
  - All data is visible without horizontal scroll (on desktop)
  - Prices, dates are formatted consistently
  - Genre badges are clearly visible

#### TC-10.7: Navigation Links
- **Objective:** Verify all navigation works
- **Steps:**
  1. Click "Video Game Catalogue" logo
  2. Click any navigation element
- **Expected Result:**
  - Logo returns to games list
  - All navigation works correctly
  - No broken links

---

### 11. Data Integrity

#### TC-11.1: Game Appears Immediately After Creation
- **Objective:** Verify created game is visible without page refresh
- **Steps:**
  1. Create a new game with unique title
  2. Search for it immediately (don't refresh)
- **Expected Result:**
  - Game appears in search results
  - No manual refresh needed
  - Cache is updated

#### TC-11.2: Edit Appears Immediately
- **Objective:** Verify edits are visible immediately
- **Steps:**
  1. Edit a game (change price)
  2. Search for game
  3. Verify new price shows
- **Expected Result:**
  - Updated data is visible immediately
  - No refresh needed
  - Old data is not cached

#### TC-11.3: Delete Removes from All Views
- **Objective:** Verify deleted game is removed everywhere
- **Steps:**
  1. Delete a game
  2. Search for it (should not appear)
  3. Try to access edit URL directly for that game
- **Expected Result:**
  - Game doesn't appear in search
  - Direct access to deleted game returns 404 or error
  - Cannot be accessed through any interface

#### TC-11.4: Game Count Accuracy
- **Objective:** Verify game counter is always accurate
- **Steps:**
  1. Note initial count (98)
  2. Add a game (99)
  3. Delete a game (98)
  4. Add 3 games (101)
  5. Delete 2 games (99)
- **Expected Result:**
  - Counter always matches actual game count
  - No discrepancies

---

### 12. API Integration (Optional Technical Tests)

#### TC-12.1: View API Documentation
- **Objective:** Verify API documentation is accessible
- **Steps:**
  1. Navigate to `https://gamecatalog-ivashchenko.azurewebsites.net/swagger`
- **Expected Result:**
  - Swagger UI loads
  - All endpoints are documented
  - Can view request/response schemas

#### TC-12.2: Verify API Response Format
- **Objective:** Verify API returns correct data structure
- **Steps:**
  1. Open Swagger UI
  2. Try GET /api/games
  3. Examine response
- **Expected Result:**
  - Response has structure:
    ```json
    {
      "items": [...],
      "totalCount": 98,
      "page": 1,
      "pageSize": 10
    }
    ```

#### TC-12.3: Verify API Pagination
- **Objective:** Verify API pagination parameter works
- **Steps:**
  1. Call `/api/games?page=2&pageSize=10`
- **Expected Result:**
  - Returns page 2 with 10 items
  - `totalCount` is consistent
  - Items are different from page 1

---

## Test Execution Summary

### Test Run Log Template

| # | Test Case | Status | Notes | Date |
|---|-----------|--------|-------|------|
| TC-1.1 | Display All Games | ✓/✗ | | |
| TC-1.2 | Verify Column Headers | ✓/✗ | | |
| TC-2.1 | Search by Title | ✓/✗ | | |
| TC-3.1 | Filter by Action | ✓/✗ | | |
| TC-4.1 | Sort by Title | ✓/✗ | | |
| TC-5.1 | Pagination | ✓/✗ | | |
| TC-6.1 | Create Game | ✓/✗ | | |
| TC-7.1 | Edit Game | ✓/✗ | | |
| TC-8.1 | Delete Game | ✓/✗ | | |
| TC-9.1 | URL Preservation | ✓/✗ | | |
| TC-10.1 | UI Quality | ✓/✗ | | |
| TC-11.1 | Data Integrity | ✓/✗ | | |

---

## Known Limitations

- No user authentication in this demo
- Sample data is reset periodically
- No data export functionality
- Genre list is fixed (cannot add new genres)

---

## Sign-Off

- **Tester Name:** _______________
- **Test Date:** _______________
- **Total Tests:** 60+
- **Passed:** ___
- **Failed:** ___
- **Status:** ☐ Ready for Production | ☐ Issues Found

**Notes:**

---

## Appendix: Common Test Issues

### Issue: Search doesn't update
**Solution:** Ensure JavaScript is enabled. Try pressing Enter key after typing.

### Issue: Form won't submit
**Solution:** Check browser console for validation errors. Ensure all required fields are filled.

### Issue: Changes not visible
**Solution:** Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R). Check if you're on the right page/filter.

### Issue: Cannot click delete button
**Solution:** Ensure you're clicking on the trash icon in the Actions column, not another element.

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-04  
**Author:** QA Team
