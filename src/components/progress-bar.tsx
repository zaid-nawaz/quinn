
export const Progressbar = ({ value }: { value: number }) => {
  return (
    <div className="relative w-full bg-gray-200 rounded-lg h-4">
      
      {/* Progress Fill */}
      <div
        className="bg-green-500 h-4 rounded-lg transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>

      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black">
        {Math.round(value)}%
      </div>

    </div>
  );
};

