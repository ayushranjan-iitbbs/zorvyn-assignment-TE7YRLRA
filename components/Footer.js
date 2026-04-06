"use client";

import React from 'react';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { isDarkMode } = useSelector((state) => state.ui);

  return (
    <footer className={`w-full pt-20 pb-10 px-6 md:px-10 border-t transition-all duration-500 ${
      isDarkMode ? 'bg-slate-950 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Zorvyn Finance
            </h3>
            <p className="max-w-sm text-sm leading-relaxed opacity-80">
              Enterprise-grade finance controls with real-time insights, intelligent transaction tracking, and secure admin workflows for modern fintech teams.
            </p>
            <p className="text-sm opacity-70">Trusted by finance leaders to streamline reporting, risk monitoring, and treasury operations.</p>
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-[0.3em] mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              Product
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-85">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Financial Dashboard</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Analytics & Reports</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Transaction Automation</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Advanced Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-[0.3em] mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-85">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Security</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Compliance</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-[0.3em] mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              Support
            </h4>
            <ul className="space-y-4 text-sm font-medium opacity-85">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Contact Sales</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-current/10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm opacity-80">
          <div className="max-w-2xl">
            <p className="font-semibold mb-2">Zorvyn Financial Platform</p>
            <p className="text-sm leading-relaxed">
              Build, monitor, and optimize corporate finance flows with confidence. Every transaction is surfaced with clarity, every admin workflow is secure, and every executive report is ready in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.25em] font-semibold">
            <span>© 2026 Zorvyn Finance</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;