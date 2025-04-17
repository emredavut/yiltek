import React from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface AccessoryProps {
  name: string;
  description?: string;
  image?: string;
  onClick: (image?: string) => void;
}

const AccessoryCard: React.FC<AccessoryProps> = ({
  name,
  description,
  image,
  onClick,
}) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 aspect-square">
      {image && (
        <div
          className="w-full h-full cursor-pointer overflow-hidden rounded-md flex items-center justify-center"
          onClick={() => onClick(image)}
        >
          <img
            src={`{API_URL}${image}`}
            alt={name || "Aksesuar Görseli"}
            className="object-contain max-h-full max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default AccessoryCard;
