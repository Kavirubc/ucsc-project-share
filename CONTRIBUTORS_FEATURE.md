# Contributors Feature Implementation

This document describes the contributors feature implementation for the UCSC Project Share platform.

## Overview

The contributors feature allows the platform to recognize and showcase people who have contributed to building the platform. This includes both core contributors and regular contributors.

## Features Implemented

### 1. User Model Extension
- Added `isContributor` (boolean) field to track if a user is a contributor
- Added `contributorType` ('core' | 'regular' | null) field to distinguish between core and regular contributors
- Updated both `User` and `UserWithoutPassword` interfaces

### 2. Contributors Data Storage
- Created `/lib/data/contributors.json` for manual contributor management
- Structure includes:
  - `name`: Contributor's full name
  - `email`: Optional email address
  - `contributorType`: 'core' or 'regular'
  - `contributions`: Array of contribution descriptions
  - `github`: Optional GitHub username
  - `avatar`: Optional avatar URL

### 3. Contributors Page (`/contributors`)
- Displays all contributors with their information
- Separates core contributors (with star icon) from regular contributors
- Shows:
  - Contributor avatar with initials fallback
  - Name and contributor badge
  - Links to GitHub and email
  - List of contributions
- Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)

### 4. Profile Page Enhancement
- Added contributor badge display on user profiles
- Core contributors get a gold star badge
- Regular contributors get a standard badge
- Badge appears below the user's name

### 5. Navigation Updates
- Added "Contributors" link to desktop navbar (both authenticated and public)
- Added "Contributors" link to mobile navigation menu
- Added "View Contributors" link to footer

## Usage

### Adding a New Contributor

#### Option 1: Using the JSON file (Current Implementation)
1. Edit `/lib/data/contributors.json`
2. Add a new contributor object to the `contributors` array:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "contributorType": "regular",
  "contributions": [
    "Fixed bug in authentication",
    "Improved UI responsiveness"
  ],
  "github": "johndoe"
}
```

#### Option 2: Using Database (Future Enhancement)
To mark a user in the database as a contributor:

```javascript
// Example: Update user to be a core contributor
await db.collection('users').updateOne(
  { email: 'user@example.com' },
  { 
    $set: { 
      isContributor: true, 
      contributorType: 'core' 
    } 
  }
)
```

## Contributor Types

- **Core Contributors**: Founding members and major contributors who have built significant portions of the platform
- **Regular Contributors**: Contributors who have solved 1-2 issues or added features that were merged to production

## Future Enhancements

As mentioned in the original issue, future improvements could include:

1. **GitHub API Integration**: Automatically detect and add contributors based on GitHub repository activity
2. **Webhook Integration**: Real-time updates when new contributors are added via PRs
3. **Contribution Criteria**: Automated tracking of contribution levels (issues solved, PRs merged, etc.)
4. **User Profile Integration**: Sync contributors.json with user database records
5. **Contributor Dashboard**: Allow contributors to manage their profile and contribution list

## File Structure

```
app/
  contributors/
    page.tsx                 # Contributors page component
  profile/
    [id]/
      page.tsx              # Enhanced with contributor badge
components/
  navbar.tsx                # Updated with Contributors link
  mobile-nav.tsx            # Updated with Contributors link
  footer.tsx                # Updated with Contributors link
lib/
  data/
    contributors.json       # Manual contributor data
  models/
    User.ts                 # Updated with contributor fields
```

## Testing

To test the contributors feature:

1. Navigate to `/contributors` to view the contributors page
2. Check that navigation links work correctly
3. Visit a user profile page to verify badge display (when user has contributor status)
4. Verify responsive design on mobile, tablet, and desktop

## Notes

- The current implementation uses a JSON file for simplicity and easy manual updates
- The database schema is ready to support contributor tracking at the user level
- The design follows the existing UI patterns and component library of the project
