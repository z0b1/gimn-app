const fs = require('fs');
const csv = require('csv-parser');
const { createClerkClient } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const results = [];
const CSV_FILE_PATH = process.argv[2]; // Get file path from command line argument

if (!CSV_FILE_PATH) {
  console.error('Please provide the path to the CSV file as an argument.');
  console.error('Usage: node import-users.js <path-to-csv>');
  process.exit(1);
}

fs.createReadStream(CSV_FILE_PATH)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log(`Found ${results.length} users in CSV.`);
    
    for (const row of results) {
      // Adjust these column names based on your CSV header!
      // Example assumed headers: "email", "name"
      const email = row.email || row.Email || row['Email Address'];
      const name = row.name || row.Name || row['Full Name'];

      if (!email) {
        console.warn('Skipping row with missing email:', row);
        continue;
      }

      let firstName = parts[0];
      let lastName = parts.slice(1).join(' ');

      // Clerk SDK expects firstName and lastName to be strings, undefined is okay but let's be safe
      if (!firstName) firstName = 'Unknown';
      
      try {
        const user = await clerk.users.createUser({
          emailAddress: [email],
          firstName: firstName,
          lastName: lastName || undefined,
          skipPasswordRequirement: true,
        });
        console.log(`Successfully created user: ${email} (${user.id})`);
      } catch (error) {
        if (error.status === 422 && error.errors[0]?.code === 'form_identifier_exists') {
           console.log(`User already exists: ${email}`);
        } else {
           console.error(`Failed to create user ${email}:`, error.errors || error.message);
        }
      }
      
      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 300)); 
    }
    
    console.log('Import process completed.');
  });
