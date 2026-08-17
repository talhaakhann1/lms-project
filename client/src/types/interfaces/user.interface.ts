import { UserRoles, UserStatus } from "../enums/user.enum";

export interface User {
  id: string;
  fullName: string;
  email: string;
  title: string;
  bio: string;
  password: string;
  isVerified: boolean;
  avatar: { url: string; publicId: string };
  role: UserRoles;
  status: UserStatus;
}

export interface Instructor {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  avatar?: {
    url: string;
  };
}

export interface UpdateInstructorProfile {
  title?: string;
  bio?: string;
}
