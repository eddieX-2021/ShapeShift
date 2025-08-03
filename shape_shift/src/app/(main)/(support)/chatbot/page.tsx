import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function ChatbotPage() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
      <Card>
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Our AI-powered chatbot is on the way! Please check back in the next
            update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
