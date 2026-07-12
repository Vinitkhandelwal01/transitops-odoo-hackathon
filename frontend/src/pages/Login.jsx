import { useState } from 'react'
import { AlertTriangle, Check, Eye, EyeOff, LockKeyhole, Route, Truck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/common/button.jsx'
import { Field, Input, Select } from '../components/common/input.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const roles = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst']

const roleAccess = [
  'Fleet Manager: Fleet, Maintenance',
  'Dispatcher: Dashboard, Trips',
  'Safety Officer: Drivers, Compliance',
  'Financial Analyst: Fuel, Expenses, Analytics',
]

const initialValues = {
  email: '',
  password: '',
  role: 'Dispatcher',
  remember: true,
}

export default function Login() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destination = location.state?.from?.pathname || '/dashboard'

  const updateField = (event) => {
    const { name, type, checked, value } = event.target
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!values.password) {
      nextErrors.password = 'Password is required'
    }

    if (!values.role) {
      nextErrors.role = 'Select a role'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    if (!validate()) {
      return
    }

    try {
      await login(values)
      navigate(destination, { replace: true })
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Invalid credentials. Please verify your login details.',
      )
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f10] text-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">
        <section className="flex min-h-[42vh] flex-col justify-between bg-[#cdd2d8] px-8 py-10 text-zinc-950 md:px-14 lg:min-h-screen">
          <div>
            <div className="grid size-12 place-items-center rounded-xl border border-orange-700/50 bg-orange-600/10">
              <Route className="size-6 text-orange-700" />
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-zinc-950">TransitOps</h1>
            <p className="mt-1 text-sm text-zinc-700">Smart Transport Operations Platform</p>
          </div>

          <div className="my-12">
            <p className="text-lg font-semibold">One login, four roles:</p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-800">
              {roles.map((role) => (
                <li key={role} className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-orange-700" />
                  {role}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            TransitOps 2026 · RBAC Enabled
          </p>
        </section>

        <section className="relative flex items-center justify-center border-l border-zinc-800 px-6 py-12 md:px-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

          <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md" noValidate>
            <div className="mb-8 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-xl border border-orange-500/30 bg-orange-500/10">
                <Truck className="size-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Sign in to your account</h2>
                <p className="mt-1 text-sm text-zinc-500">Enter your credentials to continue</p>
              </div>
            </div>

            {serverError ? (
              <div className="mb-5 rounded-xl border border-red-400/70 bg-red-500/10 p-4 text-sm text-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Error state</p>
                    <p className="mt-1">{serverError}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-5">
              <Field label="Email" error={errors.email}>
                <Input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={updateField}
                  placeholder="raven.k@transitops.in"
                />
              </Field>

              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={updateField}
                    placeholder="Password"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Role / RBAC" error={errors.role}>
                <Select name="role" value={values.role} onChange={updateField}>
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-zinc-400">
                <input
                  type="checkbox"
                  name="remember"
                  checked={values.remember}
                  onChange={updateField}
                  className="size-4 rounded border-zinc-700 bg-zinc-950 accent-orange-600"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-sky-400 hover:text-sky-300">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              <LockKeyhole className="size-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="mt-6 border-t border-zinc-800 pt-5 text-xs leading-6 text-zinc-500">
              <p>Access is scoped by role after login:</p>
              {roleAccess.map((item) => (
                <p key={item} className="flex items-start gap-2">
                  <Check className="mt-1 size-3 text-orange-500" />
                  {item}
                </p>
              ))}
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
