const { User } = require('../../src/models');
const { sequelize } = require('../../src/config/database');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password_hash: await User.hashPassword('password123'),
        first_name: 'John',
        last_name: 'Doe',
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.first_name).toBe('John');
      expect(user.last_name).toBe('Doe');
      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        email: 'test@example.com',
        password_hash: await User.hashPassword('password123'),
      };

      await User.create(userData);
      
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require email and password_hash', async () => {
      await expect(User.create({})).rejects.toThrow();
      
      await expect(User.create({ email: 'test@example.com' })).rejects.toThrow();
      
      await expect(User.create({ password_hash: 'hashed' })).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        password_hash: await User.hashPassword('password123'),
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Methods', () => {
    it('should hash passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await User.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should validate passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await User.hashPassword(password);
      
      const user = await User.create({
        email: 'test@example.com',
        password_hash: hashedPassword,
      });

      const isValid = await user.validatePassword(password);
      const isInvalid = await user.validatePassword('wrongpassword');

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('User Methods', () => {
    it('should find user by email', async () => {
      const userData = {
        email: 'findme@example.com',
        password_hash: await User.hashPassword('password123'),
      };

      const createdUser = await User.create(userData);
      const foundUser = await User.findByEmail('findme@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe('findme@example.com');
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await User.findByEmail('notfound@example.com');
      expect(foundUser).toBeNull();
    });

    it('should exclude password_hash from JSON output', async () => {
      const userData = {
        email: 'test@example.com',
        password_hash: await User.hashPassword('password123'),
      };

      const user = await User.create(userData);
      const userJSON = user.toJSON();

      expect(userJSON.password_hash).toBeUndefined();
      expect(userJSON.email).toBe('test@example.com');
    });
  });

  describe('User Validations', () => {
    it('should validate email uniqueness', async () => {
      const userData = {
        email: 'unique@example.com',
        password_hash: await User.hashPassword('password123'),
      };

      await User.create(userData);
      
      await expect(User.create({
        email: 'unique@example.com',
        password_hash: await User.hashPassword('password456'),
      })).rejects.toThrow();
    });
  });
});