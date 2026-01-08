import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/auth/AuthContext";
import AuthFormButton from "../components/AuthPage/AuthFormButton";
import AuthFormInput from "../components/AuthPage/AuthFormInput";
import AuthFormResult from "../components/AuthPage/AuthFormResult";
import { isValidPassword } from "../utils/validPassword";
import { ChefHatIcon } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === "login";
  const validPassword = isValidPassword(password);
  const passwordsMatch = password === passwordConf;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = e.target.email.value.trim();

    try {
      if (mode === "login") {
        await login(email, password);
        navigate("/pantry", { replace: true });
      } else {
        if (!passwordsMatch) {
          throw new Error("Passwords do not match");
        }
        await signup(email, password);
        setSuccess("Account successfully created! Please log in.");
        setMode("login");
        setPassword("");
        setPasswordConf("");
        setPasswordTouched(false);
      }
    } catch (err) {
      setSuccess(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <ChefHatIcon stroke="white" size={32}></ChefHatIcon>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-slate-900">
          PantryChef
        </h1>
        <p className="text-center text-slate-500 mt-2 mb-8">
          Transform your ingredients into delicious meals
        </p>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <AuthFormButton
            handleClick={() => setMode("login")}
            isLogin={isLogin}
          >
            Login
          </AuthFormButton>
          <AuthFormButton
            handleClick={() => setMode("signup")}
            isLogin={!isLogin}
          >
            Signup
          </AuthFormButton>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <AuthFormInput
            labelText="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            isRequired={true}
          ></AuthFormInput>
          <AuthFormInput
            labelText="Password"
            type="password"
            name="password"
            value={password}
            handleChange={(e) => {
              setPassword(e.target.value);
              setPasswordTouched(true);
            }}
            // We don't want to let user know if password is invalid
            // on signup for security reasons. User logging in will
            // already know password and the requirements.
            isInvalid={passwordTouched && !validPassword && !isLogin}
            placeholder="********"
            isRequired={true}
          ></AuthFormInput>
          {!isLogin && !validPassword && passwordTouched && (
            <AuthFormResult result={false}>
              Must be at least 8 characters and include a letter and number
            </AuthFormResult>
          )}
          {!isLogin && (
            <AuthFormInput
              labelText="Confirm Password"
              type="password"
              name="passwordConfirmation"
              value={passwordConf}
              handleChange={(e) => {
                setPasswordConf(e.target.value);
              }}
              placeholder="********"
              isRequired={true}
            ></AuthFormInput>
          )}

          {success && <AuthFormResult result={true}>{success}</AuthFormResult>}
          {error && <AuthFormResult result={false}>{error}</AuthFormResult>}

          <button
            type="submit"
            disabled={loading || (!isLogin && !validPassword)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 transition text-white font-semibold
              hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
