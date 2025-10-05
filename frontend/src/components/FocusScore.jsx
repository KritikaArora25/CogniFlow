import React from 'react';

function FocusScore({ score = 85, distractedTime = '15 mins' }) {
  const radius = 45;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (circumference * score) / 100;

  // Decide color dynamically
  let colorClass = "text-green-500"; 
  if (score < 40) {
    colorClass = "text-red-500";
  } else if (score < 70) {
    colorClass = "text-orange-400";
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">Focus Score</h2>

      {/* Circular progress bar */}
      <div className="relative w-32 h-32 mb-4">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            className={`${colorClass} transition-all duration-700 ease-in-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {score}%
        </div>
      </div>

      <p className="text-gray-500">Distracted: {distractedTime}</p>
    </div>
  );
}

export default FocusScore;
