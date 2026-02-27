import { useState } from "react";
import { http } from "../api/http";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin#123");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await http.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);

      setSuccess(`Logged in as ${res.data.user.role}`);
      const role = res.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/products", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-white">

      <main className="mx-auto flex max-w-6xl items-start justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {(success || error) && (
            <div className="mb-6 space-y-2">
              {success && (
                <div
                  data-testid="login-success"
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {success}
                </div>
              )}
              {error && (
                <div
                  data-testid="login-error"
                  className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}
            </div>
          )}

          <h1 className="text-center text-3xl font-semibold tracking-widest">
            WELCOME BACK!
          </h1>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-gray-700">
                EMAIL*
              </label>
              <input
                data-testid="login-email"
                className="mt-2 w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-widest text-gray-700">
                PASSWORD*
              </label>
              <input
                data-testid="login-password"
                type="password"
                className="mt-2 w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              data-testid="login-submit"
              className="mt-2 w-full rounded-md bg-black px-4 py-3 text-xs font-semibold tracking-[0.25em] text-white transition hover:bg-gray-900"
              type="submit"
            >
              LOG IN
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                className="text-[11px] font-medium tracking-widest text-gray-500 hover:text-black"
                onClick={() => alert("Forgot password flow not implemented yet")}
              >
                FORGOT YOUR PASSWORD?
              </button>
            </div>
          </form>

          {/* divider */}
          <div className="my-10 h-px w-full bg-gray-200" />

          {/* create account block */}
          <div className="text-center">
            <div className="text-lg font-semibold tracking-widest">
              DON'T HAVE AN
              <br />
              ACCOUNT?
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-md border border-black bg-white px-4 py-3 text-xs font-semibold tracking-[0.25em] text-black transition hover:bg-black hover:text-white"
              onClick={() => alert("Create account page not implemented yet")}
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </main>


    </div>
  );
}