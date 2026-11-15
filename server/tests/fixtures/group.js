export const mockMembers = [
  { id: 1, user_id: 1, joined_at: new Date("2026-11-09T18:00:00.000Z") },
  { id: 2, user_id: 2, joined_at: new Date("2026-11-08T18:00:00.000Z") },
];

export const mockGroup = {
  id: 13,
  name: "groupname",
  created_at: new Date("2026-11-09T18:00:00.000Z"),
};

export const mockMemberRole = {
  member_roles: { name: "member" },
};

export const mockAdminRole = {
  member_roles: { name: "admin" },
};

export const groupRoles = {
  admin: 1,
  member: 2,
};

export const mockInvitations = [
  {
    id: 11,
    group_id: mockGroup.id,
    groups: { select: { name: mockGroup.name } },
    invited_user_id: 42,
    invited_by_user_id: 13,
    users_invitations_invited_by_user_idTousers: {
      username: "username",
    },
    invitation_status: { name: "open" },
    created_at: new Date("2026-11-09T18:00:00.000Z"),
    expires_at: new Date("2026-11-16T18:00:00.000Z"),
    responded_at: null,
    read_at: null,
  },
];
