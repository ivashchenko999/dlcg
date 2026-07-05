# Testing Documentation

This directory contains comprehensive testing documentation for the Video Game Catalogue application, organized by testing type.

## Structure

```
tests/
├── api/          API testing documentation
│   ├── TEST_PLAN.md        20 detailed API test scenarios
│   └── TEST_RESULTS.md     100% test success rate (13/13 passed)
└── ui/           UI/Frontend testing documentation
    └── TEST_PLAN.md        60+ UI and feature test cases
```

## API Testing

### [api/TEST_PLAN.md](api/TEST_PLAN.md)
Comprehensive API test plan with 20 detailed test scenarios covering:
- GET operations (list, single item, with pagination)
- POST operations (create, validation)
- PUT operations (update, validation)
- DELETE operations (delete, verification)
- Error handling (invalid IDs, validation errors)
- HTTP headers and status codes
- Data integrity and persistence

**Key Sections:**
- Genres endpoint (GET /api/Genres)
- Games endpoints (GET, POST, PUT, DELETE /api/Games)
- Validation and error handling
- Cross-resource consistency
- Performance considerations

### [api/TEST_RESULTS.md](api/TEST_RESULTS.md)
Detailed test execution results showing:
- ✅ 13/13 tests passed (100% success rate)
- Response codes and timings
- Data validation confirmation
- CRUD operation verification
- Error handling validation
- API compliance checks

**Results Summary:**
- All GET operations return correct data
- POST creates resources with 201 status
- PUT updates and persists data correctly
- DELETE removes resources with 204 status
- Proper error codes for edge cases
- Content-Type headers correct
- Response times excellent (< 500ms)

---

## UI Testing

### [ui/TEST_PLAN.md](ui/TEST_PLAN.md)
Comprehensive manual testing guide for the frontend with 60+ test cases covering:

**Feature Areas:**
1. **Game List Display** - Table layout and columns
2. **Search Functionality** - Title search with real-time filtering
3. **Genre Filter** - Filter games by genre
4. **Sorting** - Sort by title, price, date, developer, genre
5. **Pagination** - Navigate between pages
6. **Create Game** - Add new game with form validation
7. **Edit Game** - Modify existing game data
8. **Delete Game** - Remove games with confirmation
9. **URL State** - Preserve filters in shareable URLs
10. **UI/UX Quality** - Responsive design and accessibility
11. **Data Integrity** - Create/edit/delete persistence
12. **API Integration** - Swagger documentation access

**Test Coverage:**
- User interactions and workflows
- Form validation and error messages
- Responsive design verification
- Browser compatibility
- Accessibility checks
- Empty states and edge cases

---

## Test Execution Order

### For API Testing:
1. Start with [api/TEST_PLAN.md](api/TEST_PLAN.md)
2. Execute test phases in order (GET, POST, PUT, DELETE)
3. Verify results match [api/TEST_RESULTS.md](api/TEST_RESULTS.md)

### For UI Testing:
1. Review [ui/TEST_PLAN.md](ui/TEST_PLAN.md)
2. Execute test cases in numbered order
3. Document results in test matrix provided in document

---

## Quick Links

- **Live Application:** https://gamecatalog-ivashchenko.azurewebsites.net
- **Swagger API Docs:** https://gamecatalog-ivashchenko.azurewebsites.net/swagger
- **Backend README:** ../../backend/README.md
- **Frontend README:** ../../frontend/README.md
- **Main Documentation:** ../ASSIGNMENT.md

---

## Test Status

| Testing Type | Coverage | Status | Last Updated |
|---|---|---|---|
| API | 20 scenarios | ✅ 100% passed (13/13) | 2026-07-04 |
| UI/Features | 60+ cases | 📋 Ready for testing | 2026-07-04 |
| Total | 80+ scenarios | ✅ Comprehensive | 2026-07-04 |

---

## Document Versions

- **API_TEST_PLAN.md** v1.0 - Comprehensive API testing scenarios
- **API_TEST_RESULTS.md** v1.0 - API testing results and validation
- **UI_TEST_PLAN.md** v1.0 - Frontend and feature testing guide

Each document is self-contained and includes:
- Detailed test objectives
- Step-by-step procedures
- Expected results
- Pass/fail criteria
- Error handling guidance

---

**Last Updated:** July 4, 2026  
**Maintained by:** QA Team
