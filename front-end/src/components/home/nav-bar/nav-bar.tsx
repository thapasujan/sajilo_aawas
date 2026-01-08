import React, { useState } from "react";
import { companyLogo } from "../../../assets";
import { HeaderPath } from "../../../constant";
import { Button, Guider, Icon, InfoText } from "../../../units";
import { useAuthContext, useOutsideClick } from "../../../hooks";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut, userToken } from "../../../state-management/local/auth";
import { LogOut, Menu, User, Bell, X } from "react-feather";
import { RootState } from "../../../state-management/store/store";

export const NavBar = React.memo(() => {
  const authContext = useAuthContext();
  const [dropDownProfileMenu, setDropDownProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropDownMenuRef = useOutsideClick(() => setDropDownProfileMenu(false));
  const mobileMenuRef = useOutsideClick(() => setMobileMenuOpen(false));
  const nav = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(userToken);
  const user: any = useSelector((state: RootState) => state.localAuth.user);
  const notificationCount = useSelector(
    (state: RootState) => state.notifications.messages.length
  );

  return (
    <main>
      <nav className="flex justify-between items-center bg-bg-brand p-4 relative">
        {/* Logo */}
        <section id="left-side" className="flex items-center">
          <img
            src={companyLogo}
            alt="logo"
            className="w-12 md:w-16 cursor-pointer"
            onClick={() => nav("/")}
          />
        </section>

        {/* Desktop Navigation */}
        <section
          id="middle-side"
          className="hidden md:flex items-center justify-between w-[35%]"
        >
          {HeaderPath.map((header: any) => (
            <Guider
              path={header.path}
              title={header.title}
              key={header.id}
              className="hover:animate-glow active:underline"
            />
          ))}
          {token && user.role == "superadmin" && (
            <NavLink to="/dashboard">
              <h1 className="hover:animate-glow">Dashboard</h1>
            </NavLink>
          )}
        </section>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {/* Notification Bell with count - mobile */}
          {token && (
            <div
              className="relative cursor-pointer"
              onClick={() => {
                nav("/notification");
                setDropDownProfileMenu(false);
              }}
            >
              <Icon name={Bell} iconSize={22} />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-love text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop User Actions */}
        {token ? (
          <section id="right-side" className="hidden md:flex relative gap-4">
            {/* Notification Bell with count - desktop */}
            <div
              className="relative cursor-pointer"
              onClick={() => {
                nav("/notification");
                setDropDownProfileMenu(false);
              }}
            >
              <Icon name={Bell} iconSize={22} />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-love text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>

            <Icon 
              name={Menu} 
              onClick={() => setDropDownProfileMenu(!dropDownProfileMenu)} 
              className="cursor-pointer"
            />

            {dropDownProfileMenu && (
              <section
                className="flex flex-col absolute right-0 top-10 z-10 bg-white rounded-lg p-4 min-w-40 gap-4 shadow-lg"
                ref={dropDownMenuRef}
              >
                <div
                  className="flex gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => {
                    nav("/profile");
                    setDropDownProfileMenu(false);
                  }}
                >
                  <Icon name={User} iconSize={22} />
                  <InfoText title="Profile" />
                </div>

                <div
                  className="flex gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => {
                    dispatch(logOut());
                    setDropDownProfileMenu(false);
                    authContext?.setauthModalStatus({
                      ...authContext.authModalStatus,
                      loginMenu: true,
                    })
                  }}
                >
                  <Icon name={LogOut} iconSize={22} />
                  <InfoText title="Log out" />
                </div>
              </section>
            )}
          </section>
        ) : (
          <div className="hidden md:block">
            <Button
              className="w-32"
              onClick={() =>
                authContext?.setauthModalStatus({
                  ...authContext.authModalStatus,
                  loginMenu: true,
                })
              }
            >
              Log In
            </Button>
          </div>
        )}

        {/* Mobile Menu - Positioned below the navbar */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-20 border-t border-gray-200"
            ref={mobileMenuRef}
          >
            <div className="flex flex-col">
              {/* Navigation Links */}
              {HeaderPath.map((header: any) => (
                <div key={header.id} className="border-b border-gray-100">
                  <Guider
                    path={header.path}
                    title={header.title}
                    className="py-3 px-6 hover:bg-gray-50 block"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                </div>
              ))}
              
              {token && user.role == "superadmin" && (
                <div className="border-b border-gray-100">
                  <NavLink 
                    to="/dashboard" 
                    className="py-3 px-6 hover:bg-gray-50 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <h1>Dashboard</h1>
                  </NavLink>
                </div>
              )}
              
              {/* User Actions for Mobile */}
              {token ? (
                <>
                  <div className="border-b border-gray-100">
                    <div
                      className="flex items-center gap-4 py-3 px-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        nav("/profile");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Icon name={User} iconSize={22} />
                      <InfoText title="Profile" />
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-100">
                    <div
                      className="flex items-center gap-4 py-3 px-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        dispatch(logOut());
                        setMobileMenuOpen(false);
                        authContext?.setauthModalStatus({
                          ...authContext.authModalStatus,
                          loginMenu: true,
                        })
                      }}
                    >
                      <Icon name={LogOut} iconSize={22} />
                      <InfoText title="Log out" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-b border-gray-100">
                  <div
                    className="py-3 px-6"
                    onClick={() => {
                      authContext?.setauthModalStatus({
                        ...authContext.authModalStatus,
                        loginMenu: true,
                      });
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Button className="w-full">
                      Log In
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <Outlet />
    </main>
  );
});