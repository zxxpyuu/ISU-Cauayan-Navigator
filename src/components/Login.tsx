import { ISU_INFO } from '../data/isuMetadata';
import '../script2.js';
import '../style2.css';

type LoginProps = {
  onSignIn: () => void;
};

export function Login({ onSignIn }: LoginProps) {
  return (
    <main className="auth-page">
      <section className="container" id="container">
        <div className="form-container sign-up">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSignIn();
            }}
          >
            <h1>Create Account</h1>
            <span>Register to explore the campus navigator</span>
            <input type="text" name="name" placeholder="Name" required autoComplete="name" />
            <input
              type="email"
              name="signup-email"
              placeholder="Email"
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="signup-password"
              placeholder="Password"
              required
              autoComplete="new-password"
            />
            <button type="submit">Sign Up</button>
            <button className="auth-mobile-switch" data-auth-mode="login" type="button">
              Already have an account? Sign in
            </button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSignIn();
            }}
          >
            <img
              className="auth-seal"
              src="/isu_new_seal_512x512.png"
              alt={`${ISU_INFO.name} seal`}
            />
            <h1>Sign In</h1>
            <span>{ISU_INFO.campus} Campus Navigator</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="current-password"
            />
            <button type="submit">Sign In</button>
            <p className="auth-note">
              Demo sign-in: any valid email and non-empty password will open the
              navigator. This does not verify an account.
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
              <p>Sign in to find your way around the ISU Cauayan campus.</p>
              <button className="hidden" data-auth-mode="login" type="button">
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Create an account and explore {ISU_INFO.campus} with the campus
                navigator.
              </p>
              <button className="hidden" data-auth-mode="register" type="button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
