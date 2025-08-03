import CombinedIntakeForm from "@/components/forms/IntakeForm";

export default function IntakePage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold">Daily Intake</h2>
        <CombinedIntakeForm />
      </div>
    </div>
  );
}
