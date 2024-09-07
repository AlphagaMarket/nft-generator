import Arweave from 'arweave';
import fs from 'fs';
import path from 'path';

// Load the JWK wallet key file from disk
const key = JSON.parse(fs.readFileSync('./walletFile.json').toString());

// Initialize an arweave instance
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Function to create and upload a manifest for a directory
async function uploadDirectoryWithManifest(directoryPath) {
  let files = fs.readdirSync(directoryPath);

  // Sort files numerically by extracting the number from the filename
  files = files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/), 10);
    const numB = parseInt(b.match(/\d+/), 10);
    return numA - numB;
  });

  const manifest = {
    "manifest": "arweave/paths",
    "version": "0.1.0",
    "paths": {},
    "index": {
      "path": "" // You can specify a default file here if needed, e.g., "index.html"
    }
  };

  // Upload each file in the directory
  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    if (fs.lstatSync(filePath).isFile()) {
      const fileData = fs.readFileSync(filePath);

      // Create a transaction for each file
      const transaction = await arweave.createTransaction({
        data: fileData
      }, key);

      // Add appropriate content type based on the file extension
      const contentType = getContentType(file);
      if (contentType) {
        transaction.addTag('Content-Type', contentType);
      }

      // Sign and upload the transaction
      await arweave.transactions.sign(transaction, key);
      await arweave.transactions.post(transaction);

      // Add file to manifest paths
      manifest.paths[file] = { "id": transaction.id };

      console.log(`Uploaded ${file} with transaction ID: ${transaction.id}`);
    }
  }

  // Create a transaction for the manifest itself
  const manifestTransaction = await arweave.createTransaction({
    data: JSON.stringify(manifest)
  }, key);

  manifestTransaction.addTag('Content-Type', 'application/x.arweave-manifest+json');

  // Sign and upload the manifest transaction
  await arweave.transactions.sign(manifestTransaction, key);
  await arweave.transactions.post(manifestTransaction);

  console.log('Manifest uploaded with transaction ID:', manifestTransaction.id);
  console.log('Manifest URL:', `https://arweave.net/${manifestTransaction.id}`);
}

// Function to determine the content type based on file extension
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();

  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.json': return 'application/json';
    case '.html': return 'text/html';
    case '.txt': return 'text/plain';
    // Add more cases for other file types as needed
    default: return '';
  }
}

// Specify the directory path you want to upload
const directoryPath = './images'; // Adjust the path to your directory

// Call the function to upload all files in the directory with a manifest
// ideally this is ran first then the first default path is used to fill in the metadata json image path
uploadDirectoryWithManifest(directoryPath).catch(console.error);
