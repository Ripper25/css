
interface OperationalNeedCardProps {
  title: string;
  description: string;
}

const OperationalNeedCard = ({ title, description }: OperationalNeedCardProps) => {
  return (
    <div className="mb-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl p-5 shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/90">{description}</p>
    </div>
  );
};

export default OperationalNeedCard;
