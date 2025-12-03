import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-purple-100 flex flex-col h-full">
      
      {/* 1. Logo Section */}
      <div className="p-6 border-b border-purple-100">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl">
            <i className="ri-flashlight-fill text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            NanoGrid
          </span>
        </Link>
      </div>

      {/* 2. Navigation Placeholder */}
      <nav className="flex-1 p-4">
        <div className="text-sm text-gray-400 p-2 border border-dashed border-gray-200 rounded-lg text-center">
          Menu Items Will Go Here
        </div>
      </nav>

      {/* 3. Footer Placeholder */}
      <div className="p-4 border-t border-purple-100">
        <div className="h-20 bg-gray-50 rounded-xl animate-pulse"></div>
      </div>
    </aside>
  );
}