export default function Index() {
  return (
    <div className="grid grid-cols-1 grid-rows-6 h-screen bg-cyan-950">
        
      {/* Brand */}
      <nav className="relative flex w-full flex-wrap items-center justify-between py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700  lg:py-4">
        <div className="flex w-full flex-wrap items-center justify-between px-3">
          <div className="ml-10">
            <a
              className="text-xl font-semibold text-neutral-800 dark:text-neutral-200"
              href="#"
            >
              My_Wallet
            </a>
          </div>
        </div>
      </nav>

      {/* Login */}
      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center row-span-5">
        <div className="relative mb-12 px-3 lg:mb-0">
          <a className="cursor-pointer">Sign In with your Secret Key</a>
        </div>
        <div className="relative mb-12 px-3 lg:mb-0">
          <a className="cursor-pointer">Create new keys and Sign Up</a>
        </div>
      </div>
    </div>
  );
}
