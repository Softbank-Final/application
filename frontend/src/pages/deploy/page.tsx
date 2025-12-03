import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/components/Sidebar';
import Header from '../dashboard/components/Header';

export default function DeployPage() {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showGithubModal, setShowGithubModal] = useState(false);
    const [githubUrl, setGithubUrl] = useState('');
    const [githubBranch, setGithubBranch] = useState('main');
    const [githubFilePath, setGithubFilePath] = useState('');

    const codeTemplates: Record<string, string> = {
        python: `def handler(event, context):\n    return {\n        'statusCode': 200,\n        'body': 'Hello from NanoGrid!'\n    }`,
        nodejs: `exports.handler = async (event, context) => {\n    return {\n        statusCode: 200,\n        body: 'Hello from NanoGrid!'\n    };\n};`,
        cpp: `#include <iostream>\nextern "C" {\n    const char* handler(const char* event) {\n        return "{\\"statusCode\\": 200}";\n    }\n}`,
        go: `package main\nimport "encoding/json"\nfunc Handler() {}`
    };

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        name: '',
        handler: 'handler.main',
        language: 'python',
        runtime: 'python3.11',
        memory: 512,
        timeout: 30,
        code: '',
        warmPoolEnabled: true,
        warmPoolSize: 2,
        envVars: [] as Array<{ key: string; value: string }>
    });

    const languages = [
        { id: 'python', name: 'Python', icon: 'ri-python-line', runtime: 'python3.11', version: '3.11' },
        { id: 'nodejs', name: 'Node.js', icon: 'ri-nodejs-line', runtime: 'nodejs20.x', version: '20.x' },
        { id: 'cpp', name: 'C++', icon: 'ri-terminal-box-line', runtime: 'cpp17', version: 'C++17' },
        { id: 'go', name: 'Go', icon: 'ri-code-s-slash-line', runtime: 'go1.21', version: '1.21' }
    ];

    const memoryOptions = [128, 256, 512, 1024, 2048, 4096];

    // 언어 변경 핸들러
    const handleLanguageChange = (langId: string) => {
        const lang = languages.find(l => l.id === langId);
        const isBinaryLanguage = langId === 'cpp' || langId === 'go';

        setFormData({
            ...formData,
            language: langId,
            runtime: lang?.runtime || '',
            handler: isBinaryLanguage ? 'main' : 'handler.main',
            code: '' // 코드는 다음 단계에서 처리
        });
    };

    // 환경변수 관리 함수들
    const addEnvVar = () => {
        setFormData({ ...formData, envVars: [...formData.envVars, { key: '', value: '' }] });
    };

    const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
        const newEnvVars = [...formData.envVars];
        newEnvVars[index][field] = value;
        setFormData({ ...formData, envVars: newEnvVars });
    };

    const removeEnvVar = (index: number) => {
        const newEnvVars = formData.envVars.filter((_, i) => i !== index);
        setFormData({ ...formData, envVars: newEnvVars });
    };

    const isHandlerDisabled = formData.language === 'cpp' || formData.language === 'go';

    const handleFileUpload = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            alert('파일 크기가 너무 큽니다. 1MB 이하의 파일만 업로드 가능합니다.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFormData({ ...formData, code: content });
        };
        reader.readAsText(file);
    };

    const handleGithubImport = () => {
        const sampleCode = codeTemplates[formData.language];
        setFormData({ ...formData, code: sampleCode }); // 실제 연동 대신 템플릿 로드 시늉
        setShowGithubModal(false);
        setGithubUrl('');
    };

    const getFileExtension = () => {
        const extensions: Record<string, string> = { 'python': '.py', 'nodejs': '.js', 'cpp': '.cpp', 'go': '.go' };
        return extensions[formData.language] || '.txt';
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-6 py-8">
                        {/* Progress Steps */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md' : 'bg-white text-gray-400 border-2 border-gray-200'
                                            }`}>
                                            {s}
                                        </div>
                                        {s < 3 && (
                                            <div className={`flex-1 h-1 mx-4 transition-all rounded-full ${currentStep > s ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-200'
                                                }`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm flex-1 text-center ${currentStep >= 1 ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>기본 설정</span>
                                <span className={`text-sm flex-1 text-center ${currentStep >= 2 ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>코드 작성</span>
                                <span className={`text-sm flex-1 text-center ${currentStep >= 3 ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>배포 확인</span>
                            </div>
                        </div>

                        {/* Content */}
                        {currentStep === 1 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">기본 설정</h2>

                                <div className="space-y-6">
                                    {/* 함수명 입력 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">함수명</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="my-function"
                                            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                        />
                                    </div>

                                    {/* 런타임 선택 그리드 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">프로그래밍 언어 (Runtime)</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.id}
                                                    onClick={() => handleLanguageChange(lang.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.language === lang.id
                                                        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md'
                                                        : 'border-purple-100 bg-white hover:border-purple-200 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <i className={`${lang.icon} text-3xl mb-2 ${formData.language === lang.id ? 'text-purple-600' : 'text-gray-600'}`}></i>
                                                    <div className="text-sm font-semibold">{lang.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 메모리 & 타임아웃 */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">메모리 (MB)</label>
                                            <select
                                                value={formData.memory}
                                                onChange={(e) => setFormData({ ...formData, memory: Number(e.target.value) })}
                                                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            >
                                                {memoryOptions.map((mem) => <option key={mem} value={mem}>{mem} MB</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">타임아웃 (초)</label>
                                            <select
                                                value={formData.timeout}
                                                onChange={(e) => setFormData({ ...formData, timeout: Number(e.target.value) })}
                                                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            >
                                                <option value="10">10초</option>
                                                <option value="30">30초</option>
                                                <option value="60">60초</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-white border border-purple-200 text-gray-700 font-semibold rounded-xl hover:bg-purple-50 transition-all">취소</button>
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!formData.name}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        다음 단계 (코드 작성)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Code Editor */}
                        {currentStep === 2 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">코드 작성</h2>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-semibold text-gray-700">함수 코드</label>
                                        <div className="flex items-center gap-2">
                                            <input ref={fileInputRef} type="file" accept={getFileExtension()} onChange={handleFileChange} className="hidden" />
                                            <button onClick={handleFileUpload} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-purple-200 hover:bg-purple-50 rounded-lg transition-all">
                                                <i className="ri-file-upload-line mr-1"></i> 파일 업로드
                                            </button>
                                            <button onClick={() => setShowGithubModal(true)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-purple-200 hover:bg-purple-50 rounded-lg transition-all">
                                                <i className="ri-github-line mr-1"></i> GitHub 연동
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border border-purple-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
                                            {/* Editor Header UI */}
                                            <span className="text-gray-400 text-xs">{formData.language}</span>
                                        </div>
                                        <textarea
                                            value={formData.code || codeTemplates[formData.language]}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm focus:outline-none resize-none"
                                            style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <button onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-white border border-purple-200 text-gray-700 font-semibold rounded-xl hover:bg-purple-50 transition-all">이전 단계</button>
                                    <button onClick={() => setCurrentStep(3)} className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all">다음 단계</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Deploy Confirmation */}
                        {currentStep === 3 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">배포 확인</h2>

                                <div className="space-y-6 mb-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">함수명</div>
                                            <div className="font-semibold text-gray-900">{formData.name}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">핸들러</div>
                                            <div className="font-semibold text-gray-900">{formData.handler}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">언어 / 런타임</div>
                                            <div className="font-semibold text-gray-900">
                                                {languages.find(l => l.id === formData.language)?.name} {languages.find(l => l.id === formData.language)?.version}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">Warm Pool</div>
                                            <div className="font-semibold text-gray-900">
                                                {formData.warmPoolEnabled ? '✅ 활성화' : '❌ 비활성화'}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">메모리</div>
                                            <div className="font-semibold text-gray-900">{formData.memory} MB</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                            <div className="text-sm text-gray-600 mb-1">타임아웃</div>
                                            <div className="font-semibold text-gray-900">{formData.timeout}초</div>
                                        </div>
                                    </div>

                                    {formData.envVars.length > 0 && (
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                            <div className="text-sm font-semibold text-gray-700 mb-3">환경 변수 ({formData.envVars.length}개)</div>
                                            <div className="space-y-2">
                                                {formData.envVars.map((envVar, index) => (
                                                    <div key={index} className="flex items-center gap-3 text-sm">
                                                        <span className="font-mono text-blue-900">{envVar.key}</span>
                                                        <span className="text-gray-400">=</span>
                                                        <span className="font-mono text-gray-600">****************</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <i className="ri-lightbulb-line text-purple-600 text-xl flex-shrink-0 mt-0.5"></i>
                                            <div>
                                                <h4 className="text-sm font-semibold text-purple-900 mb-1">Auto-Tuner 추천</h4>
                                                <p className="text-sm text-purple-800 mb-2">
                                                    첫 실행 후 최적 스펙을 자동으로 분석하여 추천해드립니다.
                                                </p>
                                                <div className="text-sm text-purple-700">
                                                    예상 비용 절감: <strong>최대 85%</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="px-6 py-3 bg-white border border-purple-200 text-gray-700 font-semibold rounded-xl hover:bg-purple-50 transition-all whitespace-nowrap cursor-pointer"
                                    >
                                        이전 단계
                                    </button>
                                    <button
                                        onClick={handleDeploy}
                                        className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                                    >
                                        <i className="ri-rocket-line"></i>
                                        배포 시작
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}