import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

if (!getApps().length) {
  // Initialize using env JSON for service account or fallback to application default creds
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : undefined;
  app = initializeApp(
    svc
      ? {
          credential: cert({
            projectId: svc.project_id,
            clientEmail: svc.client_email,
            privateKey: svc.private_key?.replace(/\\n/g, '\n'),
          }),
        }
      : undefined
  );
} else {
  app = getApps()[0]!;
}

export const adminDb = getFirestore(app);


