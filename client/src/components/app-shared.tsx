import { LayoutGridIcon, BarChart3Icon, BriefcaseIcon, UsersIcon, PlugIcon, KeyRoundIcon, SettingsIcon, SendIcon, HelpCircleIcon, BookOpenIcon, UserIcon, Compass, GraduationCapIcon, ShoppingCartIcon, Library, User } from "lucide-react";

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const studentNavGroups: SidebarNavGroup[] = [
  {
    label: "Learning",
    items: [
      {
        title: "My learnings",
        url: "/dashboard",
        icon: <BarChart3Icon />,
      },
      {
        title: "Explore Courses",
        url: "/dashboard/courses",
        icon: <Compass />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: <User />,
      },
    ],
  },
];

export const adminNavGroups: SidebarNavGroup[] = [
  {
    label: "Admin",
    items: [
       {
    title: "Analytics",
    url: "/admin",
    icon: <BarChart3Icon />,
  },
  {
        title: "Enrollments",
        url: "/admin/enrollments",
        icon: <Compass />,
      },
  {
    title: "Users",
    url: "/admin/users",
    icon: <UsersIcon />,
  },
  {
    title: "See Courses",
    url: "/admin/courses",
    icon: <Library />,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: <ShoppingCartIcon />,
  },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        url: "/admin/profile",
        icon: <User />,
      },
    ],
  },
];



export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help & Contact",
    url: "/contact",
    icon: (
      <SendIcon data-icon="inline-start" />
    ),
  },

];

export const studentNavLinks: SidebarNavItem[] = [
  ...studentNavGroups.flatMap((group) => group.items),
  ...footerNavLinks,
];

export const adminNavLinks: SidebarNavItem[] = [
  ...adminNavGroups.flatMap((group) => group.items),
  ...footerNavLinks,
];