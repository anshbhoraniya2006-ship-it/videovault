import PocketBase from 'pocketbase';

// Determine the PocketBase URL from environment variables or use a default local instance
const pbUrl = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

// Optional: auto-cancellation for duplicate requests can be disabled if needed
pb.autoCancellation(false);

export default pb;
