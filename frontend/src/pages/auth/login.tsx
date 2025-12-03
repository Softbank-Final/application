import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useAuthStore } from '../../store/authStore'; // 스토어 추가
import { validateEmail } from '../../utils/validators';

export default function LoginStep3() {
  const navigate = useNavigate(); // 네비게이션 훅
  const { login } = useAuthStore(); // 로그인 액션 가져오기
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => { // async 추가
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // 실제 로그인 요청 로직
    try {
      await login(email, password);
      navigate('/dashboard'); // 성공 시 이동
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  // UI 렌더링
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NanoGrid
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            
            {/* Input 필드들 (동일) */}
             <div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
             <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}