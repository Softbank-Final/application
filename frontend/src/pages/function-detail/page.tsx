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
}
