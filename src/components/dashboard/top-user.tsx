/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export default function TopUser() {
  return (
    <div className="group/top-user">
      <Link
        href="/account"
        className="px-2 flex items-center gap-1.5 h-8 group-hover/top-user:bg-sidebar-foreground/10 group-hover/top-user:text-[#72aee6]"
      >
        Howdy, &#123;user.name&#125;
        {/* Profile picture after the name */}
        <img
          src="https://secure.gravatar.com/avatar/b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514?d=mm"
          alt=""
          className="size-4.5 border border-[#8c8f94]"
        />
      </Link>
      <div className="absolute right-0 bg-[#2d3337] p-4 hidden group-hover/top-user:flex flex-row gap-4 pr-18">
        {/* User menu content */}
        {/* Profile Picture */}
        <img
          src="https://secure.gravatar.com/avatar/b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514?d=mm"
          alt=""
          className="size-16 border border-[#8c8f94]"
        />
        {/* User Options */}
        <div className="flex flex-col gap-2 mt-2">
          <Link
            href="/account"
            className="text-left text-[13px] hover:text-[#72aee6]"
          >
            Edit Profile
          </Link>
          <button className="text-left text-[13px] hover:text-[#72aee6]">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
