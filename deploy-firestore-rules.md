# Deploy Firebase Firestore Rules

To fix the 400 errors you're experiencing, you need to deploy the Firestore security rules.

## Prerequisites

1. Install Firebase CLI if you haven't already:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

## Deploy Rules

1. Navigate to your project directory:
```bash
cd project
```

2. Initialize Firebase (if not already done):
```bash
firebase init firestore
```

3. Deploy the Firestore rules:
```bash
firebase deploy --only firestore:rules
```

## Alternative: Deploy via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `capgeminismartprojectbuilder`
3. Go to Firestore Database
4. Click on "Rules" tab
5. Replace the existing rules with the content from `firestore.rules`
6. Click "Publish"

## Verify Deployment

After deploying, the 400 errors should be resolved. The rules will:
- Allow authenticated users to read/write their own data
- Prevent unauthorized access
- Fix the permission-denied errors you're seeing

## Testing

Try saving a plan draft again after deploying the rules. The errors should be resolved. 