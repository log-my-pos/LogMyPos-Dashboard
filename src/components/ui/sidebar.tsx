"use client";

import {
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarLeftExpandFilled,
} from "@tabler/icons-react";
import * as React from "react";
import { Slot } from "./slot";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "10rem";
const SIDEBAR_WIDTH_ICON = "2.3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;

      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    return setOpen((open) => !open);
  }, [setOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
    }),
    [state, open, setOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
        className="group/sidebar-wrapper flex min-h-svh w-full bg-sidebar"
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// ------------------------------------------------------ //
// -------------------- SIDEBAR CORE -------------------- //
// ------------------------------------------------------ //

function Sidebar({ children, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar();

  return (
    <div
      className="group peer hidden md:block z-20"
      data-state={state}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className="relative w-(--sidebar-width) bg-transparent group-data-[state=collapsed]:w-(--sidebar-width-icon)"
      />
      <div
        data-slot="sidebar-container"
        className="fixed inset-y-0 left-0 z-10 hidden h-svh w-(--sidebar-width) md:flex group-data-[state=collapsed]:w-(--sidebar-width-icon)"
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full flex-col bg-sidebar font-sans text-[13px] text-sidebar-foreground"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col bg-sidebar min-h-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden py-2",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "group-data-[state=collapsed]:overflow-visible",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarFooter({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex flex-col bg-sidebar min-h-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarInset({
  children,
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("relative flex w-full flex-1 flex-col", className)}
      {...props}
    >
      {children}
    </main>
  );
}

function SidebarSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-spacer"
      className={cn("w-full bg-sidebar-muted my-2", className)}
      {...props}
    />
  );
}

// -------------------- EXTRA LAYOUT -------------------- //

function Topbar({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="topbar"
      className={cn(
        "h-8 w-full bg-sidebar text-sidebar-foreground flex items-center justify-end shadow-sm z-10 text-xs font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function PageContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-content"
      className={cn(
        "flex w-full flex-1 flex-col bg-background rounded-tl-lg overflow-clip",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ------------------------------------------------------ //
// -------------------- SIDEBAR MENU -------------------- //
// ------------------------------------------------------ //

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-col gap-0 w-full", className)} {...props} />
  );
}

type SidebarMenuItemProps = React.ComponentProps<"li"> & {
  isActive?: boolean;
};

function SidebarMenuItem({
  className,
  isActive,
  ...props
}: SidebarMenuItemProps) {
  return (
    <li
      className={cn("group/menu-item group relative w-full", className)}
      data-state={isActive ? "active" : undefined}
      {...props}
    />
  );
}

function SidebarMenuButton({
  className,
  isActive,
  asChild,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        // Base
        "relative flex w-full gap-2 px-2 py-2 text-[13px]",
        "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:-translate-x-full after:opacity-0 after:transition-all after:duration-150",

        // Active/Inactive state
        isActive
          ? "bg-[#2271b1] text-white hover:after:bg-white hover:after:translate-x-0 hover:after:opacity-100"
          : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-[#72aee6] hover:after:bg-[#72aee6] hover:after:translate-x-0 hover:after:opacity-100",

        // Group Active styles
        "group-data-[state=active]:bg-[#2271b1] group-data-[state=active]:text-white",
        "group-data-[state=active]:hover:bg-[#2271b1] group-data-[state=active]:hover:text-white",
        "group-data-[state=active]:hover:after:bg-white group-data-[state=active]:hover:after:translate-x-0 group-data-[state=active]:hover:after:opacity-100",

        // Group Collapsed styles
        "group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-1",
        "group-data-[state=collapsed]:[&>*:not(svg):not(img)]:hidden",
        "group-data-[state=collapsed]:[&>svg]:shrink-0 group-data-[state=collapsed]:[&>img]:shrink-0",

        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Base
        "ml-auto flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors duration-150",
        "bg-[#2271b1] text-white",

        // Group Active
        "group-data-[state=active]:bg-white group-data-[state=active]:text-[#2271b1]",

        // Group Collapsed
        "group-data-[state=collapsed]:absolute group-data-[state=collapsed]:top-1 group-data-[state=collapsed]:right-1",
        "group-data-[state=collapsed]:rounded-full group-data-[state=collapsed]:w-2 group-data-[state=collapsed]:h-2",
        "group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:bg-[#2271b1] group-data-[state=collapsed]:text-transparent",

        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        // Base
        "hidden flex-col bg-sidebar-muted py-1.5",

        // Group Active
        "group-data-[state=active]:flex",

        // Group Collapsed
        "group-data-[state=collapsed]:absolute group-data-[state=collapsed]:left-[calc(100%)] group-data-[state=collapsed]:top-0",
        "group-data-[state=collapsed]:hidden group-data-[state=collapsed]:group-hover/menu-item:flex",
        "group-data-[state=collapsed]:min-w-40 group-data-[state=collapsed]:shadow-md group-data-[state=collapsed]:z-50",

        className,
      )}
      {...props}
    />
  );
}

type SidebarMenuSubItemProps = React.ComponentProps<"li"> & {
  isActive?: boolean;
};

function SidebarMenuSubItem({
  isActive,
  className,
  ...props
}: SidebarMenuSubItemProps) {
  return (
    <li
      data-state={isActive ? "active" : undefined}
      className={cn(
        // Base
        "relative px-4 py-1 text-[13px] cursor-pointer transition-colors duration-150",
        "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:-translate-x-full after:opacity-0 after:transition-all after:duration-150",
        "hover:after:translate-x-0 hover:after:opacity-100 hover:after:bg-[#72aee6]",

        // Active/Inactive state
        isActive
          ? "text-white font-semibold hover:after:bg-white"
          : "text-sidebar-foreground",

        className,
      )}
      {...props}
    />
  );
}

// ------------------------------------------------------ //
// ---------------------- CONTROLS ---------------------- //
// ------------------------------------------------------ //

function SidebarTrigger({
  onClick,
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar, state } = useSidebar();

  return (
    <SidebarMenuButton
      data-sidebar="trigger"
      className={cn(
        "flex items-center gap-2 bg-transparent text-sidebar-foreground cursor-pointer",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {state === "expanded" ? (
        <>
          <IconLayoutSidebarLeftCollapseFilled size={20} />
          <span>Collapse Sidebar</span>
        </>
      ) : (
        <>
          <IconLayoutSidebarLeftExpandFilled size={20} />
          <span>Expand Sidebar</span>
        </>
      )}
    </SidebarMenuButton>
  );
}

// ------------------- SIDEBAR EXPORTS ------------------ //

export {
  // Core
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarSpacer,

  // Extra Layout
  Topbar,
  PageContent,

  // Menu
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,

  // Controls
  SidebarTrigger,

  // Provider and hook
  SidebarProvider,
  useSidebar,
};
