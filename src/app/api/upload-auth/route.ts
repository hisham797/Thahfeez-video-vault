import { getUploadAuthParams } from "@imagekit/next/server";
import { v4 as uuidv4 } from 'uuid';

const PUBLIC_KEY = 'public_x+pBR0uJajfmHuFedZdSke2Awro=';
const PRIVATE_KEY = 'private_j5V919DC3yua62wFwfnuV3W1XTA=';
const URL_ENDPOINT = 'https://ik.imagekit.io/va7g9ab2n';

export async function GET() {
  // Generate a unique token for each request
  const uniqueToken = uuidv4();
  
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: PRIVATE_KEY,
    publicKey: PUBLIC_KEY,
    token: uniqueToken
  });

  return Response.json({ 
    token, 
    expire, 
    signature, 
    publicKey: PUBLIC_KEY,
    urlEndpoint: URL_ENDPOINT
  });
} 