import {
  Activity,
  Contact,
  Camera,
  FileImage,
  History,
  Home,
  Info,
  LogOut,
  Settings,
  User,
  Video,
  X
} from "lucide-react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  logout
} from "../services/authService";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home
  },
  {
    label: "Image Detection",
    path: "/detect/image",
    icon: FileImage
  },
  {
    label: "Video Detection",
    path: "/detect/video",
    icon: Video
  },
  {
    label: "Live Detection",
    path: "/detect/live",
    icon: Camera
  },
  {
    label: "Prediction History",
    path: "/history",
    icon: History
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User
  },
  {
    label: "Contact",
    path: "/contact",
    icon: Contact
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings
  },
  {
    label: "About",
    path: "/about",
    icon: Info
  }
];

export default function Sidebar({
  isOpen,
  onClose
}: SidebarProps) {

  const navigate = useNavigate();

  function handleLogout() {

    logout();

    navigate("/login");
  }

  return (

    <>

      {isOpen && (

        <div
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            lg:hidden
          "
        />

      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-72
          flex-col
          border-r
          border-slate-800
          bg-slate-950
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div
          className="
            flex
            h-20
            items-center
            justify-between
            border-b
            border-slate-800
            px-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-600
              "
            >
              <Activity size={22} />
            </div>

            <div>

              <h1
                className="
                  text-lg
                  font-bold
                "
              >
                TrafficAI
              </h1>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Driver Assistance
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="
              lg:hidden
              text-slate-400
            "
          >
            <X size={22} />
          </button>

        </div>

        <nav
          className="
            flex-1
            space-y-2
            overflow-y-auto
            p-4
          "
        >

          <p
            className="
              mb-3
              px-3
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Application
          </p>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }
                  `
                }
              >

                <Icon size={19} />

                <span>
                  {item.label}
                </span>

              </NavLink>

            );

          })}

        </nav>

        <div
          className="
            border-t
            border-slate-800
            p-4
          "
        >

          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-red-400
              transition
              hover:bg-red-500/10
            "
          >

            <LogOut size={19} />

            Logout

          </button>

        </div>

      </aside>

    </>

  );
}