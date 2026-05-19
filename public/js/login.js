import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AuthLayout showPic={true}>
            <Head title="Login" />

            <div className="auth-bow">🎀</div>
            <h1 className="auth-title">Welcome!</h1>
            <p className="auth-subtitle">Login now to save your strips to our cloud gallery</p>

            {status && <div className="auth-success">{status}</div>}

            <form onSubmit={submit}>
                <div className="auth-grid single" style={{ gap: 14, marginBottom: 0 }}>
                    <div>
                        <div className="auth-input-wrap">
                            <span className="ico">✉️</span>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="Email"
                                autoComplete="username"
                                autoFocus
                            />
                        </div>
                        {errors.email && <p className="field-error">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="auth-input-wrap">
                            <span className="ico">🔒</span>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Password"
                                autoComplete="current-password"
                            />
                        </div>
                        {errors.password && <p className="field-error">{errors.password}</p>}
                    </div>
                </div>

                <div className="auth-meta">
                    <label className="auth-remember">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                        />
                        Remember me
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="auth-link">
                            Forgot Password?
                        </Link>
                    )}
                </div>

                <div className="auth-btn-row">
                    <button type="submit" className="btn-pink" disabled={processing}>
                        Login Now
                    </button>
                    <Link href={route('register')} className="btn-white" style={{ textDecoration: 'none', textAlign: 'center', lineHeight: 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Sign Up
                    </Link>
                </div>

                <p className="auth-or">Or login with</p>

                <a href={route('auth.google')} className="btn-google" style={{ textDecoration: 'none' }}>
                    <GoogleIcon />
                    Login With Google
                </a>
            </form>
        </AuthLayout>
    );
}

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
    );
}