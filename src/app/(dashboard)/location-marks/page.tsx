import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="p-4 md:p-6 w-full h-full min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-sidebar-foreground p-0 shadow-sm blocky-box">
        <div className="border-b border-sidebar-foreground px-4 py-2">
          <h2 className="text-[14px] font-semibold text-sidebar">
            Work in Progress
          </h2>
        </div>

        <div className="p-8 text-sm text-sidebar-foreground flex flex-col items-center justify-center text-center">
          <svg
            className="w-12 h-12 text-[#8c8f94] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <h3 className="text-lg font-medium text-sidebar mb-2">
            This page is under construction
          </h3>

          <p className="max-w-md mx-auto mb-6 text-[13px]">
            We are actively working on bringing this feature to the dashboard.
            Check back soon for updates!
          </p>

          <Link
            href="/"
            className="bg-[#2271b1] text-white px-4 py-1.5 text-sm hover:bg-[#135e96] transition-colors border border-[#2271b1] inline-block"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
