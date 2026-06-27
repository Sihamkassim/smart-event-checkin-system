import bcrypt from 'bcryptjs';
import  sequelize  from '../src/config/database.js';
import { User, Event, Visitor, CheckInLog } from '../src/models/index.js';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database (force: true drops and recreates tables)
    // Use with caution in production!
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (tables recreated)');

    // ============================================
    // 1. Create Admin Users
    // ============================================
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔐 Password hash generated');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lahn.test',
      password_hash: hashedPassword,
      role: 'admin',
    });

    const staff = await User.create({
      name: 'Staff User',
      email: 'staff@lahn.test',
      password_hash: hashedPassword,
      role: 'staff',
    });

    console.log(`✅ Users created: ${admin.email}, ${staff.email}`);

    // ============================================
    // 2. Create Events
    // ============================================
    const event1 = await Event.create({
      name: 'Tech Conference 2026',
      date: new Date('2026-07-15T09:00:00'),
      location: 'Convention Center, Hall A',
      status: 'active',
    });

    const event2 = await Event.create({
      name: 'Startup Summit 2026',
      date: new Date('2026-08-20T10:00:00'),
      location: 'Innovation Hub, Room 101',
      status: 'draft',
    });

    const event3 = await Event.create({
      name: 'AI Workshop Series',
      date: new Date('2026-09-05T14:00:00'),
      location: 'Tech Park, Building 2',
      status: 'completed',
    });

    console.log(`✅ Events created: ${event1.name}, ${event2.name}, ${event3.name}`);

    // ============================================
    // 3. Create Visitors with Tokens
    // ============================================
    const visitors = await Visitor.bulkCreate([
      {
        event_id: event1.id,
        full_name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        company: 'Tech Corp',
        check_in_token: 'TKN-ABC123',
        checked_in: true,
        checked_in_at: new Date('2026-07-15T09:15:00'),
      },
      {
        event_id: event1.id,
        full_name: 'Jane Smith',
        phone: '+0987654321',
        email: 'jane@example.com',
        company: 'Dev Studio',
        check_in_token: 'TKN-DEF456',
        checked_in: false,
      },
      {
        event_id: event1.id,
        full_name: 'Bob Johnson',
        phone: '+1122334455',
        email: 'bob@example.com',
        company: 'Data Inc',
        check_in_token: 'TKN-GHI789',
        checked_in: true,
        checked_in_at: new Date('2026-07-15T09:30:00'),
      },
      {
        event_id: event1.id,
        full_name: 'Alice Brown',
        phone: '+5544332211',
        email: 'alice@example.com',
        company: 'Cloud Solutions',
        check_in_token: 'TKN-JKL012',
        checked_in: false,
      },
      {
        event_id: event1.id,
        full_name: 'Charlie Wilson',
        phone: '+6677889900',
        email: 'charlie@example.com',
        company: 'AI Labs',
        check_in_token: 'TKN-MNO345',
        checked_in: true,
        checked_in_at: new Date('2026-07-15T10:00:00'),
      },
      // Visitors for event 2
      {
        event_id: event2.id,
        full_name: 'David Miller',
        phone: '+7788990011',
        email: 'david@example.com',
        company: 'Startup Inc',
        check_in_token: 'TKN-PQR678',
        checked_in: false,
      },
      {
        event_id: event2.id,
        full_name: 'Emma Davis',
        phone: '+8899001122',
        email: 'emma@example.com',
        company: 'Venture Capital',
        check_in_token: 'TKN-STU901',
        checked_in: false,
      },
      // Visitors for event 3
      {
        event_id: event3.id,
        full_name: 'Frank Garcia',
        phone: '+9900112233',
        email: 'frank@example.com',
        company: 'AI Research',
        check_in_token: 'TKN-VWX234',
        checked_in: true,
        checked_in_at: new Date('2026-09-05T14:30:00'),
      },
      {
        event_id: event3.id,
        full_name: 'Grace Lee',
        phone: '+1011121314',
        email: 'grace@example.com',
        company: 'ML Solutions',
        check_in_token: 'TKN-YZA567',
        checked_in: true,
        checked_in_at: new Date('2026-09-05T15:00:00'),
      },
      {
        event_id: event3.id,
        full_name: 'Henry Kim',
        phone: '+1516171819',
        email: 'henry@example.com',
        company: 'Data Science Co',
        check_in_token: 'TKN-BCD890',
        checked_in: false,
      },
    ]);

    console.log(`✅ ${visitors.length} visitors created`);

    // ============================================
    // 4. Create Check-in Logs
    // ============================================
    const checkInLogs = await CheckInLog.bulkCreate([
      {
        event_id: event1.id,
        visitor_id: visitors[0].id, // John Doe
        token: 'TKN-ABC123',
        status: 'success',
        message: 'John Doe checked in successfully',
        checked_in_at: new Date('2026-07-15T09:15:00'),
      },
      {
        event_id: event1.id,
        visitor_id: visitors[2].id, // Bob Johnson
        token: 'TKN-GHI789',
        status: 'success',
        message: 'Bob Johnson checked in successfully',
        checked_in_at: new Date('2026-07-15T09:30:00'),
      },
      {
        event_id: event1.id,
        visitor_id: visitors[4].id, // Charlie Wilson
        token: 'TKN-MNO345',
        status: 'success',
        message: 'Charlie Wilson checked in successfully',
        checked_in_at: new Date('2026-07-15T10:00:00'),
      },
      {
        event_id: event3.id,
        visitor_id: visitors[7].id, // Frank Garcia
        token: 'TKN-VWX234',
        status: 'success',
        message: 'Frank Garcia checked in successfully',
        checked_in_at: new Date('2026-09-05T14:30:00'),
      },
      {
        event_id: event3.id,
        visitor_id: visitors[8].id, // Grace Lee
        token: 'TKN-YZA567',
        status: 'success',
        message: 'Grace Lee checked in successfully',
        checked_in_at: new Date('2026-09-05T15:00:00'),
      },
    ]);

    console.log(`✅ ${checkInLogs.length} check-in logs created`);

    // ============================================
    // 5. Summary
    // ============================================
    console.log('\n🎉 Database seeded successfully!');
    console.log('========================================');
    console.log('📊 Summary:');
    console.log(`  - ${await User.count()} users`);
    console.log(`  - ${await Event.count()} events`);
    console.log(`  - ${await Visitor.count()} visitors`);
    console.log(`  - ${await CheckInLog.count()} check-in logs`);
    console.log('========================================');
    console.log('\n🔐 Login Credentials:');
    console.log('  Admin: admin@lahn.test / password123');
    console.log('  Staff: staff@lahn.test / password123');
    console.log('========================================');
    console.log('\n📝 Test Tokens for Check-in:');
    console.log('  TKN-ABC123 (John Doe - already checked in)');
    console.log('  TKN-DEF456 (Jane Smith - not checked in)');
    console.log('  TKN-JKL012 (Alice Brown - not checked in)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();