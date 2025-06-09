#!/bin/bash

# ADN Lab Firebase Data Connect Setup Script - Users Table Only

echo "🚀 Setting up Firebase Data Connect for ADN Lab (Users table only)..."

# Navigate to the server directory
cd server

echo "📋 Deploying Data Connect schema and connectors..."
firebase deploy --only dataconnect

echo "🔧 Generating JavaScript SDK..."
firebase dataconnect:sdk:generate --connector=default --output-dir=../client/src/lib

echo "📦 Installing generated SDK in client..."
cd ../client
npm install

echo "✅ Firebase Data Connect setup completed!"
echo ""
echo "📚 Next steps:"
echo "1. Update your imports in components to use the new firebase-dataconnect.js"
echo "2. Test the authentication flow with Data Connect user management"
echo "3. Verify Data Connect operations in Firebase Console"
echo "4. Chat functionality remains in Firestore (not migrated)"
echo ""
echo "🔥 Your Data Connect service is available at:"
echo "   Service ID: su25-swp391-g8-service"
echo "   Location: asia-east2"
echo "   Database: su25-swp391-g8-database"
echo "   Tables: User (only - chat remains in Firestore)"
