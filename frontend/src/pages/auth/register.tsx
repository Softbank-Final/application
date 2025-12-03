import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { validateEmail, validatePassword } from '../../utils/validators';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Register Component
export default function RegisterStep4_Final() {
    // Hooks & Store
    const navigate = useNavigate();
    const { register, isLoading } = useAuthStore(); // 로그인/회원가입 액션 및 로딩 상태

    // Local State
    // 폼 입력 데이터 (이름, 이메일, 비밀번호, 비밀번호 확인)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // 에러 메시지 및 비밀번호 표시 여부 상태
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. 이름 검사 (2글자 이상)
        if (formData.name.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }

        // 2. 이메일 형식 검사
        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // 3. 비밀번호 복잡도 검사 (길이, 대소문자, 숫자 포함 여부 등)
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors[0]);
            return;
        }

        // 4. 비밀번호 일치 여부 검사
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // 5. 회원가입 요청
        try {
            await register(formData.email, formData.password, formData.name);
            navigate('/dashboard'); // 성공 시 대시보드로 이동
        } catch (err) {
            // 에러 처리
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* --- Header Section --- */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            NanoGrid
                        </h1>
                    </Link>
                    <p className="text-gray-600 mt-2">Create your account</p>
                </div>

                {/* --- Main Form Card --- */}
                <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Global Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* 1. Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* 2. Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* 3. Password Input (with Visibility Toggle) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-12"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    aria-label="Toggle password visibility"
                                >
                                    <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line text-lg`}></i>
                                </button>
                            </div>
                        </div>

                        {/* 4. Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'} // 비밀번호 표시 설정 공유
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        {/* Password Requirements Guide */}
                        <div className="text-xs text-gray-600">
                            <p className="mb-1">Password must contain:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>At least 8 characters</li>
                                <li>One uppercase and one lowercase letter</li>
                                <li>One number</li>
                            </ul>
                        </div>

                        {/* Submit Button (Loading State Handled) */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" className="inline-block" />
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}