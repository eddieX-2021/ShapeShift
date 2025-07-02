// src/components/home/TodoExercise.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Task = { id: string; name: string };

export default function TodoExercise({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`/api/exercise/today?userId=${userId}`)
      .then((res) => setTasks(res.data))
      .catch(console.error);
  }, [userId]);

  const handleCheck = async (taskId: string) => {
    try {
      await axios.post("/api/exercise/complete", { userId, taskId });
      setDone((s) => new Set(s).add(taskId));
    } catch (e) {
      console.error(e);
    }
  };

  const allDone = tasks.length > 0 && tasks.every((t) => done.has(t.id));

  return (
    <div className="rounded-lg border p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Today's Exercises</h2>
      {tasks.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No exercises scheduled.{" "}
          <Button size="sm" onClick={() => router.push("/exercise")}>
            Plan Exercises
          </Button>
        </div>
      ) : allDone ? (
        <AnimatePresence>
          <motion.div
            key="all-done"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {tasks.map((t) => (
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
        <div className="space-y-2">
          {tasks.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex items-center justify-between">
                <span>{t.name}</span>
                <Checkbox
                  checked={done.has(t.id)}
                  onCheckedChange={() => handleCheck(t.id)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
