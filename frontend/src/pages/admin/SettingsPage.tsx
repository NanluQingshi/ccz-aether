import React, { useState } from 'react';
import { adminChangePassword } from '../../api/auth';
import { getErrorMessage } from '../../api/client';
import { useUiStore } from '../../store/uiStore';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useUiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast('新密码长度不能少于 6 位', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('两次输入的新密码不一致', 'error');
      return;
    }
    setSaving(true);
    try {
      await adminChangePassword(currentPassword, newPassword);
      addToast('密码已修改，请重新登录', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: unknown) {
      const msg = getErrorMessage(e, '修改失败');
      if (msg) addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">账号设置</h1>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <KeyRound size={16} />
          <span>修改密码</span>
        </div>
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">当前密码</label>
            <div className="input-password-wrap">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="输入当前密码"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setShowCurrent((v) => !v)}
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">新密码</label>
            <div className="input-password-wrap">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="至少 6 位"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="再次输入新密码"
            />
          </div>

          <div className="settings-form-footer">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            >
              {saving ? '保存中...' : '修改密码'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
