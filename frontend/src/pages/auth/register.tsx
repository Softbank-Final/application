import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validators'; // 검증 함수 임포트

// 회원가입 페이지 UI 레이아웃
export default function Register() {
    // 폼 데이터 상태 객체로 관리
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사 로직
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // 비밀번호 복잡도 검사
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]); // 첫 번째 에러 메시지 표시
      return;
    }

    // 비밀번호 일치 검사
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // TODO: API 호출
    console.log('Registering:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NanoGrid
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl p-8 shadow-lg">
          <form className="space-y-5">
            
            {/* 이름 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="John Doe"
              />
            </div>

            {/* 이메일 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-12"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            {/* 비밀번호 확인 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="Confirm your password"
              />
            </div>

            {/* 비밀번호 요구사항 (정적 텍스트) */}
            <div className="text-xs text-gray-600">
              <p className="mb-1">Password must contain:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>At least 8 characters</li>
                <li>One uppercase and one lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer"
            >
              Create Account
            </button>
          </form>

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