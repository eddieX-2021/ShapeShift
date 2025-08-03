'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchTodayExercises, completeExercise } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Displays today's exercises with day-of-week header and completion state.
 */
type Task = { id: string; name: string };

export default function TodoExercise({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Get localized weekday name, e.g. "Sunday"
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    fetchTodayExercises(userId)
      .then(setTasks)
      .catch(console.error);
  }, [userId]);

  const handleCheck = async (taskId: string) => {
    try {
      await completeExercise(userId, taskId);
      setDone(d => new Set(d).add(taskId));
    } catch (e) {
      console.error(e);
    }
  };

  // No tasks: show placeholder with day header
  if (tasks.length === 0) {
    return (
      <Card className="rounded-lg border p-4 shadow bg-white">
        <CardContent className="text-center space-y-4">
          <h3 className="text-xl font-semibold">{dayName}</h3>
          <p className="text-sm text-muted-foreground">No exercises scheduled for today.</p>
          <Button onClick={() => router.push('/exercise')}>
            Plan Exercises
          </Button>
        </CardContent>
      </Card>
    );
  }

  const allDone = tasks.every(t => done.has(t.id));

  return (
    <Card className="rounded-lg border p-4 shadow bg-white space-y-4">
      <CardContent className="space-y-2">
        <h2 className="text-lg font-semibold">{dayName}'s Exercises</h2>

        {/* Completed state */}
        {allDone ? (
          <AnimatePresence>
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2 pt-2"
            >
              {tasks.map(t => (
                <div key={t.id} className="flex items-center gap-2">
                  <span className="text-green-500">✔</span>
                  <span className="line-through text-muted-foreground">{t.name}</span>
                </div>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-center font-medium text-green-600"
              >
                All tasks done today! 🎉
              </motion.p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="space-y-2">
            {tasks.map(t => (
              <Card key={t.id} className="overflow-hidden">
                <CardContent className="flex justify-between items-center">
                  <span className="flex-1 pr-2 line-clamp-2 break-words">{t.name}</span>
                  <Checkbox
                    checked={done.has(t.id)}
                    onCheckedChange={() => handleCheck(t.id)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}