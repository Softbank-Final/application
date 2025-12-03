import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

// Header Component
export default function Header() {
    // Hooks & Store
    const navigate = useNavigate();
    const { logout, user } = useAuthStore(); // 인증 스토어에서 유저 정보와 로그아웃 함수 구독

    // Local State
    const [isProfileOpen, setIsProfileOpen] = useState(false); // 드롭다운 메뉴 표시 여부
    const profileRef = useRef<HTMLDivElement>(null); // 외부 클릭 감지를 위한 DOM 참조


    // 외부 클릭 감지 Effect
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // 로그아웃 핸들러
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-purple-100 px-6 py-4">
            <div className="flex items-center justify-between">

                {/* --- Left Section: Search Bar --- */}
                <div className="flex-1">
                    <div className="relative max-w-md">
                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                        <input
                            type="text"
                            placeholder="함수 검색..."
                            className="w-full pl-10 pr-4 py-2.5 bg-purple-50 border border-purple-100 rounded-lg text-sm focus:outline-none focus:border-purple-300 transition-colors"
                        />
                    </div>
                </div>

                {/* --- Right Section: Actions & Profile --- */}
                <div className="flex items-center gap-4">

                    {/* 1. Notification Button */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-50 transition-colors cursor-pointer relative">
                        <i className="ri-notification-line text-xl text-gray-600"></i>
                        {/* New Notification Badge */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full"></span>
                    </button>

                    {/* 2. Help Button */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                        <i className="ri-question-line text-xl text-gray-600"></i>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-purple-100"></div>

                    {/* 3. User Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        {/* Dropdown Trigger */}
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {/* 사용자 이메일 첫 글자 표시 (없으면 'A') */}
                                {user?.email?.[0].toUpperCase() || 'A'}
                            </div>
                            <i className={`ri-arrow-down-s-line text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Dropdown Menu Content */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-purple-100 py-2 z-50 animate-fadeIn">

                                {/* User Info Header */}
                                <div className="px-4 py-3 border-b border-purple-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                            {user?.email?.[0].toUpperCase() || 'A'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user?.email?.split('@')[0] || 'Admin User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email || 'admin@nanogrid.io'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate('/settings');
                                        }}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-purple-50 transition-colors cursor-pointer text-left"
                                    >
                                        <i className="ri-user-line text-lg text-gray-600"></i>
                                        <span className="text-sm text-gray-700">내 프로필</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate('/settings');
                                        }}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-purple-50 transition-colors cursor-pointer text-left"
                                    >
                                        <i className="ri-settings-3-line text-lg text-gray-600"></i>
                                        <span className="text-sm text-gray-700">설정</span>
                                    </button>
                                </div>

                                {/* Logout Action */}
                                <div className="border-t border-purple-100 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors cursor-pointer text-left"
                                    >
                                        <i className="ri-logout-box-line text-lg text-red-600"></i>
                                        <span className="text-sm text-red-600 font-medium">로그아웃</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}