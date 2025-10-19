import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Activity, Apple, Flame } from "lucide-react";

export default function ProfileSummary() {
  const profile = {
    id: "be239de0-7e25-4a14-90b1-7622b21e40ef",
    name: "Sergio Acosta",
    age: 21,
    sex: "male",
    height_cm: 190,
    weight_kg: 95,
    goal: "maintain_weight",
    activity_level: "moderately_active",
    dietary_preferences: ["vegetarian"],
    allergies: ["peanuts"],
    disliked_foods: ["broccoli"],
    bmi: 22.7,
    daily_calorie_target: 2450,
  };

  return (
    <motion.div
      className="max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-white to-slate-50 shadow-lg border border-slate-200 rounded-2xl p-4">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14 border border-slate-200">
            <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.name}`} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-slate-500">
              {profile.age} • {profile.sex} • {profile.height_cm} cm / {profile.weight_kg} kg
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-100 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Calories</span>
              </div>
              <p className="text-slate-700 mt-1">{profile.daily_calorie_target} kcal/day</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Activity</span>
              </div>
              <p className="text-slate-700 mt-1 capitalize">{profile.activity_level.replace("_", " ")}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Apple className="h-4 w-4 text-green-500" />
              <span className="font-medium">Goal</span>
            </div>
            <p className="text-slate-700 capitalize">{profile.goal.replace("_", " ")}</p>
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <span className="font-medium text-slate-600">BMI</span>
            <span className="font-semibold text-slate-700">{profile.bmi}</span>
          </div>
          <Progress value={(profile.bmi / 40) * 100} className="h-2" />

          <div className="pt-3 text-sm space-y-1">
            <p><span className="font-medium text-slate-600">Diet:</span> {profile.dietary_preferences.join(", ")}</p>
            <p><span className="font-medium text-slate-600">Allergies:</span> {profile.allergies.join(", ")}</p>
            <p><span className="font-medium text-slate-600">Dislikes:</span> {profile.disliked_foods.join(", ")}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
