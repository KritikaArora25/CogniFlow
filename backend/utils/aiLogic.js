// Generate AI suggestions based on focus score
export const generateSuggestion = (score) => {
  if (score > 80) return "High focus! Start with challenging tasks like DSA and Web Dev projects.";
  if (score > 50) return "Moderate focus. Prioritize medium-difficulty tasks like coding practice or revisions.";
  return "Low focus today. Begin with light tasks like reading or reviewing notes.";
};

// Generate timetable JSON based on focus score
export const generateTimetable = (score) => {
  const tasksHigh = ["DSA Arrays", "Web Dev Project", "Algorithm Practice"];
  const tasksMedium = ["Revision", "Reading", "Mini Projects"];
  const tasksLow = ["Notes Review", "Light Reading", "Organize Study Material"];

  let tasks = score > 80 ? tasksHigh : score > 50 ? tasksMedium : tasksLow;

  const timetable = [];
  let hour = 8; // start at 8 AM

  tasks.forEach(task => {
    timetable.push({
      task,
      start: `${hour.toString().padStart(2, "0")}:00`,
      end: `${(hour + 1).toString().padStart(2, "0")}:00`
    });
    timetable.push({
      task: "Break",
      start: `${(hour + 1).toString().padStart(2, "0")}:00`,
      end: `${(hour + 1).toString().padStart(2, "0")}:15`
    });
    hour += 1;
  });

  return timetable;
};
