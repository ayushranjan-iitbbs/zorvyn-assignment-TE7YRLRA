"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleView, toggleTheme } from '../redux/uiSlice';
import { Sun, Moon, Layout, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAdminView, isDarkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  const NavLink = ({ children }) => (
    <button className="relative group px-1 py-2 overflow-hidden">
      <span className="text-[11px] uppercase tracking-[0.2em] font-bold">
        {children}
      </span>
    
      <span className={`absolute bottom-0 left-0 w-full h-[2px] transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 ${
        isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
      }`} />
    </button>
  );

  return (
    <nav className={`fixed top-0 w-full z-[100] px-6 md:px-12 py-3 flex flex-col md:flex-row justify-between items-center backdrop-blur-xl border-b transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-slate-950/80 border-white/5 text-white' 
        : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      
      
<div className="flex items-center min-w-[150px]"> 
  <img 
    src="/logo.png" 
    alt="Zorvyn logo" 
    className="h-12 md:h-14 w-auto object-contain block" 
  />
</div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-md transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
{/* Desktop menu */}
      <div className="hidden md:flex items-center gap-8">
        
        <div className="flex items-center gap-3 border-l pl-6 border-slate-500/20">
          
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`p-2 rounded-md transition-all duration-300 ${
              isDarkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

         
          <button
            onClick={() => dispatch(toggleView())}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all border ${
              isAdminView 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-transparent border-slate-400/30 hover:border-slate-400'
            }`}
          >
            {isAdminView ? (
              <><Layout size={14} /> Admin Mode</>
            ) : (
              <><User size={14} /> User Mode</>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-inherit border-b border-current/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 p-6">
            <button
              onClick={() => { dispatch(toggleTheme()); setIsMenuOpen(false); }}
              className={`flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${
                isDarkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              Toggle Theme
            </button>

            <button
              onClick={() => { dispatch(toggleView()); setIsMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all border ${
                isAdminView 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-transparent border-slate-400/30 hover:border-slate-400'
              }`}
            >
              {isAdminView ? (
                <><Layout size={14} /> Admin Mode</>
              ) : (
                <><User size={14} /> User Mode</>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;