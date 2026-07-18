class UserFactory {
  static build(overrides = {}) {
    const timestamp = Date.now();

    return {
      name: `QA User ${timestamp}`,
      gender: 'male',
      email: `qa${timestamp}@mail.com`,
      status: 'active',
      ...overrides,
    };
  }
}

export default UserFactory;
