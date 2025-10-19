'use client';

export default function DebugPage() {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="space-y-2">
          <div>
            <strong>NEXT_PUBLIC_RAZORPAY_KEY_ID:</strong> {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_API_KEY:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_PROJECT_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>NEXT_PUBLIC_FIREBASE_APP_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Not set'}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Firebase API Key Value:</h3>
          <code className="bg-gray-100 p-2 rounded text-sm">
            {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'Not available'}
          </code>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Firebase Project ID:</h3>
          <code className="bg-gray-100 p-2 rounded text-sm">
            {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not available'}
          </code>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Razorpay Key Value:</h3>
          <code className="bg-gray-100 p-2 rounded text-sm">
            {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'Not available'}
          </code>
        </div>
      </div>
    </div>
  );
}
