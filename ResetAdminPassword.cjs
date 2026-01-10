
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
});

async function main() {
    await client.connect();
    console.log("Connected to DB...");

    try {
        // Set password to 'Admin123!' for yoombal28@gmail.com
        // We use crypt from pgcrypto to hash the password.
        // Supabase uses bcrypt for password hashing.
        // Easiest is to update the encrypted_password column in auth.users
        // $2a$10$ is the bcrypt prefix
        const hashedPassword = '$2a$10$UBNB6yvVf7.G.vX7W/8z/.o8A8D/WcT6u9Nn7z9z9z9z9z9z9z9z9'; // This is a placeholder, let's use a real one.

        // Actually, let's just use the auth.admin.updateUser(id, { password: '...' }) if we had the service role key.
        // But since I have DB access, I'll use a known bcrypt hash for 'Admin123!'
        // 'Admin123!' bcrypt: $2a$12$Kk2.f6v/x.T.T/r.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v.v
        // Wait, let's just use a simple SQL update if pgcrypto is available.

        console.log("Updating password for yoombal28@gmail.com...");
        const res = await client.query(`
          UPDATE auth.users 
          SET encrypted_password = crypt('Admin123!', gen_salt('bf'))
          WHERE email = 'yoombal28@gmail.com'
          RETURNING id
      `);

        if (res.rows.length > 0) {
            console.log("Password updated successfully for user ID:", res.rows[0].id);
        } else {
            console.log("User not found.");
        }

    } catch (err) {
        console.error('Error updating password:', err);
    } finally {
        await client.end();
    }
}

main();
