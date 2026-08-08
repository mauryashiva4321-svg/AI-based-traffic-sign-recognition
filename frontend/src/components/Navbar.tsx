import {
  Bell,
  Menu
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import ThemeToggle
  from "./ThemeToggle";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({
  onMenuClick
}: NavbarProps) {

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(
        JSON.parse(storedUser)
      );
    }

  }, []);

  return (

    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-20
        items-center
        justify-between
        border-b
        border-slate-800
        bg-slate-950/90
        px-4
        backdrop-blur
        sm:px-8
      "
    >

      <button
        onClick={onMenuClick}
        className="
          rounded-lg
          p-2
          text-slate-400
          hover:bg-slate-900
          lg:hidden
        "
      >
        <Menu size={24} />
      </button>

      <div
        className="
          hidden
          lg:block
        "
      >

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          AI Traffic Sign Recognition
        </p>

      </div>

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <ThemeToggle />

        <button
          className="
            relative
            rounded-xl
            p-2
            text-slate-400
            hover:bg-slate-800
          "
        >

          <Bell size={20} />

          <span
            className="
              absolute
              right-1
              top-1
              h-2
              w-2
              rounded-full
              bg-blue-500
            "
          />

        </button>

        <div
          className="
            hidden
            items-center
            gap-3
            sm:flex
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-blue-600
              font-bold
            "
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>

            <p
              className="
                text-sm
                font-semibold
              "
            >
              {user?.name || "User"}
            </p>

            <p
              className="
                text-xs
                text-slate-500
              "
            >
              {user?.role || "User"}
            </p>

          </div>

        </div>

      </div>

    </header>

  );
}