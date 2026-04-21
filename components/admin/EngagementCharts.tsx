'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, Users, Clock, MousePointer2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

interface AnalyticsData {
  dailyStats: Array<{ day: string; views: number; visitors: number }>;
  sessionStats: Array<{ day: string; avgDuration: number }>;
  topPages: Array<{ path: string; views: number }>;
  hourlyStats: Array<{ hour: number; count: number }>;
}

export default function EngagementCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center text-foreground/50">Loading analytics...</div>;
  }

  if (!data || data.dailyStats.length === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-foreground/30">
        <TrendingUp size={48} className="mb-4 opacity-10" />
        <p className="font-display text-xs uppercase tracking-widest">No engagement data yet</p>
      </div>
    );
  }

  const chartColor = 'var(--primary)';
  const secondaryColor = 'var(--secondary)';
  const accentColor = 'var(--accent)';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Traffic Chart */}
        <GlassCard className="h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Users size={20} className="text-primary" /> Traffic Overview
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyStats}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-high)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke={chartColor} 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  strokeWidth={2}
                  name="Page Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke={secondaryColor} 
                  fill="transparent" 
                  strokeWidth={2}
                  name="Unique Visitors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Duration Chart */}
        <GlassCard className="h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-secondary" /> Avg. Engagement Time
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sessionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} unit="s" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-high)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="avgDuration" fill={secondaryColor} radius={[4, 4, 0, 0]} name="Seconds">
                  {data.sessionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.sessionStats.length - 1 ? accentColor : secondaryColor} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Pages */}
        <GlassCard className="lg:col-span-1">
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <MousePointer2 size={20} className="text-accent" /> Popular Content
          </h3>
          <div className="space-y-4">
            {data.topPages.map((page, i) => (
              <div key={page.path} className="flex items-center justify-between p-3 bg-surface-high/50 rounded-xl border border-outline/5 hover:border-primary/20 transition-all group">
                <span className="text-sm font-body text-foreground/80 truncate max-w-[200px]">{page.path}</span>
                <span className="text-xs font-bold font-display bg-surface-high px-2 py-1 rounded text-primary group-hover:bg-primary group-hover:text-black transition-colors">{page.views}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Peak Hours */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" /> Hourly Engagement (Last 24h Activity)
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(h) => `${h}h`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-high)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke={accentColor} strokeWidth={3} dot={{ fill: accentColor, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
