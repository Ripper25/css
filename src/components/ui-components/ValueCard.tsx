
interface ValueCardProps {
  number: number;
  title: string;
}

const ValueCard = ({ number, title }: ValueCardProps) => {
  return (
    <div className="ios-card mb-4 flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
        {number}
      </div>
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    </div>
  );
};

export default ValueCard;
