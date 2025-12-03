import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// 타입 정의 추가
interface FunctionItem {
  id: string;
  name: string;
  language: string;
  status: 'active' | 'inactive' | 'deploying';
  lastDeployed: string;
  invocations: number;
  avgDuration: number;
  memory: number;
  warmPool: number;
}

export default function Dashboard() {
    // Mock up Data
      const [functions] = useState<FunctionItem[]>([
    {
      id: 'fn-001',
      name: 'image-processor',
      language: 'Python',
      status: 'active',
      lastDeployed: '2시간 전',
      invocations: 1247,
      avgDuration: 45,
      memory: 512,
      warmPool: 2
    },
    {
      id: 'fn-002',
      name: 'data-analyzer',
      language: 'C++',
      status: 'active',
      lastDeployed: '5시간 전',
      invocations: 892,
      avgDuration: 12,
      memory: 256,
      warmPool: 1
    },
    {
      id: 'fn-003',
      name: 'api-gateway',
      language: 'Node.js',
      status: 'active',
      lastDeployed: '1일 전',
      invocations: 5421,
      avgDuration: 23,
      memory: 128,
      warmPool: 3
    },
    {
      id: 'fn-004',
      name: 'ml-inference',
      language: 'Python',
      status: 'deploying',
      lastDeployed: '방금',
      invocations: 0,
      avgDuration: 0,
      memory: 1024,
      warmPool: 0
    },
    {
      id: 'fn-005',
      name: 'file-converter',
      language: 'Go',
      status: 'inactive',
      lastDeployed: '3일 전',
      invocations: 234,
      avgDuration: 67,
      memory: 512,
      warmPool: 0
    }
  ]);

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