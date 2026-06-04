import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { getErrorMessage } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login: storeLogin } = useAuthStore();
  const { addToast } = useUiStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ username, password });
      storeLogin(res.data.token, res.data.username);
      navigate('/admin/dashboard');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '用户名或密码错误');
      setError(msg || '用户名或密码错误');
      if (msg) addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-grid-bg" aria-hidden="true" />
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">
            <span className="logo-bracket">&lt;</span>Admin<span className="logo-bracket">/&gt;</span>
          </h1>
          <p className="login-subtitle">个人站点管理后台</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-banner" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">用户名</label>
            <div className="input-icon-wrap">
              <User size={15} className="input-icon-left" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="admin"
                required
                autoComplete="username"
                className="input-with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">密码</label>
            <div className="input-password-wrap input-icon-wrap">
              <Lock size={15} className="input-icon-left" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="input-with-icon"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-loading">
                <span className="login-spinner" />
                登录中...
              </span>
            ) : '登 录'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
