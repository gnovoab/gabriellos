import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// If MONGODB_URI isn't set, reject asynchronously instead of throwing at
// import time — this lets callers (e.g. menuConfig.ts's try/catch) fall back
// to seed data instead of crashing the whole module graph.
function connect(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not set"));
  }
  // autoSelectFamily (Node's IPv4/IPv6 happy-eyeballs) races against Atlas's
  // TLS handshake and can intermittently surface as a spurious
  // "SSL routines:ssl3_read_bytes:tlsv1 alert internal error". Disabling it
  // is the documented workaround. See:
  // https://www.mongodb.com/community/forums/t/unable-to-connect-local-env-to-atlas-ssl-tsl-connection-issue/310045
  return new MongoClient(uri, { autoSelectFamily: false }).connect();
}

if (process.env.NODE_ENV === "development") {
  // Reuse the client across HMR reloads in dev so we don't exhaust connections.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connect();
}

export default clientPromise;
