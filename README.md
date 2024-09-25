# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />

In order to ensure data integrity, the node.js crypto module is used to create hashed versions of the
given data. This module uses the sha256 algorithm to digest the data into a hex code that is then stored
on the server side within a database. For efficiency, I have used an internal db, however, in a larger
application I would utilize PostgreSQL or a cloud service like AWS S3.

This process works because the crypto module aids in encrypting the data such that when the hash value
is sent to the client side, we can compute the hash value again and compare it with what is stored on
the server side. This ensures that data is never exposed in its true form while still doing security checks.

**2. If the data has been tampered with, how can the client recover the lost data?**

The recovery of data is largely dependent upon how much of that data is stored in a secure database and
for that I implemented a minimal versioning system that does routine backups of updated data and stores
them within the internal database. This approach allows the client to roll back to a previous,
untampered, version of the data in case of a security breach.

This solution is minimal and adresses only the basic necessities of data tampering and recovery. I hope
I was able to show my thought process clearly and that given more time and a larger application my methods
would be more rigorous and extensive.

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
