import { createContext, useContext, useEffect, useState } from 'react'
import client from '../api/client'

const SettingsContext = createContext(null)

const FALLBACK = {
  org_name: 'Close The Ranks Initiatives (C.T.R.I)',
  org_short_name: 'C.T.R.I',
  org_tagline: 'Closing the ranks. Lifting communities together.',
  org_mission:
    'To unite hands across communities in Niger State and beyond — closing the ranks between the vulnerable and the support they need.',
  org_email: 'closetr.intiative@gmail.com',
  org_phone: '09039481919',
  org_address: "Beside St. John's Catholic Church, Chanchaga, Minna, Niger State",
  hero_headline: 'Closing the ranks, one community at a time.',
  hero_subheadline: 'C.T.R.I brings people, resources and hope together for the communities of Niger State.',
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .get('/settings')
      .then((res) => {
        if (res.data && Object.keys(res.data).length) {
          setSettings({ ...FALLBACK, ...res.data })
        }
      })
      .catch(() => {
        // keep fallback silently — public site should never hard-fail on this
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
