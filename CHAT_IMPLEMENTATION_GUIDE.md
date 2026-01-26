# Chat/Obrolan System Implementation Guide

## Overview
The chat system (Obrolan) allows users who have voted to share their experiences. Each user can send **exactly one message**, which they can edit or delete. The system uses Firebase Firestore for real-time data synchronization.

## Features Implemented

### 1. One Message Per User Constraint
- **Frontend**: `userComment` state tracks if the current user has posted
- **Backend (Firestore Rules)**: Create rule checks if NIS already exists in comments collection
- **User Experience**: Input form is hidden once message is posted, showing "✓ Pesan kamu sudah terkirim" message

### 2. Edit & Delete Functionality
- Users can edit their own message and see "(diedit)" indicator
- Users can delete their message with confirmation dialog
- After deletion, they can post a new message
- Only message owner can see edit/delete buttons

### 3. Security Measures
- **Console Blocking**: Console methods are disabled to prevent tampering
- **DevTools Prevention**: F12, Ctrl+Shift+I, and other DevTools shortcuts are blocked
- **Right-Click Disabled**: Context menu is blocked
- **View Source Blocked**: Ctrl+U is prevented
- **Storage Validation**: localStorage writes are validated for size
- **eval() Disabled**: Prevents dynamic code execution

### 4. User Display
- Messages show user's **NIS** instead of full name
- User's class (kelas) is displayed as badge
- User's own message is highlighted with special styling
- Avatar shows first 2 characters of NIS in colored circle
- Timestamps show "Baru saja", "5m lalu", "2j lalu", or full date

### 5. Real-Time Updates
- Uses Firebase Firestore `onSnapshot()` listener
- New messages appear instantly without page refresh
- Comments are sorted by newest first
- Edit/delete changes sync in real-time

## File Structure

```
src/
├── pages/
│   ├── Obrolan.jsx          # Chat page component
│   ├── Login.jsx            # Login with currentUser storage
│   └── PilihPaslon.jsx      # Voting page (uses currentUser)
├── components/
│   ├── ChatBubble.jsx       # Floating chat icon (icon-only)
│   └── Navbar.jsx           # Navigation
├── utils/
│   └── security.js          # Security measures
├── firebase/
│   └── firebase.js          # Firebase config
├── App.jsx                  # Router with /obrolan route
├── App.css                  # All styling including .obrolan-*, .chat-bubble
└── index.js                 # Security initialization

Firebase/
├── comments collection       # Stores chat messages
├── users collection          # User data (read-only from client)
└── Security Rules           # See FIREBASE_SECURITY_RULES.txt
```

## Data Structure

### Comments Collection
```javascript
{
  id: "auto-generated",
  nis: "string (user ID)",
  nama: "string (optional)",
  kelas: "string",
  message: "string",
  timestamp: Timestamp,
  edited: boolean (optional),
  editedAt: Timestamp (optional)
}
```

### currentUser in localStorage
```javascript
{
  nis: "string",
  kelas: "string",
  jurusan: "string",
  nama: "string"
}
```

## Setup Instructions

### Step 1: Enable Firestore
1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Click "Create Database"
5. Choose "Start in production mode"
6. Select your location

### Step 2: Add Security Rules
1. In Firebase Console, go to Firestore > Rules
2. Replace all content with rules from `FIREBASE_SECURITY_RULES.txt`
3. Click "Publish"

The rules enforce:
- Only authenticated users can read comments
- Users can only create one comment (NIS-based)
- Users can only edit/delete their own comments

### Step 3: Test the System
1. Login with credentials
2. Vote for a candidate
3. Navigate to home page (chat icon should appear)
4. Click chat icon to go to /obrolan
5. Try sending a message
6. Verify you can't send a second message (input hidden)
7. Click Edit to modify your message
8. Click Delete to remove your message
9. After deletion, verify you can post again

### Step 4: Security Hardening (Production)
Add these to your `_document.js` or index.html for additional protection:
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none';">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
```

## Component Details

### Obrolan.jsx (177 lines)
- Loads currentUser from localStorage
- Fetches comments in real-time from Firestore
- Allows sending one message per user
- Provides edit/delete for user's own message
- Displays all comments with timestamps
- Auto-redirect to login if not authenticated

### ChatBubble.jsx (52 lines)
- Shows only for users with sudahVote=true
- Hidden on /obrolan page
- Floating icon (💬) without background
- Click navigates to /obrolan
- Checks voting status from Firestore on mount

### security.js (78 lines)
- Disables console methods
- Blocks DevTools keyboard shortcuts
- Detects DevTools opening by window size
- Disables right-click context menu
- Prevents eval() execution
- Validates localStorage writes

## Styling (App.css)

### Key Classes
- `.obrolan-page`: Main container with fixed input bottom
- `.obrolan-comments`: Scrollable comments list
- `.comment-item`: Individual comment styling
- `.comment-item.user-comment`: Highlight for current user's message
- `.edit-form`: Edit textarea and buttons
- `.chat-bubble`: Icon-only floating button
- `.obrolan-locked`: Message shown when user has posted

### Responsive Breakpoints
- **Mobile** (max-width: 768px): Reduced padding, smaller fonts, optimized for portrait
- **Tablet** (max-width: 1024px): Medium layout adjustments
- **Desktop** (min-width: 1024px): Full width with max-width 800px center

## Security Considerations

### Frontend Validation
✅ Implemented:
- One message per user (userComment state)
- Edit/delete only for own messages
- Console/DevTools blocking
- Right-click and view source disabled

### Backend Validation (Firestore Rules)
✅ Implemented:
- NIS field must match authenticated user
- One document per NIS on create
- Update/delete restricted to document owner
- Read access only for authenticated users

### Known Limitations
⚠️ Note: If user disables JavaScript or uses proxy to intercept requests, Firestore rules will enforce backend protection.

## Testing Checklist

- [ ] User can login and get assigned currentUser
- [ ] Chat icon appears only for voted users
- [ ] Can send one message successfully
- [ ] Input form hides after sending
- [ ] Can edit message (shows "(diedit)" tag)
- [ ] Can delete message with confirmation
- [ ] After deletion, can post new message
- [ ] Messages from other users appear in real-time
- [ ] Cannot send message without editing/deleting first
- [ ] F12/Ctrl+Shift+I doesn't open DevTools
- [ ] Right-click is disabled
- [ ] Console.log is disabled
- [ ] Timestamps format correctly
- [ ] Mobile layout is responsive
- [ ] Desktop layout shows max-width 800px centered

## Troubleshooting

### Issue: Chat icon not showing
**Solution**: 
- Check if user is logged in (localStorage.currentUser exists)
- Check if sudahVote is true in Firestore users/{nis}
- Check if user is not on /obrolan page
- Check browser console for errors

### Issue: Can't send message
**Solution**:
- Refresh page to reload currentUser
- Check if you already have a message (check Firestore comments)
- Verify Firestore rules are published
- Check Firebase project permissions

### Issue: Edit/Delete buttons not showing
**Solution**:
- Verify currentUser.nis matches comment.nis
- Check Firestore document to ensure NIS is saved correctly
- Clear localStorage and re-login

### Issue: DevTools still opens
**Solution**:
- Clear browser cache
- Disable security extensions
- Try different browser to test
- Note: Only script-level protection - OS-level tools can't be fully blocked

## Future Improvements

1. **Message Reactions**: Add emoji reactions to messages
2. **Threading**: Allow replies to specific messages
3. **Moderation**: Admin dashboard to moderate comments
4. **User Profile**: Show more user info (photo, last active)
5. **Search**: Search through comments
6. **Sorting**: Sort by newest/oldest/most liked
7. **Rate Limiting**: Prevent spam with timestamp checks
8. **Spam Filter**: Auto-detect and remove spam
9. **Export**: Download chat history as PDF
10. **Analytics**: Track chat engagement metrics

## Contact & Support

For issues or questions about the chat implementation, refer to:
- Firebase Firestore Documentation: https://firebase.google.com/docs/firestore
- React Documentation: https://react.dev
- This guide should cover all implementation details

Last Updated: 2024
