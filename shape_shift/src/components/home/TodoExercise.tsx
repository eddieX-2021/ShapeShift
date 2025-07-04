'use client';

import React, { useEffect, useState } from 'react';
import { useRouter }                     from 'next/navigation';

import {
  fetchTodayExercises,
  completeExercise
} from '@/lib/api';

import { Card, CardContent } from '@/components/ui/card';
import { Button }            from '@/components/ui/button';
import { Checkbox }          from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';

type Task = { id: string; name: string };

export default function TodoExercise({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [done,  setDone]  = useState<Set<string>>(new Set());
  const router = useRouter();

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

  if (!tasks.length) {
    return (
      <div className="rounded-lg border p-4 shadow text-sm text-muted-foreground">
        No exercises scheduled.{' '}
        <Button size="sm" onClick={() => router.push('/exercise')}>
          Plan Exercises
        </Button>
      </div>
    );
  }

  const allDone = tasks.every(t => done.has(t.id));

  return (
    <div className="rounded-lg border p-4 shadow space-y-2">
      <h2 className="text-lg font-semibold">Today's Exercises</h2>
      {allDone ? (
        <AnimatePresence>
          <motion.div
            key="done"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {tasks.map(t => (
              <div key={t.id} className="flex items-center gap-2 p-2">
                <span className="text-green-500">✔</span>
                <span className="line-through">{t.name}</span>
              </div>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center font-semibold"
            >
              All tasks done today! 🎉
            </motion.p>
          </motion.div>
        </AnimatePresence>
      ) : (
        tasks.map(t => (
          <Card key={t.id}>
            <CardContent className="flex justify-between items-center">
              <span>{t.name}</span>
              <Checkbox
                checked={done.has(t.id)}
                onCheckedChange={() => handleCheck(t.id)}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
