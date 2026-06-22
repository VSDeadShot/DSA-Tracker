'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#f43f5e']

export default function AnalyticsCharts({
  platformData,
  topicData,
}: {
  platformData: { name: string; value: number }[]
  topicData: { topic: string; avgConfidence: number }[]
}) {
  const totalProblems = platformData.reduce((sum, item) => sum + item.value, 0)
  const totalTopics = topicData.length

  return (
    <div className="flex flex-col gap-8">
      {/* Top Row: Stats & Platform Distribution */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Stats Sidebar */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 transition-all hover:-translate-y-1 hover:border-indigo-500/50 group flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">Total Problems</h3>
            <p className="mt-2 text-5xl font-bold text-white">{totalProblems}</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 transition-all hover:-translate-y-1 hover:border-indigo-500/50 group flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">Unique Topics</h3>
            <p className="mt-2 text-5xl font-bold text-white">{totalTopics}</p>
          </div>
        </div>

        {/* Platform Distribution Pie Chart */}
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 transition-all hover:border-slate-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Problems by Platform</h3>
          {platformData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-slate-500">No data available</div>
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="rgba(0,0,0,0.1)"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Topic Weakness Bar Chart (Full Width & Taller) */}
      <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 transition-all hover:border-slate-700 w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Topic Confidence</h3>
          <p className="text-sm text-slate-400">Average confidence score per topic (1 to 5). Lower means you need more practice.</p>
        </div>
        
        {topicData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-slate-500">No data available</div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 12 }} tickMargin={15} stroke="#334155" />
                <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="#334155" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="avgConfidence" name="Avg Confidence" radius={[6, 6, 0, 0]}>
                  {topicData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.avgConfidence < 3 ? '#f43f5e' : entry.avgConfidence < 4 ? '#f59e0b' : '#10b981'} 
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
