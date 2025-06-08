import { GeneralInfoForm } from "@/components/forms/GeneralInfoForm";
import { IntakeWeightForm } from "@/components/forms/IntakeWeightForm";
import { IntakeBMIForm } from "@/components/forms/IntakeBMIForm";
import { IntakeBodyFatForm } from "@/components/forms/IntakeBodyFatForm";

export default function IntakePage() {
  return (
    <div className="p-6 space-y-10">
      <GeneralInfoForm />
      <h2 className="text-2xl font-bold">Daily Intake</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border p-4 shadow"><IntakeWeightForm /></div>
        <div className="rounded-lg border p-4 shadow"><IntakeBMIForm /></div>
        <div className="rounded-lg border p-4 shadow"><IntakeBodyFatForm /></div>
      </div>
    </div>
  );
}
