export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <div className="mt-24 text-center space-y-4">
        <h1 className="text-5xl font-bold">
          Welcome to <span className="text-black">ShapeShift</span> 💪
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Your AI-powered fitness assistant: track progress, plan workouts,
          and eat healthier.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/login"
            className="px-6 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Register
          </a>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl w-full">
        {/* Track Progress */}
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <img
            src="/images/progress.jpg"
            alt="Track Progress"
            className="rounded-lg mb-4 h-40 w-full object-cover"
          />
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">
            Log weight, BMI, and body fat over time with clear insights.
          </p>
        </div>

        {/* AI Workout Plans */}
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <img
            src="/images/workout.jpg"
            alt="AI Workout Plans"
            className="rounded-lg mb-4 h-40 w-full object-cover"
          />
          <h3 className="text-xl font-semibold mb-2">AI Workout Plans</h3>
          <p className="text-gray-600">
            Get personalized AI-generated workout plans tailored to you.
          </p>
        </div>

        {/* Diet & Nutrition */}
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <img
            src="/images/nutrition.jpg"
            alt="Diet and Nutrition"
            className="rounded-lg mb-4 h-40 w-full object-cover"
          />
          <h3 className="text-xl font-semibold mb-2">Diet & Nutrition</h3>
          <p className="text-gray-600">
            Plan meals, track macros, and hit your nutrition goals.
          </p>
        </div>
      </div>
    </div>
  );
}
