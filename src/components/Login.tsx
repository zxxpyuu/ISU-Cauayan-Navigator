import { useState } from 'react';
import type { FormEvent } from 'react';
import { ISU_INFO } from '../data/isuMetadata';
import { supabase } from '../lib/supabase';
import '../../script2.js';
import '../../style2.css';

const ISU_EMAIL_PATTERN = '^[A-Za-z0-9]+\\.[A-Za-z0-9]+_cyn@isu\\.edu\\.ph$';
const isIsuEmail = (email: string) =>
  /^[a-z0-9]+\.[a-z0-9]+_cyn@isu\.edu\.ph$/i.test(email.trim());

export function Login() {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    if (!supabase) {
      setMessage('Authentication is not configured yet. Please contact the app administrator.');
      setIsError(true);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');

    if (!isIsuEmail(email)) {
      setMessage('Use the email format name.surname_cyn@isu.edu.ph.');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    if (!supabase) {
      setMessage('Authentication is not configured yet. Please contact the app administrator.');
      setIsError(true);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('signup-email') ?? '').trim().toLowerCase();
    const password = String(formData.get('signup-password') ?? '');

    if (!isIsuEmail(email)) {
      setMessage('Use the email format name.surname_cyn@isu.edu.ph.');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      form.reset();
      document.getElementById('container')?.classList.remove('active');
      setMessage('Check your ISU inbox and confirm your email, then sign in here with your password.');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Unable to create the account.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="container active" id="container">
        <div className="form-container sign-up">
          <form onSubmit={submitSignUp}>
            <h1>Create Account</h1>
            <span>Register with your ISU Cauayan account email</span>
            <input type="text" name="name" placeholder="Name" required autoComplete="name" />
            <input
              type="email"
              name="signup-email"
              placeholder="name.surname_cyn@isu.edu.ph"
              required
              pattern={ISU_EMAIL_PATTERN}
              title="Use the format name.surname_cyn@isu.edu.ph"
              autoComplete="email"
            />
            <input
              type="password"
              name="signup-password"
              placeholder="Password (at least 8 characters)"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Sign Up'}
            </button>
            <button className="auth-switch-link" data-auth-mode="login" type="button">
              Already have an account? Log In
            </button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={submitSignIn}>
            <img
              className="auth-seal"
              src="/isu_new_seal_512x512.png"
              alt={`${ISU_INFO.name} seal`}
              width={76}
              height={76}
            />
            <h1>Sign In</h1>
            <span>{ISU_INFO.campus} Campus Navigator</span>
            <input
              type="email"
              name="email"
              placeholder="name.surname_cyn@isu.edu.ph"
              required
              pattern={ISU_EMAIL_PATTERN}
              title="Use the format name.surname_cyn@isu.edu.ph"
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="current-password"
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Sign In'}
            </button>
            <p className="auth-note">
              Use your name.surname_cyn@isu.edu.ph email and account password to sign in.
            </p>
            <button className="auth-mobile-switch" data-auth-mode="register" type="button">
              Create an account
            </button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Sign in with your ISU account to explore the Cauayan campus.</p>
              <button className="hidden" data-auth-mode="login" type="button">
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Create an account with your verified ISU email to use the campus navigator.</p>
              <button className="hidden" data-auth-mode="register" type="button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
        {!supabase && (
          <p className="auth-feedback is-error" role="alert">
            Authentication is not configured. Contact the app administrator.
          </p>
        )}
        {message && (
          <p
            className={`auth-feedback ${isError ? 'is-error' : 'is-success'}`}
            role={isError ? 'alert' : 'status'}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
