import { generateDataPoints } from '@/lib/dataGenerator'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const initialData = generateDataPoints(1000)
  return <DashboardClient initialData={initialData} />
}
