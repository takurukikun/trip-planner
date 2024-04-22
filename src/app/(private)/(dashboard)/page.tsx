
import { ModalFilterDashboard } from './components/summary/modal'
import { SummaryDashboard } from '@/app/(private)/(dashboard)/components/summary'

export default function Home() {
  return (
    <div className="flex flex-wrap 2xl:flex-nowrap">
      <ModalFilterDashboard />
      <SummaryDashboard />
    </div>
  )
}
