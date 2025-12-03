import { Link } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation(); // 현재 경로 가져오기

    // 메뉴 설정
    const menuItems = [
        { path: '/dashboard', icon: 'ri-dashboard-line', label: '대시보드' },
        { path: '/deploy', icon: 'ri-upload-cloud-line', label: '함수 배포' },
        { path: '/logs', icon: 'ri-file-list-line', label: '실행 로그' },
        { path: '/settings', icon: 'ri-settings-3-line', label: '설정' },
    ];

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
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${location.pathname === item.path
                                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md' // Active Style
                                        : 'text-gray-600 hover:bg-purple-50' // Inactive Style
                                    }`}
                            >
                                <i className={`${item.icon} text-xl`}></i>
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 3. Footer Placeholder */}
            <div className="p-4 border-t border-purple-100">
                <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-xs text-gray-400">
                    System Status Widget
                </div>
            </div>
        </aside>
    );
}