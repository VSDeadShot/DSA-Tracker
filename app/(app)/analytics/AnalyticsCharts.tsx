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

const COLORS = ['#ffffff', '#e5e5e5', '#cccccc', '#b3b3b3', '#999999', '#808080']

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
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] transition-all hover:-translate-y-1 hover:border-white/50 group flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-[#a0a0a0] group-hover:text-white transition-colors">Total Problems</h3>
            <p className="mt-2 text-5xl font-bold text-white">{totalProblems}</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] transition-all hover:-translate-y-1 hover:border-white/50 group flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-[#a0a0a0] group-hover:text-white transition-colors">Unique Topics</h3>
            <p className="mt-2 text-5xl font-bold text-white">{totalTopics}</p>
          </div>
        </div>

        {/* Platform Distribution Pie Chart */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] transition-all hover:border-white/50 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Problems by Platform</h3>
          {platformData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-[#555555]">No data available</div>
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
                    contentStyle={{ backgroundColor: '#111111', borderRadius: '12px', border: '1px solid #2a2a2a', color: '#ffffff' }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Legend wrapperStyle={{ color: '#a0a0a0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Topic Weakness Bar Chart (Full Width & Taller) */}
      <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-[#2a2a2a] transition-all hover:border-white/50 w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Topic Confidence</h3>
          <p className="text-sm text-[#a0a0a0]">Average confidence score per topic (1 to 5). Lower means you need more practice.</p>
        </div>
        
        {topicData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-[#555555]">No data available</div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis dataKey="topic" tick={{ fill: '#a0a0a0', fontSize: 12 }} tickMargin={15} stroke="#2a2a2a" />
                <YAxis domain={[0, 5]} tick={{ fill: '#a0a0a0', fontSize: 12 }} stroke="#2a2a2a" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111111', borderRadius: '12px', border: '1px solid #2a2a2a', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="avgConfidence" name="Avg Confidence" radius={[6, 6, 0, 0]}>
                  {topicData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#ffffff" 
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
