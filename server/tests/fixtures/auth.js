export const mockUser = {
  id: 42,
  username: "username",
  password_hash: "password_hash",
  mail: "mail@bwf.de",
  role_id: 2,
};

export const mockNonAdminUser = {
  id: mockUser.id,
  username: mockUser.username,
  password_hash: mockUser.password_hash,
  mail: mockUser.mail,
  role_id: mockUser.role_id,
  user_roles: { name: "user" },
};

export const mockAdminUser = {
  id: mockUser.id,
  username: mockUser.username,
  password_hash: mockUser.password_hash,
  mail: mockUser.mail,
  role_id: 1,
  user_roles: { name: "admin" },
};
