const logger = require('../../src/utils/logger');

// Mock console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
};

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});

describe('Logger Utility', () => {
  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO: Test info message$/),
        {}
      );
    });

    it('should log info messages with metadata', () => {
      const meta = { userId: '123' };
      logger.info('Test info message', meta);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO: Test info message$/),
        meta
      );
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Test error message');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] ERROR: Test error message$/),
        {}
      );
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning message');
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] WARN: Test warning message$/),
        {}
      );
    });
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      logger.debug('Test debug message');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] DEBUG: Test debug message$/),
        {}
      );
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      logger.debug('Test debug message');
      expect(console.log).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});