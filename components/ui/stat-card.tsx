'use client';

import { motion } from 'framer-motion';
import { DivideIcon  } from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className = ""
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className="premium-card hover-lift border-0 overflow-hidden group">
        <CardContent className="p-6 relative">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Icon className="h-6 w-6 text-white" />
              </motion.div>
              
              {trend && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className={`
                      flex items-center gap-1 px-2 py-1 text-xs font-medium
                      ${trend.isPositive 
                        ? 'bg-green-100/80 text-green-700 border-green-200/50' 
                        : 'bg-red-100/80 text-red-700 border-red-200/50'
                      }
                      backdrop-blur-sm
                    `}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {trend.value}%
                  </Badge>
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-white/80 tracking-wide">
                {title}
              </p>
              
              <motion.p 
                className="text-3xl font-bold text-white gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                {value}
              </motion.p>
              
              <motion.p 
                className="text-sm text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {description}
              </motion.p>
            </div>
          </div>

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
            style={{ transform: 'skewX(-20deg)' }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}