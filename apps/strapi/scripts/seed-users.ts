import fetch from 'node-fetch';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load token from apps/strapi/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const baseUrl = 'http://localhost:1337';
const ADMIN_TOKEN = process.env.STRAPI_SEEDER_TOKEN;

if (!ADMIN_TOKEN) {
  console.error('❌ STRAPI_SEEDER_TOKEN is not defined in apps/strapi/.env');
  process.exit(1);
}

const requiredRoles = ['Authenticated', 'Author', 'Admin'];

const usersToCreate = [
  {
    username: 'auth',
    email: 'auth@test.com',
    password: 'password123',
    roleName: 'Authenticated',
  },
  {
    username: 'author',
    email: 'author@test.com',
    password: 'password123',
    roleName: 'Author',
  },
  {
    username: 'admin',
    email: 'admin@test.com',
    password: 'password123',
    roleName: 'Admin',
  },
];

async function run() {
  console.log(`📡 Connecting to Strapi at ${baseUrl}...\n`);

  // --- Load roles
  console.log(`🔍 Checking required roles: ${requiredRoles.join(', ')}`);
  const roleRes = await fetch(`${baseUrl}/api/users-permissions/roles`, {
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
  });

  const roleData = await roleRes.json();

  if (!roleRes.ok || !roleData.roles) {
    console.error('❌ Failed to load roles:', roleData);
    process.exit(1);
  }

  const roleMap: Record<string, number> = {};
  for (const role of roleData.roles) {
    roleMap[role.name] = role.id;
  }

  const missingRoles = requiredRoles.filter((role) => !roleMap[role]);
  if (missingRoles.length > 0) {
    console.error(`❌ Missing required roles: ${missingRoles.join(', ')}`);
    console.warn(
      `💡 Please create these roles in the Strapi Admin UI before running this script.\n` +
        `   Then re-run: npm seed:users`
    );
    process.exit(1);
  }

  // --- Register users
  for (const user of usersToCreate) {
    console.log(`\n➡️  Creating user: ${user.email}`);

    try {
      const registerRes = await fetch(`${baseUrl}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        console.warn(
          `⚠️  Failed to register ${user.email}: ${
            registerData.error?.message || registerRes.statusText
          }`
        );
        continue;
      }

      const createdUser = registerData.user;
      const roleId = roleMap[user.roleName];

      const assignRoleRes = await fetch(
        `${baseUrl}/api/users/${createdUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`, // ✅ Use the admin token here
          },
          body: JSON.stringify({ role: roleId }),
        }
      );

      if (!assignRoleRes.ok) {
        const errData = await assignRoleRes.json();
        console.error(
          `❌ Failed to assign role to ${user.email}: ${errData.error?.message}`
        );
        continue;
      }

      console.log(
        `✅ Created user ${user.username} with role ${user.roleName}`
      );
    } catch (err: any) {
      console.error(`❌ Unexpected error for ${user.email}:`, err.message);
    }
  }

  console.log('\n🎉 User seeding complete.\n');
}

run();
