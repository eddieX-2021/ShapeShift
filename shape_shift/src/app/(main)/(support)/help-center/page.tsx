import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function HelpCenterPage() {
  const features = [
    '📊 Dashboard: track weight, BMI & body-fat over time',
    '🍽️ Daily Intake: log meals & see nutrition breakdown',
    '🏋️ Exercise Plan: generate and track workouts',
    '🥗 Diet Planner: build & save meal plans',
    '🤖 AI Chatbot: ask fitness & nutrition questions (coming soon)',
    '⚙️ Account & Billing: manage your profile & subscription',
    '✉️ Feedback: send us your thoughts'
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Help Center</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {features.map((feat, i) => (
              <li key={i}>{feat}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
