export default function Header() {
const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 외부 클릭 감지 로직
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="bg-white border-b border-purple-100 px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* 왼쪽: 검색 영역 */}
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

        {/* 오른쪽: 아이콘 및 프로필 */}
        <div className="flex items-center gap-4">
          
          {/* 알림 버튼 */}
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-50 transition-colors cursor-pointer relative">
            <i className="ri-notification-line text-xl text-gray-600"></i>
            <span className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full"></span>
          </button>

          {/* 도움말 버튼 */}
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
            <i className="ri-question-line text-xl text-gray-600"></i>
          </button>

          {/* 구분선 */}
          <div className="w-px h-6 bg-purple-100"></div>

          {/* 프로필 버튼 (Dropdown Trigger) */}
          <div className="relative">
            <button 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <i className="ri-arrow-down-s-line text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}