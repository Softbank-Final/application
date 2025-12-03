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
}
