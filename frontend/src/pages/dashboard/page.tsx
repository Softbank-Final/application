import Sidebar from './components/Sidebar';
import Header from './components/Header';

// 1단계: 전체 레이아웃 구조 (Layout Skeleton)
// - 화면 전체를 채우는 Flex 컨테이너 구성
// - Sidebar(고정)와 Main Content(가변/스크롤) 영역 분리
// - 배경 그라디언트 설정

export default function DashboardStep1() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 사이드바는 좌측에 고정 */}
      <Sidebar onSystemStatusClick={() => {}} />
      
      {/* 우측 메인 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* 실제 컨텐츠가 들어갈 스크롤 영역 */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* 컨텐츠 플레이스홀더 */}
            <div className="h-64 border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-400">
              Stats & Tables will go here
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}