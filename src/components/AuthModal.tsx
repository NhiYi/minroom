import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Sparkles,
  Send,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { AuthUser } from '../types';
import {
  loginToDummyJsonApi,
  registerToDummyJsonApi,
  requestPasswordResetApi,
  resetPasswordApi
} from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  themeColor: string;
  contextMessage?: string;
  defaultTab?: 'login' | 'register' | 'forgot';
}

export function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  themeColor,
  contextMessage,
  defaultTab = 'login',
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);
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

  // Forgot Password inputs and state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentity, setForgotIdentity] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('868999');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotMaskedDestination, setForgotMaskedDestination] = useState('');
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Sync tab with defaultTab prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, defaultTab]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (forgotCountdown > 0) {
      const timer = setTimeout(() => {
        setForgotCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forgotCountdown]);

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

  // Step 1: Request OTP code
  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotIdentity.trim()) {
      setError('Vui lòng nhập email hoặc tên đăng nhập để nhận mã OTP.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await requestPasswordResetApi(forgotIdentity);
      if (res.success) {
        setGeneratedOtp(res.otp || '868999');
        setForgotMaskedDestination(res.maskedDestination || forgotIdentity);
        setForgotStep(2);
        setForgotCountdown(60);
        setSuccessMsg(res.message);
      } else {
        setError(res.error || 'Không tìm thấy tài khoản tương ứng.');
      }
    } catch {
      setError('Không thể kết nối máy chủ gửi mã xác thực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP code
  const handleResendOtp = async () => {
    if (forgotCountdown > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');
    try {
      const res = await requestPasswordResetApi(forgotIdentity);
      if (res.success) {
        setGeneratedOtp(res.otp || '868999');
        setForgotCountdown(60);
        setSuccessMsg('Mã OTP mới đã được gửi lại thành công!');
      } else {
        setError(res.error || 'Không thể gửi lại mã OTP.');
      }
    } catch {
      setError('Lỗi khi gửi lại mã xác thực.');
    } finally {
      setResendLoading(false);
    }
  };

  // Step 2: Verify OTP and save new password
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotOtp.trim()) {
      setError('Vui lòng nhập mã xác thực OTP 6 chữ số.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await resetPasswordApi(forgotIdentity, forgotOtp, forgotNewPassword);
      if (res.success) {
        setSuccessMsg('Đổi mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
        // Auto populate login form
        setLoginUsername(forgotIdentity);
        setLoginPassword(forgotNewPassword);
        // Reset forgot flow
        setForgotStep(1);
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        // Switch back to login tab after 1.2s
        setTimeout(() => {
          setTab('login');
        }, 1200);
      } else {
        setError(res.error || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
      }
    } catch {
      setError('Không thể đổi mật khẩu lúc này. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setLoginUsername('emilys');
    setLoginPassword('emilyspass');
    setError('');
  };

  const fillDemoForgotAccount = () => {
    setForgotIdentity('emilys@gmail.com');
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
              <p className="text-[11px] text-slate-400">
                {tab === 'forgot' ? 'Khôi phục mật khẩu' : 'Tài khoản thành viên'}
              </p>
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

        {/* Navigation / Tab Switcher */}
        {tab === 'forgot' ? (
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 m-4 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
                setSuccessMsg('');
                setForgotStep(1);
              }}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Quay lại đăng nhập</span>
            </button>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
              {forgotStep === 1 ? 'Bước 1/2: Nhận mã OTP' : 'Bước 2/2: Đổi mật khẩu'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/70 p-1 m-4 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
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
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Đăng Ký Mới
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="px-6 pb-6 pt-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-fadeIn">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
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
                    placeholder="ví dụ: emilys hoặc email của bạn"
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
                    onClick={() => {
                      setTab('forgot');
                      setError('');
                      setSuccessMsg('');
                      setForgotStep(1);
                      if (loginUsername && loginUsername !== 'emilys') {
                        setForgotIdentity(loginUsername);
                      }
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
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
                  className="px-2 py-1 rounded bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs transition cursor-pointer"
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
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
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
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <div>
              {forgotStep === 1 ? (
                /* STEP 1: Enter email or username */
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      Quên mật khẩu?
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Nhập địa chỉ email hoặc tên đăng nhập tài khoản TechZone của bạn. Hệ thống sẽ tạo mã OTP xác thực để cấp lại mật khẩu.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Email hoặc Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={forgotIdentity}
                        onChange={(e) => setForgotIdentity(e.target.value)}
                        placeholder="ví dụ: emilys@gmail.com hoặc emilys"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                      />
                    </div>
                  </div>

                  {/* Demo test shortcut */}
                  <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                    <div className="text-[11px] text-blue-800">
                      <span className="font-semibold">Thử nghiệm nhanh:</span> emilys@gmail.com
                    </div>
                    <button
                      type="button"
                      onClick={fillDemoForgotAccount}
                      className="px-2 py-1 rounded bg-white text-[11px] font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-2xs transition cursor-pointer"
                    >
                      ⚡ Điền mẫu
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition disabled:opacity-60 cursor-pointer"
                    style={{ backgroundColor: themeColor }}
                  >
                    {loading ? (
                      <span>Đang gửi mã...</span>
                    ) : (
                      <>
                        <span>Gửi Mã Xác Thực OTP</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                    >
                      Nhớ mật khẩu? Đăng nhập ngay
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: Enter OTP & New Password */
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>Mã OTP đã được tạo cho:</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 font-medium">
                      {forgotMaskedDestination}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 pl-6 text-[11px]">
                      <span className="text-slate-500">
                        Mã thử nghiệm: <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">{generatedOtp}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setForgotOtp(generatedOtp)}
                        className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                      >
                        Điền mã này
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mã xác thực OTP (6 số) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Nhập 6 số OTP (vd: 868999)"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nhập lại mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      disabled={forgotCountdown > 0 || resendLoading}
                      onClick={handleResendOtp}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:no-underline underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${resendLoading ? 'animate-spin' : ''}`} />
                      <span>
                        {forgotCountdown > 0
                          ? `Gửi lại mã sau (${forgotCountdown}s)`
                          : 'Chưa nhận được mã? Gửi lại'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setError('');
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Đổi tài khoản khác
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition disabled:opacity-60 cursor-pointer mt-2"
                    style={{ backgroundColor: themeColor }}
                  >
                    {loading ? (
                      <span>Đang cập nhật...</span>
                    ) : (
                      <>
                        <span>Xác Nhận Đổi Mật Khẩu</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
