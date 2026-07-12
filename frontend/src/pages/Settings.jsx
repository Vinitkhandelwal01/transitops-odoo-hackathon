import { useEffect, useState } from 'react'
import { settingsApi } from '../services/api.js'

const displaySymbol = { check: '✓', view: 'view', '--': '--' }

export default function Settings() {
  const [form, setForm] = useState({ depotName: '', currency: '', distanceUnit: '' })
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [settingsRes, rbacRes] = await Promise.all([
          settingsApi.get(),
          settingsApi.getRbac(),
        ])

        setForm({
          depotName: settingsRes.data.depotName || '',
          currency: settingsRes.data.currency || '',
          distanceUnit: settingsRes.data.distanceUnit || '',
        })
        setPermissions(rbacRes.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccessMsg('')

    try {
      await settingsApi.update(form)
      setSuccessMsg('Settings saved successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    loading ? (
      <div className="text-sm text-zinc-500">Loading settings...</div>
    ) : (
      <div className="grid gap-16 xl:grid-cols-[360px_minmax(520px,1fr)] xl:gap-32">
        <section>
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-zinc-200">
            General
          </h2>

          {error ? (
            <p className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          ) : null}
          {successMsg ? (
            <p className="mb-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {successMsg}
            </p>
          ) : null}

          <form className="space-y-3" onSubmit={handleSave}>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                Depot Name
              </span>
              <input
                name="depotName"
                value={form.depotName}
                onChange={updateField}
                className="h-8 w-full rounded-[6px] border border-[#4b5563] bg-[#151617] px-3 text-[12px] font-semibold text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-sky-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                Currency
              </span>
              <input
                name="currency"
                value={form.currency}
                onChange={updateField}
                className="h-8 w-full rounded-[6px] border border-[#4b5563] bg-[#151617] px-3 text-[12px] font-semibold text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-sky-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                Distance Unit
              </span>
              <input
                name="distanceUnit"
                value={form.distanceUnit}
                onChange={updateField}
                className="h-8 w-full rounded-[6px] border border-[#4b5563] bg-[#151617] px-3 text-[12px] font-semibold text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-sky-500"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 h-10 w-[170px] rounded-[8px] bg-sky-500 px-4 text-[12px] font-semibold text-black hover:bg-sky-400 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>

        <section className="mt-2 xl:mt-0">
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-zinc-200">
            Role Based Access (RBAC)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                <tr>
                  <th className="px-2 py-2 font-semibold">Role</th>
                  <th className="px-2 py-2 text-center font-semibold">Fleet</th>
                  <th className="px-2 py-2 text-center font-semibold">Drivers</th>
                  <th className="px-2 py-2 text-center font-semibold">Trips</th>
                  <th className="px-2 py-2 text-center font-semibold">Fuel/Exp.</th>
                  <th className="px-2 py-2 text-center font-semibold">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242526] border-t border-[#242526] text-[12px] font-semibold text-zinc-300">
                {permissions.map((permission) => (
                  <tr key={permission.role}>
                    <td className="px-2 py-3 text-zinc-100">{permission.role}</td>
                    <td className="px-2 py-3 text-center">{displaySymbol[permission.fleet]}</td>
                    <td className="px-2 py-3 text-center">{displaySymbol[permission.drivers]}</td>
                    <td className="px-2 py-3 text-center">{displaySymbol[permission.trips]}</td>
                    <td className="px-2 py-3 text-center">{displaySymbol[permission.fuel]}</td>
                    <td className="px-2 py-3 text-center">{displaySymbol[permission.analytics]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  )
}
