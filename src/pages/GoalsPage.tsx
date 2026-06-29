import { useState } from 'react'
import { motion } from 'framer-motion'
import PersonalGoals from '@/components/goals/PersonalGoals'
import GroupGoals from '@/components/groups/GroupGoals'

type Tab = 'personal' | 'group'

function GoalsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Target Tabungan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Kelola target keuangan pribadi dan bersama
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit mb-6">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'personal'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Target Pribadi
        </button>
        <button
          onClick={() => setActiveTab('group')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'group'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Target Bersama
        </button>
      </div>

      {/* Konten berdasarkan tab */}
      {activeTab === 'personal' ? <PersonalGoals /> : <GroupGoals />}
    </motion.div>
  )
}

export default GoalsPage