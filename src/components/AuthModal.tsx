import { useState, type FormEvent } from 'react';
import { X, Lock, Mail, User, CheckCircle2, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { AuthUser } from '../types';
import { loginToDummyJsonApi, registerToDummyJsonApi } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  themeColor: string;
  contextMessage?: string;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  themeColor,
  contextMessage,
  defaultTab = 'login',
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login inputs with DummyJSON demo user
  const [loginUsername, setLoginUsername] = useState('emilys');
  const [loginPassword, setLoginPassword] = useState('emilyspass');

  // Register inputs
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await loginToDummyJsonApi(loginUsername, loginPassword);
      if (result.success && result.user) {
        setSuccessMsg(`Đăng nhập thành công! Chào mừng ${result.user.fullName || result.user.username}`);
        setTimeout(() => {
          onLoginSuccess({
            id: result.user!.id,
            username: result.user!.username,
            email: result.user!.email,
            fullName: result.user!.fullName,
            token: result.token,
          });
          onClose();
          setSuccessMsg('');
        }, 800);
      } else {
        setError(result.error || 'Tài khoản hoặc mật khẩu không chính xác.');
      }
    } catch {
      setError('Có lỗi xảy ra khi kết nối máy chủ xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Vui lòng điền các trường bắt buộc (Tên đăng nhập, Email, Mật khẩu).');
      return;
    }

    if (regPassword.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await registerToDummyJsonApi(
        regUsername,
        regEmail,
        regPassword,
        regFullName || undefined
      );

      if (result.success && result.user) {
        setSuccessMsg('Đăng ký tài khoản thành công! Tự động đăng nhập...');
        setTimeout(() => {
          onLoginSuccess({
            id: result.user!.id,
            username: result.user!.username,
            email: result.user!.email,
            fullName: result.user!.fullName,
            token: 'user-token-' + Date.now(),
          });
          onClose();
          setSuccessMsg('');
        }, 900);
      } else {
        setError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể tạo tài khoản lúc này.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setLoginUsername('emilys');
    setLoginPassword('emilyspass');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-sans font-black text-sm"
              style={{ backgroundColor: themeColor }}
            >
              T.
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">TECHZONE STORE</h3>
              <p className="text-[11px] text-slate-400">Tài khoản thành viên</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Context Notice (e.g. required when checkout) */}
        {contextMessage && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{contextMessage}</p>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/70 p-1 m-4 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 pt-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Tên đăng nhập hoặc Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="ví dụ: mor_2314 hoặc email của bạn"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Vui lòng sử dụng tài khoản mẫu: mor_2314 / 83r5^_ hoặc đăng ký tài khoản mới.')}
                    className="text-[11px] text-slate-400 hover:text-slate-700 underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                </div>
              </div>

              {/* Quick Demo Credentials Autofill */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Tài khoản mẫu:</span> emilys (pass: emilyspass)
                </div>
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="px-2 py-1 rounded bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs transition"
                >
                  ⚡ Điền nhanh
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition disabled:opacity-60 cursor-pointer"
                style={{ backgroundColor: themeColor }}
              >
                {loading ? (
                  <span>Đang xác thực...</span>
                ) : (
                  <>
                    <span>Đăng Nhập Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Chưa có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setError('');
                  }}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="nguyenvana"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Bảo mật thông tin thanh toán & tích điểm thành viên</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition disabled:opacity-60 cursor-pointer mt-2"
                style={{ backgroundColor: themeColor }}
              >
                {loading ? (
                  <span>Đang đăng ký...</span>
                ) : (
                  <>
                    <span>Tạo Tài Khoản & Mua Hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setError('');
                  }}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
