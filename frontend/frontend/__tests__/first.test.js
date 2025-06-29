// __tests__/first.test.js

describe('בדיקות בסיסיות', () => {
  test('בדיקה פשוטה - חיבור מספרים', () => {
    expect(2 + 2).toBe(4);
  });

  test('בדיקה פשוטה - מחרוזות', () => {
    const greeting = 'שלום עולם';
    expect(greeting).toContain('שלום');
  });

  test('בדיקה פשוטה - מערכים', () => {
    const fruits = ['תפוח', 'בננה', 'תפוז'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('תפוח');
  });

  test('בדיקה פשוטה - אובייקטים', () => {
    const user = {
      name: 'יוסי',
      age: 30,
      city: 'תל אביב'
    };
    
    expect(user).toHaveProperty('name');
    expect(user.name).toBe('יוסי');
    expect(user.age).toBeGreaterThan(18);
  });

  test('בדיקה פשוטה - פונקציות אסינכרוניות', async () => {
    const promise = Promise.resolve('הצלחה');
    await expect(promise).resolves.toBe('הצלחה');
  });
});

// בדיקות ולידציה פשוטות
describe('בדיקות ולידציה', () => {
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateIdNumber = (id) => {
    return /^\d{9}$/.test(id);
  };

  test('ולידציה של מייל תקין', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.il')).toBe(true);
  });

  test('ולידציה של מייל לא תקין', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });

  test('ולידציה של תעודת זהות', () => {
    expect(validateIdNumber('123456789')).toBe(true);
    expect(validateIdNumber('12345678')).toBe(false); // קצר מדי
    expect(validateIdNumber('1234567890')).toBe(false); // ארוך מדי
    expect(validateIdNumber('12345678a')).toBe(false); // מכיל אותיות
  });
});