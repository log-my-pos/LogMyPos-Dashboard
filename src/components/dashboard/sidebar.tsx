"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // Core
  Sidebar as SidebarComponent,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSpacer,

  // Menu
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,

  // Controls
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IconDashboardFilled, IconMap, IconUsers } from "@tabler/icons-react";

type SidebarSubItem = {
  Label: string;
  Link: string;
};

type SidebarMenuItem = {
  Label: string;
  Icon: React.ReactNode;
  Link: string;
  SubItems?: SidebarSubItem[];
};

const menuItems: SidebarMenuItem[][] = [
  [
    {
      Label: "Dashboard",
      Icon: <IconDashboardFilled size={20} />,
      Link: "/",
    },
  ],
  [
    {
      Label: "Users",
      Icon: <IconUsers size={20} />,
      Link: "/users",
      SubItems: [
        {
          Label: "All Users",
          Link: "/users",
        },
      ],
    },
    {
      Label: "Content",
      Icon: <IconMap size={20} />,
      Link: "/location-marks",
      SubItems: [
        {
          Label: "Location Marks",
          Link: "/location-marks",
        },
        // {
        //   Label: "Map Explorer",
        //   Link: "/location-marks/map-explorer",
        // },
      ],
    },
  ],
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <SidebarComponent>
      <SidebarHeader></SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((group, groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {groupIndex > 0 && <SidebarSpacer />}

              {group.map((item, itemIndex) => {
                const isActive =
                  pathname === item.Link ||
                  pathname.startsWith(`${item.Link}/`);

                return (
                  <SidebarMenuItem
                    key={`item-${itemIndex}`}
                    isActive={isActive}
                  >
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.Link}>
                        {item.Icon}
                        <span>{item.Label}</span>
                      </Link>
                    </SidebarMenuButton>

                    {item.SubItems && item.SubItems.length > 0 && (
                      <SidebarMenuSub>
                        {item.SubItems.map((subItem, subIndex) => {
                          const isSubActive = pathname === subItem.Link;

                          return (
                            <SidebarMenuSubItem
                              key={`subitem-${subIndex}`}
                              isActive={isSubActive}
                            >
                              <Link
                                href={subItem.Link}
                                className="block w-full h-full"
                              >
                                {subItem.Label}
                              </Link>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
