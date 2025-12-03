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
    const [testInput, setTestInput] = useState('{\n  "key": "value",\n  "data": "test"\n}');
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
                                                redeployData: {
                                                    name: id,
                                                }
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
                                        className={`px-4 py-3 font-medium text-sm transition-all cursor-pointer flex items-center gap-2 rounded-t-xl ${activeTab === tab.id
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

                                {/* Recent Invocations */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm">
                                    <div className="px-6 py-4 border-b border-purple-100">
                                        <h3 className="text-lg font-bold text-gray-900">최근 실행 내역</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-purple-50/50 border-b border-purple-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">시간</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">응답 시간</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">메모리 사용</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">상태</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-purple-100">
                                                {recentInvocations.map((inv) => (
                                                    <tr key={inv.id} className="hover:bg-purple-50/30 transition-colors">
                                                        <td className="px-6 py-4 text-sm text-gray-700">{inv.timestamp}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{inv.duration}ms</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{inv.memory} MB</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${inv.status === 'success'
                                                                    ? 'bg-green-50 text-green-600 border border-green-200'
                                                                    : 'bg-red-50 text-red-600 border border-red-200'
                                                                }`}>
                                                                {inv.status === 'success' ? '성공' : '실패'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metrics Tab */}
                        {activeTab === 'metrics' && (
                            <div className="space-y-6">
                                {/* Time Range Selector */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedTimeRange('1h')}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedTimeRange === '1h'
                                                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                                                        : 'bg-white border border-purple-200 text-gray-700 hover:bg-purple-50'
                                                    }`}
                                            >
                                                1시간
                                            </button>
                                            <button
                                                onClick={() => setSelectedTimeRange('24h')}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedTimeRange === '24h'
                                                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                                                        : 'bg-white border border-purple-200 text-gray-700 hover:bg-purple-50'
                                                    }`}
                                            >
                                                24시간
                                            </button>
                                            <button
                                                onClick={() => setSelectedTimeRange('7d')}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedTimeRange === '7d'
                                                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                                                        : 'bg-white border border-purple-200 text-gray-700 hover:bg-purple-50'
                                                    }`}
                                            >
                                                7일
                                            </button>
                                            <button
                                                onClick={() => setSelectedTimeRange('30d')}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedTimeRange === '30d'
                                                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                                                        : 'bg-white border border-purple-200 text-gray-700 hover:bg-purple-50'
                                                    }`}
                                            >
                                                30일
                                            </button>
                                        </div>
                                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-purple-200 hover:bg-purple-50 transition-all cursor-pointer">
                                            <i className="ri-refresh-line text-gray-600"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">실행 횟수</h3>
                                            <i className="ri-bar-chart-line text-2xl text-purple-600"></i>
                                        </div>
                                        <div className="h-64 flex items-end justify-between gap-2">
                                            {[120, 145, 98, 167, 189, 156, 201, 178, 145, 167, 189, 201].map((value, idx) => (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg transition-all hover:opacity-80"
                                                        style={{ height: `${(value / 201) * 100}%` }}
                                                    ></div>
                                                    <span className="text-xs text-gray-500">{idx + 1}h</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">응답 시간</h3>
                                            <i className="ri-time-line text-2xl text-purple-600"></i>
                                        </div>
                                        <div className="h-64 flex items-end justify-between gap-2">
                                            {[42, 38, 51, 45, 39, 47, 43, 41, 46, 44, 40, 45].map((value, idx) => (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-blue-400 to-cyan-400 rounded-t-lg transition-all hover:opacity-80"
                                                        style={{ height: `${(value / 51) * 100}%` }}
                                                    ></div>
                                                    <span className="text-xs text-gray-500">{idx + 1}h</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Stats */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                                <i className="ri-check-line text-2xl text-green-600"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">성공률</div>
                                                <div className="text-2xl font-bold text-gray-900">99.76%</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">성공</span>
                                                <span className="font-medium text-green-600">1,244</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">실패</span>
                                                <span className="font-medium text-red-600">3</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                                                <i className="ri-database-2-line text-2xl text-orange-600"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">평균 메모리</div>
                                                <div className="text-2xl font-bold text-gray-900">492 MB</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">최대</span>
                                                <span className="font-medium text-gray-900">501 MB</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">최소</span>
                                                <span className="font-medium text-gray-900">485 MB</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                                <i className="ri-flashlight-line text-2xl text-purple-600"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Cold Start</div>
                                                <div className="text-2xl font-bold text-gray-900">0 ms</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Warm Pool</span>
                                                <span className="font-medium text-green-600">활성</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">대기 인스턴스</span>
                                                <span className="font-medium text-gray-900">3개</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cost Analysis */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">비용 분석</h3>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">이번 달</div>
                                            <div className="text-2xl font-bold text-gray-900">$24.50</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">지난 달</div>
                                            <div className="text-2xl font-bold text-gray-900">$28.90</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                            <div className="text-sm text-gray-600 mb-1">절감액</div>
                                            <div className="text-2xl font-bold text-green-600">$4.40</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                            <div className="text-sm text-gray-600 mb-1">절감률</div>
                                            <div className="text-2xl font-bold text-green-600">15.2%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Logs Tab */}
                        {activeTab === 'logs' && (
                            <div className="space-y-6">
                                {/* Header with Explorer Link */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <i className="ri-file-list-3-line text-2xl text-white"></i>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-blue-900 mb-1">최근 실행 로그</h3>
                                                <p className="text-sm text-blue-800">
                                                    최근 20개의 로그를 표시합니다. 전체 로그 및 고급 필터링은 Logs Explorer를 이용하세요.
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/logs?functionId=${id}`}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                                        >
                                            <i className="ri-external-link-line text-lg"></i>
                                            Logs Explorer에서 전체 보기
                                        </Link>
                                    </div>
                                </div>

                                {/* Simple Filters */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                로그 레벨
                                            </label>
                                            <select
                                                value={logFilters.level}
                                                onChange={(e) => setLogFilters({ ...logFilters, level: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm"
                                            >
                                                <option value="all">전체</option>
                                                <option value="info">Info</option>
                                                <option value="warning">Warning</option>
                                                <option value="error">Error</option>
                                            </select>
                                        </div>

                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                검색
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={logFilters.search}
                                                    onChange={(e) => setLogFilters({ ...logFilters, search: e.target.value })}
                                                    placeholder="로그 메시지 검색..."
                                                    className="w-full px-4 py-2.5 pl-10 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all text-sm"
                                                />
                                                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                            </div>
                                        </div>

                                        <div className="pt-7">
                                            <button
                                                onClick={() => setLogFilters({ level: 'all', search: '' })}
                                                className="px-4 py-2.5 bg-white border border-purple-200 text-gray-700 font-medium rounded-xl hover:bg-purple-50 transition-all whitespace-nowrap cursor-pointer text-sm"
                                            >
                                                <i className="ri-refresh-line mr-1"></i>
                                                초기화
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Logs List */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-purple-100">
                                        <h3 className="text-lg font-bold text-gray-900">실행 로그</h3>
                                    </div>

                                    <div className="divide-y divide-purple-100">
                                        {mockLogs.slice(0, 20).map((log) => (
                                            <div
                                                key={log.id}
                                                className="px-6 py-4 hover:bg-purple-50/30 transition-colors"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className={`w-2 h-2 rounded-full mt-2 ${log.level === 'error'
                                                                    ? 'bg-red-500'
                                                                    : log.level === 'warning'
                                                                        ? 'bg-yellow-500'
                                                                        : 'bg-green-500'
                                                                }`}
                                                        ></div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${log.level === 'error'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : log.level === 'warning'
                                                                            ? 'bg-yellow-100 text-yellow-700'
                                                                            : 'bg-green-100 text-green-700'
                                                                    }`}
                                                            >
                                                                {log.level.toUpperCase()}
                                                            </span>
                                                            <span className="text-sm text-gray-600">{log.timestamp}</span>
                                                            <span className="text-xs text-gray-400 font-mono">
                                                                {log.requestId}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-900 break-all">{log.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer with Explorer Link */}
                                    <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">
                                                최근 20개의 로그만 표시됩니다
                                            </p>
                                            <Link
                                                to={`/logs?functionId=${id}`}
                                                className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer flex items-center gap-1"
                                            >
                                                전체 로그 보기
                                                <i className="ri-arrow-right-line"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                {/* General Settings */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">일반 설정</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">함수명</label>
                                            <input
                                                type="text"
                                                defaultValue={functionData.name}
                                                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">설명</label>
                                            <textarea
                                                rows={3}
                                                placeholder="함수에 대한 설명을 입력하세요..."
                                                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Runtime Settings */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">런타임 설정</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">메모리 (MB)</label>
                                            <select
                                                defaultValue={functionData.memory}
                                                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                            >
                                                <option value="128">128 MB</option>
                                                <option value="256">256 MB</option>
                                                <option value="512">512 MB</option>
                                                <option value="1024">1024 MB</option>
                                                <option value="2048">2048 MB</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">타임아웃 (초)</label>
                                            <select
                                                defaultValue={functionData.timeout}
                                                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                            >
                                                <option value="10">10초</option>
                                                <option value="30">30초</option>
                                                <option value="60">60초</option>
                                                <option value="120">120초</option>
                                                <option value="300">300초</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Environment Variables */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">환경 변수</h3>
                                        <button className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer text-sm flex items-center gap-2">
                                            <i className="ri-add-line"></i>
                                            추가
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="KEY"
                                                className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                            />
                                            <input
                                                type="text"
                                                placeholder="VALUE"
                                                className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                            />
                                            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                                                <i className="ri-delete-bin-line text-red-600"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Warm Pool Settings */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Warm Pool 설정</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-gray-900 mb-1">Warm Pool 활성화</div>
                                                <div className="text-sm text-gray-600">Cold Start를 0ms로 유지합니다</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-400 peer-checked:to-pink-400"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">대기 인스턴스 수</label>
                                            <select
                                                defaultValue="3"
                                                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                            >
                                                <option value="1">1개</option>
                                                <option value="2">2개</option>
                                                <option value="3">3개</option>
                                                <option value="5">5개</option>
                                                <option value="10">10개</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-red-900 mb-4">위험 구역</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-red-900 mb-1">함수 삭제</div>
                                                <div className="text-sm text-red-700">이 작업은 되돌릴 수 없습니다</div>
                                            </div>
                                            <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all whitespace-nowrap cursor-pointer">
                                                삭제하기
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex items-center justify-end gap-3">
                                    <button className="px-6 py-2.5 bg-white border border-purple-200 text-gray-700 font-semibold rounded-xl hover:bg-purple-50 transition-all whitespace-nowrap cursor-pointer">
                                        취소
                                    </button>
                                    <button className="px-6 py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer">
                                        변경사항 저장
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Test Run Modal - 버전 37 스타일 */}
            {showTestModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="ri-flask-line text-2xl text-white"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">함수 테스트</h3>
                                    <p className="text-sm text-white/80">{functionData.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowTestModal(false);
                                    setTestResult(null);
                                    setActiveTestTab('input');
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-2xl text-white"></i>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setActiveTestTab('input')}
                                    className={`px-4 py-3 font-semibold text-sm transition-all cursor-pointer ${activeTestTab === 'input'
                                            ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <i className="ri-code-line mr-2"></i>
                                    입력
                                </button>
                                <button
                                    onClick={() => setActiveTestTab('result')}
                                    className={`px-4 py-3 font-semibold text-sm transition-all cursor-pointer ${activeTestTab === 'result'
                                            ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <i className="ri-terminal-line mr-2"></i>
                                    결과
                                </button>
                                <button
                                    onClick={() => setActiveTestTab('advanced')}
                                    className={`px-4 py-3 font-semibold text-sm transition-all cursor-pointer ${activeTestTab === 'advanced'
                                            ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <i className="ri-bar-chart-line mr-2"></i>
                                    상세 분석 (Advanced)
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Input Tab */}
                            {activeTestTab === 'input' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        테스트 입력 데이터 (JSON)
                                    </label>
                                    <textarea
                                        value={testInput}
                                        onChange={(e) => setTestInput(e.target.value)}
                                        className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                                        style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                                    />
                                    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <i className="ri-information-line text-blue-600 text-lg flex-shrink-0 mt-0.5"></i>
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-900 mb-1">입력 형식 안내</h4>
                                                <p className="text-sm text-blue-800">
                                                    JSON 형식으로 테스트 데이터를 입력하세요. 함수의 event 매개변수로 전달됩니다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Result Tab */}
                            {activeTestTab === 'result' && (
                                <div>
                                    {isTestRunning ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                                            <p className="text-gray-600 font-medium">함수 실행 중...</p>
                                        </div>
                                    ) : testResult ? (
                                        <div className="space-y-4">
                                            {/* Status */}
                                            <div className={`rounded-xl p-4 border-2 ${testResult.success
                                                    ? 'bg-green-50 border-green-300'
                                                    : 'bg-red-50 border-red-300'
                                                }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${testResult.success ? 'bg-green-500' : 'bg-red-500'
                                                        }`}>
                                                        <i className={`${testResult.success ? 'ri-check-line' : 'ri-close-line'
                                                            } text-2xl text-white`}></i>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">
                                                            {testResult.success ? '✅ 실행 성공' : '❌ 실행 실패'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Status Code: {testResult.statusCode}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Metrics */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                                    <div className="text-sm text-gray-600 mb-1">응답 시간</div>
                                                    <div className="text-2xl font-bold text-purple-600">{testResult.responseTime}ms</div>
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                                    <div className="text-sm text-gray-600 mb-1">메모리 사용</div>
                                                    <div className="text-2xl font-bold text-blue-600">{testResult.memoryUsed}MB</div>
                                                </div>
                                            </div>

                                            {/* Output */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        출력 결과
                                                    </label>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(testResult.output);
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
                                                    >
                                                        <i className="ri-file-copy-line"></i>
                                                        복사
                                                    </button>
                                                </div>
                                                <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-100 overflow-x-auto max-h-64">
                                                    <pre>{testResult.output}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <i className="ri-play-circle-line text-6xl mb-4"></i>
                                            <p>테스트를 실행하려면 아래 버튼을 클릭하세요</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Advanced Tab */}
                            {activeTestTab === 'advanced' && (
                                <div>
                                    {testResult && analysis ? (
                                        <div className="space-y-6">
                                            {/* Auto-Tuner Header */}
                                            <div className={`rounded-xl p-6 text-white ${analysis.status === 'optimal'
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                                                    : analysis.status === 'warning'
                                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                                                        : 'bg-gradient-to-r from-red-400 to-pink-400'
                                                }`}>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <i className="ri-fire-fill text-3xl"></i>
                                                    <h3 className="text-2xl font-bold">Auto-Tuner 진단</h3>
                                                </div>
                                                <div className="text-xl font-bold mb-2">{analysis.title}</div>
                                                <p className="text-white/90 mb-3">{analysis.message}</p>
                                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                                    <div className="text-sm font-semibold mb-1">추천 사항</div>
                                                    <div className="text-white/90">{analysis.recommendation}</div>
                                                </div>
                                            </div>

                                            {/* Insight */}
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5">
                                                <div className="flex items-start gap-3">
                                                    <i className="ri-lightbulb-line text-purple-600 text-2xl flex-shrink-0 mt-0.5"></i>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-purple-900 mb-2">지능형 인사이트</h4>
                                                        <p className="text-purple-800 text-lg">{analysis.insight}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Resource DNA */}
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <i className="ri-dna-line text-purple-600"></i>
                                                    리소스 DNA 분석
                                                </h4>
                                                <div className="space-y-4">
                                                    {[
                                                        {
                                                            label: 'Memory',
                                                            value: (testResult.memoryUsed / testResult.memoryAllocated) * 100,
                                                            color: 'purple',
                                                            icon: 'ri-database-2-line',
                                                            detail: `${testResult.memoryUsed}MB / ${testResult.memoryAllocated}MB`
                                                        },
                                                        {
                                                            label: 'CPU',
                                                            value: testResult.cpuUsage,
                                                            color: 'blue',
                                                            icon: 'ri-cpu-line',
                                                            detail: `${testResult.cpuUsage}% 사용`
                                                        },
                                                        {
                                                            label: 'Network I/O',
                                                            value: Math.min((testResult.networkRx + testResult.networkTx) / 2, 100),
                                                            color: 'green',
                                                            icon: 'ri-global-line',
                                                            detail: `↓${testResult.networkRx}KB ↑${testResult.networkTx}KB`
                                                        },
                                                        {
                                                            label: 'Disk I/O',
                                                            value: Math.min((testResult.diskRead + testResult.diskWrite) / 2, 100),
                                                            color: 'orange',
                                                            icon: 'ri-hard-drive-line',
                                                            detail: `Read ${testResult.diskRead}KB / Write ${testResult.diskWrite}KB`
                                                        }
                                                    ].map((metric) => (
                                                        <div key={metric.label} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-purple-300 transition-all">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-10 h-10 bg-gradient-to-br from-${metric.color}-100 to-${metric.color}-200 rounded-lg flex items-center justify-center`}>
                                                                        <i className={`${metric.icon} text-${metric.color}-600 text-xl`}></i>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-gray-900">{metric.label}</div>
                                                                        <div className="text-xs text-gray-500">{metric.detail}</div>
                                                                    </div>
                                                                </div>
                                                                <span className="text-lg font-bold text-gray-900">{Math.round(metric.value)}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                                <div
                                                                    className={`bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600 h-3 rounded-full transition-all duration-500`}
                                                                    style={{ width: `${metric.value}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Apply Optimization */}
                                            {analysis.savings > 0 && (
                                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-bold text-green-900 mb-2">💰 비용 절감 기회</h4>
                                                            <p className="text-green-800 mb-3">
                                                                Auto-Tuner가 분석한 최적값을 적용하면 <strong>월 ${(analysis.savings * 0.07).toFixed(2)}</strong>를 절약할 수 있습니다.
                                                            </p>
                                                            <button
                                                                onClick={() => {
                                                                    setShowOptimizationToast(true);
                                                                    setTimeout(() => setShowOptimizationToast(false), 3000);
                                                                }}
                                                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                                                            >
                                                                <i className="ri-magic-line text-xl"></i>
                                                                최적값 자동 적용
                                                            </button>
                                                        </div>
                                                        <div className="ml-6 text-center">
                                                            <div className="text-4xl font-black text-green-600 mb-1">{analysis.savings}%</div>
                                                            <div className="text-sm text-green-700 font-semibold">예상 절감</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <i className="ri-bar-chart-line text-6xl mb-4"></i>
                                            <p>테스트를 먼저 실행해주세요</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => {
                                        setShowTestModal(false);
                                        setTestResult(null);
                                        setActiveTestTab('input');
                                    }}
                                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all whitespace-nowrap cursor-pointer"
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={handleTestRun}
                                    disabled={isTestRunning}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-play-line"></i>
                                    {isTestRunning ? '실행 중...' : '테스트 실행'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Optimization Toast */}
            {showOptimizationToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-purple-200 p-4 flex items-center gap-3 z-50 animate-slide-up">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                        <i className="ri-check-line text-xl text-white"></i>
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">최적값이 적용되었습니다</div>
                        <div className="text-sm text-gray-600">다음 배포 설정에 저장되었습니다</div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 12px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #c084fc, #f472b6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
        }
      `}</style>
        </div>
    );
}
