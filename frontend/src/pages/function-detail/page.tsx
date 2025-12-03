import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../dashboard/components/Sidebar';
import Header from '../dashboard/components/Header';

export default function FunctionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [logFilters, setLogFilters] = useState({
    level: 'all',
    search: ''
  });
  const [showTestModal, setShowTestModal] = useState(false);
  const [testInput, setTestInput] = useState(`{
  "key": "value",
  "data": "test"
}`);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [showOptimizationToast, setShowOptimizationToast] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState<'input' | 'result' | 'advanced'>('input');

  const functionData = {
    id: 'fn-001',
    name: 'image-processor',
    language: 'Python',
    runtime: 'python3.11',
    status: 'active',
    memory: 512,
    timeout: 30,
    lastDeployed: '2시간 전',
    endpoint: 'https://api.nanogrid.io/fn-001'
  };

  const metrics = {
    invocations: 1247,
    avgDuration: 45,
    coldStarts: 0,
    errors: 3,
    successRate: 99.76
  };

  const recentInvocations = [
    { id: '1', timestamp: '2분 전', duration: 42, status: 'success', memory: 487 },
    { id: '2', timestamp: '5분 전', duration: 38, status: 'success', memory: 492 },
    { id: '3', timestamp: '8분 전', duration: 51, status: 'success', memory: 501 },
    { id: '4', timestamp: '12분 전', duration: 45, status: 'error', memory: 498 },
    { id: '5', timestamp: '15분 전', duration: 39, status: 'success', memory: 485 }
  ];

    const mockLogs = [
    {
      id: '1',
      timestamp: '2025-01-15 14:32:15',
      level: 'info',
      message: 'Image processing completed successfully',
      requestId: 'req-abc123'
    },
    {
      id: '2',
      timestamp: '2025-01-15 14:31:58',
      level: 'info',
      message: 'Processing started for image: photo_001.jpg',
      requestId: 'req-abc122'
    },
    {
      id: '3',
      timestamp: '2025-01-15 14:31:42',
      level: 'warning',
      message: 'Image size exceeds recommended limit (5MB)',
      requestId: 'req-abc121'
    },
    {
      id: '4',
      timestamp: '2025-01-15 14:31:20',
      level: 'error',
      message: 'Failed to process image: Invalid format',
      requestId: 'req-abc120'
    },
    {
      id: '5',
      timestamp: '2025-01-15 14:30:55',
      level: 'info',
      message: 'Image resized to 1920x1080',
      requestId: 'req-abc119'
    },
    {
      id: '6',
      timestamp: '2025-01-15 14:30:30',
      level: 'info',
      message: 'Function invoked successfully',
      requestId: 'req-abc118'
    },
    {
      id: '7',
      timestamp: '2025-01-15 14:30:10',
      level: 'info',
      message: 'Image uploaded to storage',
      requestId: 'req-abc117'
    },
    {
      id: '8',
      timestamp: '2025-01-15 14:29:45',
      level: 'warning',
      message: 'Slow network detected',
      requestId: 'req-abc116'
    },
    {
      id: '9',
      timestamp: '2025-01-15 14:29:20',
      level: 'info',
      message: 'Processing completed',
      requestId: 'req-abc115'
    },
    {
      id: '10',
      timestamp: '2025-01-15 14:29:00',
      level: 'info',
      message: 'Function started',
      requestId: 'req-abc114'
    },
    {
      id: '11',
      timestamp: '2025-01-15 14:28:40',
      level: 'error',
      message: 'Connection timeout',
      requestId: 'req-abc113'
    },
    {
      id: '12',
      timestamp: '2025-01-15 14:28:20',
      level: 'info',
      message: 'Image validated',
      requestId: 'req-abc112'
    },
    {
      id: '13',
      timestamp: '2025-01-15 14:28:00',
      level: 'info',
      message: 'Processing queue: 3 items',
      requestId: 'req-abc111'
    },
    {
      id: '14',
      timestamp: '2025-01-15 14:27:40',
      level: 'warning',
      message: 'High memory usage detected',
      requestId: 'req-abc110'
    },
    {
      id: '15',
      timestamp: '2025-01-15 14:27:20',
      level: 'info',
      message: 'Image compression applied',
      requestId: 'req-abc109'
    },
    {
      id: '16',
      timestamp: '2025-01-15 14:27:00',
      level: 'info',
      message: 'Function execution completed',
      requestId: 'req-abc108'
    },
    {
      id: '17',
      timestamp: '2025-01-15 14:26:40',
      level: 'info',
      message: 'Image metadata extracted',
      requestId: 'req-abc107'
    },
    {
      id: '18',
      timestamp: '2025-01-15 14:26:20',
      level: 'error',
      message: 'Invalid image format detected',
      requestId: 'req-abc106'
    },
    {
      id: '19',
      timestamp: '2025-01-15 14:26:00',
      level: 'info',
      message: 'Processing started',
      requestId: 'req-abc105'
    },
    {
      id: '20',
      timestamp: '2025-01-15 14:25:40',
      level: 'info',
      message: 'Function initialized',
      requestId: 'req-abc104'
    }
  ];

    const tabs = [
    { id: 'overview', label: '개요', icon: 'ri-dashboard-line' },
    { id: 'metrics', label: '메트릭', icon: 'ri-line-chart-line' },
    { id: 'logs', label: '로그', icon: 'ri-file-list-3-line' },
    { id: 'settings', label: '설정', icon: 'ri-settings-3-line' }
  ];

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'info': 'bg-blue-50 text-blue-600 border-blue-200',
      'warn': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'error': 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[level] || 'bg-gray-50 text-gray-600';
  };

  const getLevelIcon = (level: string) => {
    const icons: Record<string, string> = {
      'info': 'ri-information-line',
      'warn': 'ri-alert-line',
      'error': 'ri-error-warning-line'
    };
    return icons[level] || 'ri-information-line';
  };

    const handleTestRun = async () => {
    setIsTestRunning(true);
    setTestResult(null);
    setActiveTestTab('result');

    // 테스트 실행 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 랜덤 결과 생성
    const success = Math.random() > 0.2;
    const executionTime = Math.floor(Math.random() * 100) + 30;
    const memoryUsed = Math.floor(Math.random() * 100) + 400;
    const cpuUsage = Math.floor(Math.random() * 60) + 20;
    const networkRx = Math.floor(Math.random() * 50) + 10;
    const networkTx = Math.floor(Math.random() * 30) + 5;
    const diskRead = Math.floor(Math.random() * 20) + 5;
    const diskWrite = Math.floor(Math.random() * 15) + 3;

    if (success) {
      setTestResult({
        status: 'success',
        success: true,
        statusCode: 200,
        body: {
          message: 'Function executed successfully',
          data: {
            processed: true,
            timestamp: new Date().toISOString(),
            result: 'Test completed'
          }
        },
        output: JSON.stringify({
          statusCode: 200,
          body: {
            message: 'Function executed successfully',
            data: {
              processed: true,
              timestamp: new Date().toISOString(),
              result: 'Test completed'
            }
          }
        }, null, 2),
        executionTime,
        responseTime: executionTime,
        memoryUsed,
        memoryAllocated: 512,
        cpuUsage,
        networkRx,
        networkTx,
        diskRead,
        diskWrite
      });
    } else {
      setTestResult({
        status: 'error',
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Function execution failed',
        output: JSON.stringify({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Function execution failed'
        }, null, 2),
        executionTime,
        responseTime: executionTime,
        memoryUsed,
        memoryAllocated: 512,
        cpuUsage,
        networkRx,
        networkTx,
        diskRead,
        diskWrite
      });
    }

    setIsTestRunning(false);
  };

    // Auto-Tuner 분석 로직
  const getAutoTunerAnalysis = () => {
    if (!testResult) return null;

    const memoryUsagePercent = (testResult.memoryUsed / testResult.memoryAllocated) * 100;
    const cpuUsage = testResult.cpuUsage;
    const hasNetworkActivity = testResult.networkRx > 0 || testResult.networkTx > 0;
    const hasDiskActivity = testResult.diskRead > 0 || testResult.diskWrite > 0;

    let diagnosis = {
      status: 'optimal' as 'optimal' | 'warning' | 'critical',
      title: '',
      message: '',
      recommendation: '',
      savings: 0,
      insight: ''
    };

    // 진단 로직
    if (memoryUsagePercent < 30 && cpuUsage > 60) {
      diagnosis = {
        status: 'warning',
        title: '비효율 감지 (Inefficient)',
        message: '메모리가 과하게 할당되었습니다.',
        recommendation: `512MB → 128MB로 변경 시 월 $3.50 절약 예상`,
        savings: 50,
        insight: '💡 메모리 다이어트 가능! CPU 위주의 작업입니다. 메모리를 줄여 비용을 아끼세요.'
      };
    } else if (cpuUsage < 20 && testResult.executionTime > 100) {
      diagnosis = {
        status: 'warning',
        title: '주의 (Warning)',
        message: 'I/O 병목이 감지되었습니다.',
        recommendation: '외부 API 응답 최적화 권장',
        savings: 0,
        insight: '🐢 I/O 병목 감지. 외부 API 응답을 기다리느라 시간이 오래 걸리고 있습니다.'
      };
    } else if (hasNetworkActivity && cpuUsage > 60) {
      diagnosis = {
        status: 'optimal',
        title: '최적 (Optimal)',
        message: '리소스 설정이 적절합니다.',
        recommendation: '현재 설정 유지',
        savings: 0,
        insight: '🚀 데이터 처리 중. 대용량 데이터를 내려받아 처리하는 작업으로 보입니다.'
      };
    } else if (cpuUsage < 10 && memoryUsagePercent < 10) {
      diagnosis = {
        status: 'critical',
        title: '위험 (Critical)',
        message: '리소스 사용량이 비정상적으로 낮습니다.',
        recommendation: '코드 로직 확인 필요',
        savings: 0,
        insight: '👻 좀비 프로세스? 리소스 사용량이 거의 없습니다. 코드 로직을 확인해보세요.'
      };
    } else if (memoryUsagePercent > 80) {
      diagnosis = {
        status: 'critical',
        title: '위험 (Critical)',
        message: '메모리 부족 위험이 있습니다.',
        recommendation: '512MB → 1024MB로 증설 권장',
        savings: 0,
        insight: '⚠️ 메모리 부족! 성능 저하를 방지하려면 메모리를 늘리세요.'
      };
    } else {
      diagnosis = {
        status: 'optimal',
        title: '최적 (Optimal)',
        message: '리소스 설정이 완벽합니다.',
        recommendation: '현재 설정 유지',
        savings: 0,
        insight: '✨ 완벽한 균형! 현재 리소스 설정이 최적화되어 있습니다.'
      };
    }

    return diagnosis;
  };

  const analysis = testResult ? getAutoTunerAnalysis() : null;
return (
  <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
    <Sidebar />

    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Function Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-10 h-10 flex items-center justify-center bg-purple-50 border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
                >
                  <i className="ri-arrow-left-line text-lg"></i>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{id}</h1>
                  <p className="text-sm text-gray-600 mt-1">함수 상세 정보 및 실행 관리</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowTestModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                >
                  <i className="ri-play-circle-line"></i>
                  테스트 실행
                </button>
                <button 
                  onClick={() => navigate('/deploy', { 
                    state: { 
                      redeployData: { name: id } 
                    } 
                  })}
                  className="px-4 py-2 bg-white border border-purple-200 text-gray-700 font-semibold rounded-xl hover:bg-purple-50 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                >
                  <i className="ri-upload-cloud-line"></i>
                  재배포
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-purple-200 mb-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm transition-all cursor-pointer flex items-center gap-2 rounded-t-xl ${
                    activeTab === tab.id
                      ? 'text-purple-600 bg-white border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <i className={tab.icon}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">총 실행 횟수</div>
                  <div className="text-3xl font-bold text-gray-900">{metrics.invocations.toLocaleString()}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">평균 응답 시간</div>
                  <div className="text-3xl font-bold text-gray-900">{metrics.avgDuration}ms</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">Cold Start</div>
                  <div className="text-3xl font-bold text-purple-600">{metrics.coldStarts}ms</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">에러 발생</div>
                  <div className="text-3xl font-bold text-red-600">{metrics.errors}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm">
                  <div className="text-sm text-gray-600 mb-2">성공률</div>
                  <div className="text-3xl font-bold text-green-600">{metrics.successRate}%</div>
                </div>
              </div>
            </div>
          )}

          
                {/* Function Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">함수 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-purple-100">
                        <span className="text-sm text-gray-600">언어</span>
                        <span className="text-sm font-medium text-gray-900">{functionData.language}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-100">
                        <span className="text-sm text-gray-600">런타임</span>
                        <span className="text-sm font-medium text-gray-900">{functionData.runtime}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-100">
                        <span className="text-sm text-gray-600">메모리</span>
                        <span className="text-sm font-medium text-gray-900">{functionData.memory} MB</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-100">
                        <span className="text-sm text-gray-600">타임아웃</span>
                        <span className="text-sm font-medium text-gray-900">{functionData.timeout}초</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">마지막 배포</span>
                        <span className="text-sm font-medium text-gray-900">{functionData.lastDeployed}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">엔드포인트</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border border-purple-100">
                      <div className="flex items-center justify-between">
                        <code className="text-sm text-gray-700 break-all">{functionData.endpoint}</code>
                        <button className="ml-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors cursor-pointer flex-shrink-0">
                          <i className="ri-file-copy-line text-gray-600"></i>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">요청 예시:</div>
                      <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-100">
                        <div className="text-purple-400">curl</div>
                        <div className="text-gray-300 ml-2">-X POST \</div>
                        <div className="text-gray-300 ml-2">{functionData.endpoint} \</div>
                        <div className="text-gray-300 ml-2">-H "Content-Type: application/json" \</div>
                        <div className="text-gray-300 ml-2">-d '{"{\"key\": \"value\"}"}'</div>
                      </div>
                    </div>
                  </div>
                </div>

                
                {/* Auto-Tuner Recommendation */}
                <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-magic-line text-2xl"></i>
                        <h3 className="text-xl font-bold">Auto-Tuner 추천</h3>
                      </div>
                      <p className="text-white/90 mb-4">
                        실행 데이터를 분석한 결과, 메모리를 256MB로 조정하면 비용을 <strong>약 50%</strong> 절감할 수 있습니다.
                      </p>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setShowOptimizationToast(true)}
                          className="px-6 py-2.5 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
                        >
                          추천 적용하기
                        </button>
                        <button 
                          onClick={() => setShowTestModal(true)}
                          className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all whitespace-nowrap cursor-pointer border border-white/30"
                        >
                          자세히 보기
                        </button>
                      </div>
                    </div>
                    <div className="ml-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">50%</div>
                        <div className="text-sm text-white/90">예상 절감</div>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
      </main>
    </div>
  </div>
);

}
